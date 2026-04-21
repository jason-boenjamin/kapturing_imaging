<script lang="ts">
	import { onMount } from 'svelte';

	let showPrimary = $state(false);
	let showSecondary = $state(false);
	let showTagline = $state(false);

	onMount(async () => {
		await document.fonts.ready;

		setTimeout(() => (showPrimary = true), 300);
		setTimeout(() => (showSecondary = true), 600);
		setTimeout(() => (showTagline = true), 1000);
	});
</script>

<div class="logo">
	<span class="logo__primary" class:visible={showPrimary}>KAPTURE</span>
	<span class="logo__secondary" class:visible={showSecondary}>IMAGING</span>
	<span class="logo__tagline" class:visible={showTagline}>DEFINED BY DESIGN. DRIVEN BY DETAIL.</span>
</div>

<style>
	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		user-select: none;
	}

	.logo__primary {
		font-family: var(--font-serif);
		font-size: var(--text-hero);
		font-weight: 400;
		letter-spacing: var(--tracking-wide);
		line-height: var(--leading-none);
		color: var(--color-text);
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity var(--duration-slow) var(--ease-out-expo),
			transform var(--duration-hero) var(--ease-out-expo);
	}

	.logo__secondary {
		font-family: var(--font-sans);
		font-size: var(--text-xl);
		font-weight: 300;
		letter-spacing: var(--tracking-ultra);
		line-height: var(--leading-none);
		text-transform: uppercase;
		color: var(--color-text);
		margin-top: var(--space-3);
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity var(--duration-normal) var(--ease-out-expo),
			transform var(--duration-slow) var(--ease-out-expo);
	}

	.logo__tagline {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 300;
		letter-spacing: var(--tracking-ultra);
		line-height: var(--leading-normal);
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin-top: var(--space-6);
		opacity: 0;
		transition: opacity var(--duration-normal) var(--ease-out-expo);
	}

	.logo__primary.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.logo__secondary.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.logo__tagline.visible {
		opacity: 0.7;
	}
</style>
