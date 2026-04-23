<script lang="ts">
	import { onMount } from 'svelte';

	let {
		labels,
		scrollHost,
		onjump
	}: {
		labels: { key: string; label: string }[];
		scrollHost: HTMLElement | null;
		onjump: (key: string) => void;
	} = $props();

	let active = $state<string | null>(null);

	onMount(() => {
		if (!scrollHost) return;

		let ticking = false;
		function recompute() {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				ticking = false;
				const hostRect = scrollHost!.getBoundingClientRect();
				const triggerY = hostRect.top + hostRect.height * 0.25;
				let found: string | null = null;
				for (const { key } of labels) {
					const el = scrollHost!.querySelector<HTMLElement>(
						`[data-group="${CSS.escape(key)}"]`
					);
					if (!el) continue;
					const rect = el.getBoundingClientRect();
					if (rect.top <= triggerY) found = key;
				}
				active = found ?? labels[0]?.key ?? null;
			});
		}

		scrollHost.addEventListener('scroll', recompute, { passive: true });
		recompute();

		return () => {
			scrollHost?.removeEventListener('scroll', recompute);
		};
	});
</script>

<aside class="scrubber" aria-label="Timeline">
	<ul>
		{#each labels as item (item.key)}
			<li>
				<button
					type="button"
					class:active={active === item.key}
					onclick={() => onjump(item.key)}
				>
					<span class="tick" aria-hidden="true"></span>
					<span class="label">{item.label}</span>
				</button>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.scrubber {
		position: sticky;
		top: calc(var(--space-16) + var(--space-8));
		align-self: flex-start;
		padding: var(--space-4) var(--space-2);
		max-height: calc(100vh - var(--space-32));
		overflow-y: auto;
		scrollbar-width: none;
	}

	.scrubber::-webkit-scrollbar {
		display: none;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		background: transparent;
		border: none;
		padding: var(--space-1) var(--space-2);
		color: var(--color-dim);
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 300;
		letter-spacing: var(--tracking-wide);
		cursor: pointer;
		transition: color var(--duration-fast) var(--ease-in-out-smooth);
	}

	.tick {
		display: inline-block;
		width: 10px;
		height: 1px;
		background: currentColor;
		opacity: 0.5;
		transition:
			width var(--duration-fast) var(--ease-in-out-smooth),
			opacity var(--duration-fast) var(--ease-in-out-smooth);
	}

	button:hover {
		color: var(--color-text-muted);
	}

	button.active {
		color: var(--color-white);
	}

	button.active .tick {
		width: 20px;
		opacity: 1;
	}

	button:focus-visible {
		outline: 1px solid rgba(255, 255, 255, 0.4);
		outline-offset: 2px;
	}

	@media (max-width: 900px) {
		.scrubber {
			display: none;
		}
	}
</style>
