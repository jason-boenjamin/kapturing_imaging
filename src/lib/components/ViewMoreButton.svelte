<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/stores/scroll.svelte';

	let {
		onactivate,
		visible: visibleProp,
		contactSelector = '[data-section="contact"]'
	}: {
		/** Fires on click, or on wheel/touch gesture past the main-scroll endpoint. */
		onactivate: () => void;
		/** Force-hide (e.g. when gallery is open). Undefined = auto behavior. */
		visible?: boolean | undefined;
		contactSelector?: string;
	} = $props();

	let autoVisible = $state(false);
	let mobile = $state(false);

	const visible = $derived(visibleProp === false ? false : autoVisible);

	onMount(() => {
		mobile = window.innerWidth < 768;

		if (mobile) {
			// On mobile, reveal the button only once the Contact section is mostly in view.
			const contact = document.querySelector(contactSelector);
			if (!contact) return;
			const io = new IntersectionObserver(
				([entry]) => {
					autoVisible = entry.isIntersecting && entry.intersectionRatio >= 0.55;
				},
				{ threshold: [0, 0.55, 1] }
			);
			io.observe(contact);
			return () => io.disconnect();
		}

		// Desktop: listen for wheel-down once we're visible (horizontal scroll near end).
		let cooling = false;
		function onWheel(e: WheelEvent) {
			if (!visible) return;
			if (cooling) return;
			if (e.deltaY <= 0) return;
			cooling = true;
			onactivate();
			setTimeout(() => (cooling = false), 1200);
		}
		window.addEventListener('wheel', onWheel, { passive: true });
		return () => window.removeEventListener('wheel', onWheel);
	});

	// Desktop visibility: require the user to be ~at the end of the horizontal scroll.
	// 0.95 leaves room for small natural under-scrolls while still requiring
	// the visitor to have crossed most of the Contact section.
	$effect(() => {
		if (mobile) return;
		autoVisible = scrollState.progress >= 0.95;
	});
</script>

<button
	type="button"
	class="view-more"
	class:visible
	class:mobile
	aria-label="View the Gallery"
	onclick={onactivate}
>
	<span class="label">View More</span>
	<span class="arrow" aria-hidden="true">
		{#if mobile}&rarr;{:else}&darr;{/if}
	</span>
</button>

<style>
	.view-more {
		position: fixed;
		z-index: 30;
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
