<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/stores/scroll.svelte';

	let {
		target = '#gallery',
		contactSelector = '[data-section="contact"]'
	}: {
		target?: string;
		contactSelector?: string;
	} = $props();

	let visible = $state(false);
	let mobile = $state(false);

	function smoothScrollTo(el: Element) {
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function click() {
		const el = document.querySelector(target);
		if (el) smoothScrollTo(el);
	}

	onMount(() => {
		mobile = window.innerWidth < 768;

		if (mobile) {
			// On mobile, reveal the button once the Contact section is in view.
			const contact = document.querySelector(contactSelector);
			if (!contact) return;
			const io = new IntersectionObserver(
				([entry]) => {
					visible = entry.isIntersecting && entry.intersectionRatio >= 0.45;
				},
				{ threshold: [0, 0.45, 1] }
			);
			io.observe(contact);
			return () => io.disconnect();
		}

		// Desktop: listen for wheel-down-at-end-of-horizontal to trigger the jump.
		let cooling = false;
		function onWheel(e: WheelEvent) {
			if (!visible) return;
			if (cooling) return;
			if (e.deltaY <= 0) return;
			// User wants to go further after horizontal end — magnetically jump.
			cooling = true;
			click();
			setTimeout(() => (cooling = false), 1200);
		}
		window.addEventListener('wheel', onWheel, { passive: true });
		return () => window.removeEventListener('wheel', onWheel);
	});

	// Desktop visibility is driven by Lenis scroll progress (tracked in scrollState).
	$effect(() => {
		if (mobile) return;
		visible = scrollState.progress >= 0.9;
	});
</script>

<button
	type="button"
	class="view-more"
	class:visible
	class:mobile
	aria-label="View the Gallery"
	onclick={click}
>
	<span class="label">View More</span>
	<span class="arrow" aria-hidden="true">
		{#if mobile}&rarr;{:else}&darr;{/if}
	</span>
</button>

<style>
	.view-more {
		position: fixed;
		z-index: 20;
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-6);
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		color: var(--color-white);
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 400;
		letter-spacing: var(--tracking-ultra);
		text-transform: uppercase;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 450ms var(--ease-in-out-smooth),
			transform 450ms var(--ease-in-out-smooth),
			background 250ms var(--ease-in-out-smooth),
			border-color 250ms var(--ease-in-out-smooth);
	}

	.view-more.visible {
		opacity: 0.9;
		pointer-events: auto;
	}

	.view-more:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.35);
	}

	.arrow {
		display: inline-block;
		font-size: var(--text-base);
		line-height: 1;
		animation: bob 2.2s var(--ease-in-out-smooth) infinite;
	}

	.view-more.mobile .arrow {
		animation-name: bob-x;
	}

	@keyframes bob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(4px); }
	}

	@keyframes bob-x {
		0%, 100% { transform: translateX(0); }
		50% { transform: translateX(4px); }
	}

	/* Desktop: centered bottom. */
	.view-more {
		bottom: var(--space-8);
		left: 50%;
		transform: translateX(-50%) translateY(12px);
	}

	.view-more.visible {
		transform: translateX(-50%) translateY(0);
	}

	/* Mobile: right side, vertically centered. */
	@media (max-width: 767px) {
		.view-more {
			bottom: auto;
			left: auto;
			top: 50%;
			right: var(--space-4);
			transform: translateY(-50%) translateX(12px);
			padding: var(--space-3) var(--space-4);
			writing-mode: horizontal-tb;
		}

		.view-more.visible {
			transform: translateY(-50%) translateX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.arrow {
			animation: none;
		}

		.view-more {
			transition: opacity 200ms ease-out;
		}
	}
</style>
