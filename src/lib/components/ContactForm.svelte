<script lang="ts">
	import { inview } from '$lib/actions/inview';

	const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT ?? '';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let company = $state(''); // honeypot — must stay empty
	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let errorMsg = $state('');

	const EMAIL_RE =
		/^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (status === 'sending') return;

		errorMsg = '';
		if (!name.trim()) return fail('Please enter your name.');
		if (!EMAIL_RE.test(email.trim())) return fail('Please enter a valid email.');
		if (message.trim().length < 10) return fail('Please write at least 10 characters.');

		if (!endpoint) return fail('Contact endpoint is not configured.');

		status = 'sending';
		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name, email, message, company })
			});

			if (res.ok) {
				status = 'sent';
				name = '';
				email = '';
				message = '';
				setTimeout(() => {
					if (status === 'sent') status = 'idle';
				}, 5000);
				return;
			}

			if (res.status === 429) {
				return fail('Too many submissions — please try again later.');
			}

			const data: { error?: unknown } = await res.json().catch(() => ({}));
			const safeError =
				typeof data.error === 'string' && data.error.length <= 200 ? data.error : null;
			return fail(safeError ?? 'Something went wrong. Please try again.');
		} catch {
			return fail('Network error — check your connection and try again.');
		}
	}

	function fail(msg: string) {
		status = 'error';
		errorMsg = msg;
	}
</script>

<form class="contact-form" use:inview={{ threshold: 0.2 }} onsubmit={submit} novalidate>
	<div class="field reveal" style="transition-delay: 0.1s">
		<input
			type="text"
			class="form-input"
			placeholder="Name"
			bind:value={name}
			disabled={status === 'sending'}
			autocomplete="name"
			required
		/>
	</div>
	<div class="field reveal" style="transition-delay: 0.2s">
		<input
			type="email"
			class="form-input"
			placeholder="Email"
			bind:value={email}
			disabled={status === 'sending'}
			autocomplete="email"
			required
		/>
	</div>
	<div class="field reveal" style="transition-delay: 0.3s">
		<textarea
			class="form-input"
			placeholder="Message"
			rows="4"
			bind:value={message}
			disabled={status === 'sending'}
			required
		></textarea>
	</div>

	<!-- Honeypot — kept out of the tab order and off-screen for humans,
	     but visible to naive bots that fill every input. -->
	<div class="honeypot" aria-hidden="true">
		<label>
			Company
			<input
				type="text"
				name="company"
				tabindex="-1"
				autocomplete="off"
				bind:value={company}
			/>
		</label>
	</div>

	<div class="field reveal" style="transition-delay: 0.4s">
		<button type="submit" class="submit-btn" disabled={status === 'sending' || status === 'sent'}>
			{#if status === 'sending'}SENDING…
			{:else if status === 'sent'}MESSAGE SENT
			{:else}SEND{/if}
		</button>
	</div>

	{#if status === 'error' && errorMsg}
		<p class="form-status error" role="alert">{errorMsg}</p>
	{:else if status === 'sent'}
		<p class="form-status ok" role="status">Thanks — I&rsquo;ll be in touch.</p>
	{/if}
</form>

<style>
	.contact-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		width: 100%;
		max-width: 500px;
	}

	.field {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity var(--duration-normal) var(--ease-out-expo),
			transform var(--duration-slow) var(--ease-out-expo);
	}

	.contact-form:global(.in-view) .field {
		opacity: 1;
		transform: translateY(0);
	}

	.form-input {
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text);
		font-family: var(--font-sans);
		font-size: var(--text-base);
		font-weight: 300;
		padding: var(--space-3) 0;
		width: 100%;
		transition: border-color var(--duration-fast) var(--ease-in-out-smooth);
		outline: none;
		resize: none;
	}

	.form-input:focus {
		border-color: var(--color-white);
	}

	.form-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.form-input::placeholder {
		color: var(--color-dim);
		font-weight: 300;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		font-size: var(--text-sm);
	}

	textarea.form-input {
		line-height: var(--leading-normal);
	}

	.submit-btn {
		background: transparent;
		border: 1px solid var(--color-white);
		color: var(--color-white);
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 400;
		letter-spacing: var(--tracking-ultra);
		padding: var(--space-3) var(--space-8);
		text-transform: uppercase;
		transition:
			background var(--duration-fast) var(--ease-in-out-smooth),
			color var(--duration-fast) var(--ease-in-out-smooth),
			opacity var(--duration-fast) var(--ease-in-out-smooth);
	}

	.submit-btn:hover:not(:disabled) {
		background: var(--color-white);
		color: var(--color-black);
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.honeypot {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.form-status {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 300;
		letter-spacing: var(--tracking-wide);
		margin-top: calc(var(--space-2) * -1);
	}

	.form-status.error {
		color: #ff6b6b;
	}

	.form-status.ok {
		color: var(--color-text-muted);
	}
</style>
