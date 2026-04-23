<script lang="ts">
	type Segment = 'years' | 'months' | 'all';

	let {
		value,
		onchange
	}: {
		value: Segment;
		onchange: (next: Segment) => void;
	} = $props();

	const segments: { id: Segment; label: string }[] = [
		{ id: 'years', label: 'Years' },
		{ id: 'months', label: 'Months' },
		{ id: 'all', label: 'All' }
	];

	const activeIndex = $derived(segments.findIndex((s) => s.id === value));
</script>

<div class="segment-wrap">
	<div class="segment" role="tablist" aria-label="Gallery grouping">
		<span class="indicator" style="transform: translateX({activeIndex * 100}%)" aria-hidden="true"></span>
		{#each segments as seg}
			<button
				type="button"
				role="tab"
				aria-selected={value === seg.id}
				class="seg-btn"
				class:active={value === seg.id}
				onclick={() => onchange(seg.id)}
			>
				{seg.label}
			</button>
		{/each}
	</div>
</div>

<style>
	.segment-wrap {
		display: flex;
		justify-content: center;
		padding: var(--space-6) var(--space-6) 0;
	}

	.segment {
		position: relative;
		display: inline-grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(72px, 1fr);
		padding: 4px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 999px;
		overflow: hidden;
	}

	.indicator {
		position: absolute;
		top: 4px;
		left: 4px;
		width: calc((100% - 8px) / 3);
		height: calc(100% - 8px);
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 999px;
		transition: transform 360ms var(--ease-out-expo);
		pointer-events: none;
	}

	.seg-btn {
		position: relative;
		z-index: 1;
		padding: var(--space-2) var(--space-5);
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 400;
		letter-spacing: var(--tracking-ultra);
		text-transform: uppercase;
		cursor: pointer;
		transition: color var(--duration-fast) var(--ease-in-out-smooth);
	}

	.seg-btn:hover:not(.active) {
		color: rgba(255, 255, 255, 0.8);
	}

	.seg-btn.active {
		color: var(--color-white);
	}

	.seg-btn:focus-visible {
		outline: 1px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
		border-radius: 999px;
	}

	@media (max-width: 767px) {
		.segment-wrap {
			padding: var(--space-4) var(--space-4) 0;
		}

		.segment {
			grid-auto-columns: minmax(60px, 1fr);
		}

		.seg-btn {
			padding: var(--space-2) var(--space-3);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.indicator {
			transition: none;
		}
	}
</style>
