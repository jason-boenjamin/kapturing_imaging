<script lang="ts">
	let {
		onhome,
		oncontact,
		title = 'Kapture Imaging'
	}: {
		onhome: () => void;
		oncontact: () => void;
		title?: string;
	} = $props();
</script>

<nav class="gallery-nav" aria-label="Gallery navigation">
	<button type="button" class="icon-btn" aria-label="Back to home" onclick={onhome}>
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M3 11.5 12 4l9 7.5" />
			<path d="M5 10v10h14V10" />
		</svg>
	</button>
	<h1 class="title">{title}</h1>
	<button type="button" class="icon-btn" aria-label="Jump to contact" onclick={oncontact}>
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<rect x="3" y="5" width="18" height="14" rx="1.5" />
			<path d="m3 7 9 6 9-6" />
		</svg>
	</button>
</nav>

<style>
	.gallery-nav {
		position: sticky;
		top: 0;
		z-index: 10;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-6);
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(14px) saturate(1.1);
		-webkit-backdrop-filter: blur(14px) saturate(1.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 999px;
		color: var(--color-text-muted);
		cursor: pointer;
		transition:
			color var(--duration-fast) var(--ease-in-out-smooth),
			background var(--duration-fast) var(--ease-in-out-smooth),
			border-color var(--duration-fast) var(--ease-in-out-smooth);
	}

	.icon-btn:hover,
	.icon-btn:focus-visible {
		color: var(--color-white);
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.14);
		outline: none;
	}

	.title {
		margin: 0;
		font-family: var(--font-serif);
		font-size: var(--text-lg);
		font-weight: 400;
		letter-spacing: var(--tracking-wide);
		text-align: center;
		color: var(--color-white);
		line-height: 1;
	}

	@media (max-width: 767px) {
		.gallery-nav {
			padding: var(--space-3) var(--space-4);
		}

		.icon-btn {
			width: 36px;
			height: 36px;
		}

		.icon-btn svg {
			width: 16px;
			height: 16px;
		}

		.title {
			font-size: var(--text-base);
			letter-spacing: var(--tracking-normal);
		}
	}
</style>
