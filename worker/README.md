# Kapture Contact Worker

Cloudflare Worker that receives contact-form submissions from the Kapture Imaging site, rate-limits them by IP, and forwards the message to `TO_EMAIL` via Resend.

## One-time setup

1. Install Wrangler globally (once per machine):
   ```
   npm install -g wrangler
   wrangler login
   ```
2. Install the Worker's local dev deps:
   ```
   cd worker
   npm install
   ```
3. Set the Resend API key as a secret (you'll be prompted for the value):
   ```
   wrangler secret put RESEND_API_KEY
   ```

## Deploy

```
cd worker
wrangler deploy
```

Wrangler prints the deployed URL, e.g. `https://kapture-contact.<your-subdomain>.workers.dev`. Append `/contact` to get the endpoint the frontend needs.

## Configure the frontend

Add the endpoint URL as an environment variable the frontend can read at build time:

- **Local dev**: create `.env` in the project root with
  ```
  VITE_CONTACT_ENDPOINT=https://kapture-contact.<your-subdomain>.workers.dev/contact
  ```
- **CI / GitHub Pages**: add a repo secret named `VITE_CONTACT_ENDPOINT` with the same value. The deploy workflow already reads it.

## Tune

- `wrangler.toml [vars]` — `TO_EMAIL`, `ALLOWED_ORIGIN`, `FROM_ADDRESS`
- Rate limits live under the `[[unsafe.bindings]]` blocks — adjust `limit` / `period` if you need different caps.

## Tail production logs

```
wrangler tail
```
