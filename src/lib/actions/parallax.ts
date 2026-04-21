import { scrollState } from '$lib/stores/scroll.svelte';
import { isMobile } from '$lib/utils/breakpoints';

export function parallax(node: HTMLElement, options: { speed: number }) {
	const factor = (options.speed - 0.5) * 2;
	const mobile = isMobile();
	let frame: number;

	// Check reduced motion preference
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReduced) return { destroy() {} };

	function update() {
		const offset = scrollState.scroll * factor * 0.15;
		if (mobile) {
			node.style.transform = `translateY(${offset}px)`;
		} else {
			node.style.transform = `translateX(${offset}px)`;
		}
		frame = requestAnimationFrame(update);
	}

	frame = requestAnimationFrame(update);

	return {
		destroy() {
			cancelAnimationFrame(frame);
		}
	};
}
