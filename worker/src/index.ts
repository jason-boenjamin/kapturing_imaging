// Cloudflare Worker backend for the Kapture Imaging contact form.
// Accepts JSON POST at /contact, validates, enforces rate limits + honeypot,
// then forwards the message to TO_EMAIL via the Resend API.

interface RateLimiter {
	limit(args: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
	TO_EMAIL: string;
	ALLOWED_ORIGIN: string;
	FROM_ADDRESS: string;
	RESEND_API_KEY: string;
	RL_BURST: RateLimiter;
	RL_DAILY: RateLimiter;
}

// Pragmatic email regex — covers common cases without trying to implement RFC 5322.
// Disallows leading/trailing dots in local part, requires a valid-looking TLD.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

function corsHeaders(origin: string): HeadersInit {
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'content-type',
		'Access-Control-Max-Age': '86400',
		Vary: 'Origin'
	};
}

function json(body: unknown, init: ResponseInit = {}, cors?: HeadersInit): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			...(cors ?? {}),
			...(init.headers ?? {})
		}
	});
}

function resolveOrigin(req: Request, env: Env): string {
	const reqOrigin = req.headers.get('origin') ?? '';
	if (env.ALLOWED_ORIGIN === '*') return '*';
	return reqOrigin === env.ALLOWED_ORIGIN ? reqOrigin : env.ALLOWED_ORIGIN;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const origin = resolveOrigin(request, env);
		const cors = corsHeaders(origin);

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: cors });
		}

		if (url.pathname !== '/contact') {
			return json({ error: 'not found' }, { status: 404 }, cors);
		}

		if (request.method !== 'POST') {
			return json({ error: 'method not allowed' }, { status: 405 }, cors);
		}

		let body: Record<string, unknown>;
		try {
			body = (await request.json()) as Record<string, unknown>;
		} catch {
			return json({ error: 'invalid json' }, { status: 400 }, cors);
		}

		const name = typeof body.name === 'string' ? body.name.trim() : '';
		const email = typeof body.email === 'string' ? body.email.trim() : '';
		const message = typeof body.message === 'string' ? body.message.trim() : '';
		const company = typeof body.company === 'string' ? body.company.trim() : '';

		// Honeypot: real users leave this blank; bots fill everything.
		// Respond with a fake success so bots don't learn they were caught.
		if (company.length > 0) {
			return json({ ok: true }, { status: 200 }, cors);
		}

		if (!name || name.length > 100) {
			return json({ error: 'invalid name' }, { status: 400 }, cors);
		}
		if (!email || email.length > 120 || !EMAIL_RE.test(email)) {
			return json({ error: 'invalid email' }, { status: 400 }, cors);
		}
		if (message.length < 10 || message.length > 4000) {
			return json({ error: 'message must be 10–4000 characters' }, { status: 400 }, cors);
		}

		const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
		const burst = await env.RL_BURST.limit({ key: ip });
		if (!burst.success) {
			return json(
				{ error: 'too many requests — try again in a few minutes' },
				{ status: 429, headers: { 'Retry-After': '600' } },
				cors
			);
		}
		const daily = await env.RL_DAILY.limit({ key: ip });
		if (!daily.success) {
			return json(
				{ error: 'daily submission limit reached' },
				{ status: 429, headers: { 'Retry-After': '86400' } },
				cors
			);
		}

		const subject = `[Kapture] ${name}`;
		const text =
			`New message from the Kapture Imaging contact form.\n\n` +
			`Name:  ${name}\n` +
			`Email: ${email}\n` +
			`IP:    ${ip}\n\n` +
			`Message:\n${message}\n`;

		const resend = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${env.RESEND_API_KEY}`
			},
			body: JSON.stringify({
				from: env.FROM_ADDRESS,
				to: [env.TO_EMAIL],
				reply_to: email,
				subject,
				text
			})
		});

		if (!resend.ok) {
			const detail = await resend.text().catch(() => '');
			console.error('resend error', resend.status, detail);
			return json({ error: 'could not send — please try again later' }, { status: 502 }, cors);
		}

		return json({ ok: true }, { status: 200 }, cors);
	}
} satisfies ExportedHandler<Env>;
