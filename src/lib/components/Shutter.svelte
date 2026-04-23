<script lang="ts">
	type Phase = 'idle' | 'closing' | 'closed' | 'opening';

	let {
		phase,
		onphasechange
	}: {
		phase: Phase;
		onphasechange?: (p: 'closed' | 'open') => void;
	} = $props();

	const blades = [0, 1, 2, 3, 4, 5];

	// When the CSS transition that closes the blades finishes, tell the parent
	// we're at "closed" so it can swap content underneath. The parent then
	// flips phase to 'opening', and when THAT transition completes we fire 'open'.
	function onBladeTransitionEnd(event: TransitionEvent) {
		// Only react to the transform transition (ignore backdrop opacity etc).
		if (event.propertyName !== 'transform') return;
		// Only the first blade fires the callback (all six transition in sync).
		const el = event.currentTarget as Element;
		if (!el.classList.contains('blade-anchor')) return;
		if (phase === 'closing') onphasechange?.('closed');
		else if (phase === 'opening') onphasechange?.('open');
	}
</script>

<div
	class="shutter"
	class:visible={phase !== 'idle'}
	class:closing={phase === 'closing' || phase === 'closed' || phase === 'opening'}
	aria-hidden="true"
>
	<svg
		class="iris"
		viewBox="-100 -100 200 200"
		preserveAspectRatio="xMidYMid slice"
		class:shut={phase === 'closing' || phase === 'closed'}
	>
		{#each blades as i (i)}
			<g
				class="blade"
				class:blade-anchor={i === 0}
				style="--blade-rot: {i * 60}deg;"
				ontransitionend={onBladeTransitionEnd}
			>
				<polygon points="0,0 180,-50 180,50" class="blade-shape" />
			</g>
		{/each}
	</svg>
</div>

<style>
	.shutter {
		position: fixed;
		inset: 0;
		z-index: 50;
		pointer-events: none;
		opacity: 0;
		transition: opacity 60ms linear;
	}

	.shutter.visible {
		opacity: 1;
		pointer-events: auto;
	}

	.iris {
		width: 100%;
		height: 100%;
		display: block;
		overflow: visible;
	}

	/* Each blade is anchored in a group rotated to its slot around the circle,
	   then translated inward as the shutter closes. Six blades at 60° apart
	   meet precisely at the center when fully closed. */
	.blade {
		transform-origin: 0 0;
		transform: rotate(var(--blade-rot)) translateX(180px);
		transition: transform 420ms cubic-bezier(0.65, 0, 0.35, 1);
		will-change: transform;
	}

	.iris.shut .blade {
		transform: rotate(var(--blade-rot)) translateX(-4px);
	}

	/* Opening uses a softer, longer ease-out-expo to feel like the aperture
	   unwinding. The .shut class is removed, which reverts to the default
	   transform — but we override the transition duration for that direction. */
	.iris:not(.shut) .blade {
		transition-duration: 620ms;
		transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	}

	.blade-shape {
		fill: #050505;
		stroke: rgba(255, 255, 255, 0.18);
		stroke-width: 0.5;
	}

	/* Subtle "click" feedback at the moment blades slam together. */
	.iris.shut {
		animation: shutter-click 40ms ease-out 380ms 1;
	}

	@keyframes shutter-click {
		0% { transform: scale(1); }
		50% { transform: scale(0.996); }
		100% { transform: scale(1); }
	}

	@media (prefers-reduced-motion: reduce) {
		.blade,
		.iris:not(.shut) .blade {
			transition: none;
		}

		.iris.shut {
			animation: none;
		}

		/* Fallback: collapse the iris instantly and rely on a short opacity fade
		   on the outer .shutter element to cover the swap. */
		.iris.shut .blade {
			transform: rotate(var(--blade-rot)) translateX(-4px);
		}

		.shutter {
			transition: opacity 120ms linear;
		}
	}
</style>
