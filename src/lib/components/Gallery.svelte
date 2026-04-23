<script lang="ts">
	import GalleryImage from './GalleryImage.svelte';
	import { inview } from '$lib/actions/inview';
	import { getGalleryImages } from '$lib/data/gallery';

	let {
		open = false,
		isMobile = false,
		onclose
	}: {
		open?: boolean;
		isMobile?: boolean;
		onclose?: () => void;
	} = $props();

	const images = getGalleryImages();
	let scrollHost: HTMLDivElement;

	// Desktop only: on the overlay, detect when the user wheels/touches
	// upward while the internal scroll is already at the top, and close.
	$effect(() => {
		if (isMobile) return;
		if (!open) return;
		if (!scrollHost) return;

		let cooling = false;

		function requestClose() {
			if (cooling) return;
			cooling = true;
			onclose?.();
			// Reset internal scroll so next open starts at the top.
			setTimeout(() => {
				if (scrollHost) scrollHost.scrollTop = 0;
				cooling = false;
			}, 700);
		}

		function onWheel(e: WheelEvent) {
			if (e.deltaY >= 0) return;
			if (scrollHost.scrollTop > 4) return;
			requestClose();
		}

		let touchStartY = 0;
		function onTouchStart(e: TouchEvent) {
			touchStartY = e.touches[0]?.clientY ?? 0;
		}
		function onTouchMove(e: TouchEvent) {
			const y = e.touches[0]?.clientY ?? 0;
			if (y - touchStartY < 40) return;
			if (scrollHost.scrollTop > 4) return;
			requestClose();
		}

		scrollHost.addEventListener('wheel', onWheel, { passive: true });
		scrollHost.addEventListener('touchstart', onTouchStart, { passive: true });
		scrollHost.addEventListener('touchmove', onTouchMove, { passive: true });

		return () => {
			scrollHost.removeEventListener('wheel', onWheel);
			scrollHost.removeEventListener('touchstart', onTouchStart);
			scrollHost.removeEventListener('touchmove', onTouchMove);
		};
	});
</script>

<div
	class="gallery-overlay"
	class:open
	class:mobile={isMobile}
	aria-hidden={isMobile ? undefined : !open}
>
	<div class="gallery-scroll" bind:this={scrollHost}>
		<section class="gallery" id="gallery" data-section="gallery" aria-labelledby="gallery-title">
			{#if !isMobile && open}
				<button
					type="button"
					class="gallery-close"
					onclick={() => onclose?.()}
					aria-label="Back to main view"
				>
					<span class="close-arrow" aria-hidden="true">&uarr;</span>
					<span>Back</span>
				</button>
			{/if}

			<header class="gallery-header" use:inview={{ threshold: 0.2 }}>
				<h2 id="gallery-title" class="gallery-title">Gallery</h2>
				<span class="gallery-sub">A wider archive</span>
			</header>

			{#if images.length === 0}
				<p class="gallery-empty">Gallery coming soon.</p>
			{:else}
				<div class="gallery-grid">
					{#each images as img (img.src)}
						<GalleryImage src={img.src} alt={img.alt} aspect={img.aspect ?? 3 / 2} />
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>

<style>
	/* ── Desktop: fixed overlay that slides up from the bottom ── */
	.gallery-overlay {
		position: fixed;
		inset: 0;
		z-index: 25;
		background: var(--color-bg);
		transform: translateY(100%);
		transition: transform 900ms var(--ease-out-expo);
		will-change: transform;
	}

	.gallery-overlay.open {
		transform: translateY(0);
	}

	.gallery-scroll {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;
	}

	/* ── Mobile: overlay becomes a plain in-flow section below everything ── */
	.gallery-overlay.mobile {
		position: static;
		transform: none;
		transition: none;
	}

	.gallery-overlay.mobile .gallery-scroll {
		height: auto;
		overflow: visible;
	}

	.gallery {
		width: 100%;
		min-height: 100%;
		background: var(--color-bg);
		padding: clamp(3rem, 8vh, 6rem) clamp(1.25rem, 4vw, 4rem) clamp(4rem, 10vh, 8rem);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vh, 4rem);
		position: relative;
	}

	.gallery-close {
		position: absolute;
		top: var(--space-8);
		left: var(--space-8);
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.14);
		color: var(--color-text-muted);
		padding: var(--space-2) var(--space-4);
		border-radius: 999px;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 400;
		letter-spacing: var(--tracking-ultra);
		text-transform: uppercase;
		cursor: pointer;
		transition:
			background var(--duration-fast) var(--ease-in-out-smooth),
			color var(--duration-fast) var(--ease-in-out-smooth),
			border-color var(--duration-fast) var(--ease-in-out-smooth);
	}

	.gallery-close:hover {
		background: rgba(255, 255, 255, 0.08);
		color: var(--color-white);
		border-color: rgba(255, 255, 255, 0.28);
	}

	.close-arrow {
		font-size: var(--text-base);
		line-height: 1;
	}

	.gallery-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		text-align: center;
		opacity: 0;
		transform: translateY(18px);
		transition:
			opacity var(--duration-normal) var(--ease-out-expo),
			transform var(--duration-slow) var(--ease-out-expo);
	}

	.gallery-header:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.gallery-title {
		font-family: var(--font-serif);
		font-size: var(--text-3xl);
		font-weight: 400;
		letter-spacing: var(--tracking-wide);
		line-height: var(--leading-tight);
		margin: 0;
	}

	.gallery-sub {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 300;
		letter-spacing: var(--tracking-ultra);
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(clamp(180px, 22vw, 320px), 1fr));
		gap: clamp(1rem, 2.5vw, 2rem);
		width: 100%;
		max-width: 1600px;
		margin: 0 auto;
	}

	.gallery-empty {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-align: center;
		letter-spacing: var(--tracking-wide);
		opacity: 0.6;
	}

	@media (max-width: 767px) {
		.gallery {
			padding: clamp(2rem, 7vh, 4rem) var(--space-4) clamp(3rem, 8vh, 5rem);
		}

		.gallery-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-3);
		}
	}

	@media (min-width: 480px) and (max-width: 767px) {
		.gallery-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
