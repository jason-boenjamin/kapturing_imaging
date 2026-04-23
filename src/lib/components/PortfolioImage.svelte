<script lang="ts">
	import { inview } from '$lib/actions/inview';

	let {
		src,
		alt,
		orientation = 'landscape',
		priority = false
	}: {
		src: string;
		alt: string;
		orientation?: 'landscape' | 'portrait' | 'square';
		priority?: boolean;
	} = $props();

	let loaded = $state(false);

	function onLoad() {
		loaded = true;
	}
</script>

<figure
	class="portfolio-image {orientation}"
	class:loaded
	use:inview={{ threshold: 0.1 }}
>
	<img
		{src}
		{alt}
		loading={priority ? 'eager' : 'lazy'}
		decoding="async"
		fetchpriority={priority ? 'high' : 'auto'}
		onload={onLoad}
	/>
</figure>

<style>
	.portfolio-image {
		flex-shrink: 0;
		height: 100vh;
		position: relative;
		overflow: hidden;
		opacity: 0;
		transform: translateX(40px) scale(1.03);
		transition:
			opacity var(--duration-normal) var(--ease-out-expo),
			transform var(--duration-slow) var(--ease-out-expo);
	}

	.portfolio-image.landscape {
		width: 85vw;
	}

	.portfolio-image.portrait {
		width: 45vw;
	}

	.portfolio-image.square {
		width: 65vw;
	}

	.portfolio-image:global(.in-view) {
		opacity: 1;
		transform: translateX(0) scale(1);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity var(--duration-slow) var(--ease-in-out-smooth);
	}

	.portfolio-image.loaded img {
		opacity: 1;
	}

	@media (max-width: 767px) {
		.portfolio-image {
			width: 100vw !important;
			height: 60vh;
			transform: translateY(30px) scale(1.02);
		}

		.portfolio-image.portrait {
			width: 85vw !important;
			height: 75vh;
			margin: 0 auto;
		}

		.portfolio-image:global(.in-view) {
			transform: translateY(0) scale(1);
		}
	}
</style>
