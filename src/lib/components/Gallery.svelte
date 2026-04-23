<script lang="ts">
	import GalleryImage from './GalleryImage.svelte';
	import { inview } from '$lib/actions/inview';
	import { getGalleryImages } from '$lib/data/gallery';

	const images = getGalleryImages();
</script>

<section class="gallery" id="gallery" data-section="gallery" aria-labelledby="gallery-title">
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

<style>
	.gallery {
		width: 100%;
		min-height: 100svh;
		background: var(--color-bg);
		padding: clamp(3rem, 8vh, 6rem) clamp(1.25rem, 4vw, 4rem) clamp(4rem, 10vh, 8rem);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vh, 4rem);
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

	/* Mobile: guarantee 2–3 across even on very small viewports. */
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
