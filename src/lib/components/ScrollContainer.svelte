<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/stores/scroll.svelte';
	import { isMobile } from '$lib/utils/breakpoints';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let wrapper: HTMLElement;
	let content: HTMLElement;
	let mobile = $state(false);

	onMount(async () => {
		const Lenis = (await import('lenis')).default;

		mobile = isMobile();
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const lenis = new Lenis({
			wrapper: mobile ? undefined : wrapper,
			content: mobile ? undefined : content,
			orientation: mobile ? 'vertical' : 'horizontal',
			gestureOrientation: mobile ? 'vertical' : 'both',
			smoothWheel: !prefersReduced,
			lerp: 0.08,
			wheelMultiplier: 0.8,
			touchMultiplier: 1.2
		});

		lenis.on('scroll', (e: any) => {
			scrollState.scroll = e.scroll;
			scrollState.progress = e.progress;
			scrollState.velocity = e.velocity;
			scrollState.direction = e.direction;
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		const onResize = () => {
			const nowMobile = isMobile();
			if (nowMobile !== mobile) {
				location.reload();
			}
		};
		window.addEventListener('resize', onResize);

		return () => {
			lenis.destroy();
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<div class="scroll-wrapper" class:mobile bind:this={wrapper}>
	<div class="scroll-content" bind:this={content}>
		{@render children()}
	</div>
</div>

<style>
	.scroll-wrapper {
		width: 100vw;
		height: 100vh;
		overflow-x: auto;
		overflow-y: hidden;
	}

	.scroll-wrapper.mobile {
		height: auto;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.scroll-content {
		display: flex;
		flex-direction: row;
		width: max-content;
		height: 100vh;
	}

	.scroll-wrapper.mobile .scroll-content {
		flex-direction: column;
		width: 100vw;
		height: auto;
	}
</style>
