<script lang="ts">
	import { inview } from '$lib/actions/inview';

	let name = $state('');
	let email = $state('');
	let message = $state('');
</script>

<form class="contact-form" use:inview={{ threshold: 0.2 }}>
	<div class="field reveal" style="transition-delay: 0.1s">
		<input
			type="text"
			class="form-input"
			placeholder="Name"
			bind:value={name}
			required
		/>
	</div>
	<div class="field reveal" style="transition-delay: 0.2s">
		<input
			type="email"
			class="form-input"
			placeholder="Email"
			bind:value={email}
			required
		/>
	</div>
	<div class="field reveal" style="transition-delay: 0.3s">
		<textarea
			class="form-input"
			placeholder="Message"
			rows="4"
			bind:value={message}
			required
		></textarea>
	</div>
	<div class="field reveal" style="transition-delay: 0.4s">
		<button type="submit" class="submit-btn">SEND</button>
	</div>
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
			color var(--duration-fast) var(--ease-in-out-smooth);
	}

	.submit-btn:hover {
		background: var(--color-white);
		color: var(--color-black);
	}
</style>
