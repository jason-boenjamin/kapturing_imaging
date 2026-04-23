<script lang="ts">
	import { tilt } from '$lib/actions/tilt';
	import { inview } from '$lib/actions/inview';

	let {
		src,
		alt,
		aspect = 3 / 2
	}: {
		src: string;
		alt: string;
		aspect?: number;
	} = $props();

	let loaded = $state(false);
</script>

<figure
	class="frame"
	class:loaded
	style="--aspect: {aspect}"
	use:tilt
	use:inview={{ threshold: 0.12 }}
>
	<div class="frame-inner">
		<img
			{src}
			{alt}
			loading="lazy"
			decoding="async"
			onload={() => (loaded = true)}
		/>
		<span class="sheen" aria-hidden="true"></span>
	</div>
</figure>

<style>
	.frame {
		/* Tilt is applied here; inner uses preserve-3d so the sheen can sit on top. */
		--rx: 0deg;
		--ry: 0deg;
		--px: 0.5;
		--py: 0.5;
		position: relative;
		aspect-ratio: var(--aspect, 3 / 2);
		width: 100%;
		padding: clamp(6px, 0.7vw, 10px);
		background: linear-gradient(
			145deg,
			rgba(255, 255, 255, 0.04),
			rgba(255, 255, 255, 0) 40%
		),
		#0a0a0a;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 2px;
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.04) inset,
			0 0 0 1px rgba(0, 0, 0, 0.6),
			0 10px 30px rgba(0, 0, 0, 0.5);
		transform-style: preserve-3d;
		transform: perspective(1100px) rotateX(var(--rx)) rotateY(var(--ry));
		transition:
			transform 360ms var(--ease-out-expo),
			box-shadow 360ms var(--ease-out-expo),
			opacity var(--duration-normal) var(--ease-out-expo),
			translate var(--duration-slow) var(--ease-out-expo);
		opacity: 0;
		translate: 0 24px;
		will-change: transform;
	}

	.frame:global(.in-view) {
		opacity: 1;
		translate: 0 0;
	}

	.frame:hover {
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.06) inset,
			0 0 0 1px rgba(0, 0, 0, 0.6),
			0 24px 60px rgba(0, 0, 0, 0.75);
	}

	.frame-inner {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #050505;
	}

	.frame-inner img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		opacity: 0;
		transform: translateZ(0) scale(1.02);
		transition:
			opacity var(--duration-slow) var(--ease-in-out-smooth),
			transform 600ms var(--ease-out-expo);
	}

	.frame.loaded .frame-inner img {
		opacity: 1;
	}

	.frame:hover .frame-inner img {
		transform: translateZ(0) scale(1.05);
	}

	/* Soft specular-like sheen that tracks the cursor position. */
	.sheen {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at calc(var(--px) * 100%) calc(var(--py) * 100%),
			rgba(255, 255, 255, 0.08),
			rgba(255, 255, 255, 0) 55%
		);
		mix-blend-mode: screen;
		pointer-events: none;
		opacity: 0;
		transition: opacity 300ms var(--ease-in-out-smooth);
	}

	.frame:hover .sheen {
		opacity: 1;
	}

	/* Coarse pointer (touch): disable tilt/sheen; give a light tap feedback instead. */
	@media (pointer: coarse) {
		.frame {
			transform: none;
		}

		.frame:active .frame-inner img {
			transform: scale(1.04);
		}

		.sheen {
			display: none;
		}
	}
</style>
