<script lang="ts">
	import GalleryImage from './GalleryImage.svelte';
	import GalleryNav from './GalleryNav.svelte';
	import GallerySegment from './GallerySegment.svelte';
	import GalleryScrubber from './GalleryScrubber.svelte';
	import { getGalleryImages, type GalleryItem } from '$lib/data/gallery';

	type Segment = 'years' | 'months' | 'all';

	let {
		onhome,
		oncontact
	}: {
		onhome: () => void;
		oncontact: () => void;
	} = $props();

	const images = getGalleryImages();
	let view = $state<Segment>('all');
	let scrollHost: HTMLElement;

	type ImageWithDate = GalleryItem & { when: Date };

	const dated = $derived.by<ImageWithDate[]>(() => {
		return images
			.map((img) => ({ ...img, when: img.date ? new Date(img.date) : new Date(0) }))
			.filter((img) => !Number.isNaN(img.when.getTime()))
			.sort((a, b) => b.when.getTime() - a.when.getTime());
	});

	type Group = { key: string; label: string; images: ImageWithDate[] };

	const MONTHS = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	function groupBy(imgs: ImageWithDate[], granularity: 'year' | 'month' | 'day'): Group[] {
		const map = new Map<string, ImageWithDate[]>();
		for (const img of imgs) {
			const d = img.when;
			let key: string;
			if (granularity === 'year') key = `${d.getFullYear()}`;
			else if (granularity === 'month')
				key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
			else
				key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(img);
		}
		return [...map.entries()].map(([key, imgs]) => {
			const d = imgs[0].when;
			let label: string;
			if (granularity === 'year') label = `${d.getFullYear()}`;
			else if (granularity === 'month') label = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
			else
				label = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
			return { key, label, images: imgs };
		});
	}

	const groups = $derived<Group[]>(
		view === 'years'
			? groupBy(dated, 'year').map((g) => ({ ...g, images: g.images.slice(0, 1) }))
			: view === 'months'
				? groupBy(dated, 'month').map((g) => ({ ...g, images: g.images.slice(0, 6) }))
				: groupBy(dated, 'day')
	);

	const scrubberLabels = $derived(
		view === 'years'
			? groupBy(dated, 'year').map(({ key, label }) => ({ key, label }))
			: groupBy(dated, 'month').map(({ key, label }) => ({ key, label }))
	);

	function jumpTo(key: string) {
		const el = scrollHost?.querySelector<HTMLElement>(`[data-group="${CSS.escape(key)}"]`);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<div class="gallery-root">
	<GalleryNav {onhome} {oncontact} />

	<GallerySegment value={view} onchange={(next) => (view = next)} />

	<div class="gallery-body">
		{#if dated.length > 0}
			<GalleryScrubber
				labels={scrubberLabels}
				scrollHost={scrollHost ?? null}
				onjump={jumpTo}
			/>
		{/if}

		<main class="gallery-scroll" bind:this={scrollHost}>
			{#if dated.length === 0}
				<p class="gallery-empty">Gallery coming soon.</p>
			{:else}
				{#each groups as group (group.key)}
					<section class="group" data-group={group.key}>
						<h2 class="group-label">
							<span class="group-dash" aria-hidden="true">&mdash;</span>
							<span>{group.label}</span>
						</h2>
						<div class="grid {view}">
							{#each group.images as img (img.src)}
								<GalleryImage src={img.src} alt={img.alt} aspect={img.aspect ?? 3 / 2} />
							{/each}
						</div>
					</section>
				{/each}
			{/if}
		</main>
	</div>
</div>

<style>
	.gallery-root {
		position: fixed;
		inset: 0;
		z-index: 25;
		background: var(--color-bg);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.gallery-body {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(120px, auto) 1fr;
		gap: var(--space-4);
		padding-left: var(--space-6);
	}

	.gallery-scroll {
		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;
		padding: var(--space-4) clamp(1rem, 4vw, 3rem) clamp(3rem, 10vh, 6rem) var(--space-4);
	}

	.group {
		scroll-margin-top: var(--space-24);
		padding-top: var(--space-10);
	}

	.group:first-of-type {
		padding-top: var(--space-6);
	}

	.group-label {
		display: inline-flex;
		align-items: baseline;
		gap: var(--space-3);
		margin: 0 0 var(--space-6);
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 400;
		letter-spacing: var(--tracking-ultra);
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.group-dash {
		color: var(--color-dim);
	}

	.grid {
		display: grid;
		gap: clamp(1rem, 2.2vw, 1.75rem);
	}

	.grid.all {
		grid-template-columns: repeat(auto-fill, minmax(clamp(160px, 18vw, 240px), 1fr));
	}

	.grid.months {
		grid-template-columns: repeat(auto-fill, minmax(clamp(200px, 22vw, 300px), 1fr));
	}

	.grid.years {
		grid-template-columns: repeat(auto-fill, minmax(clamp(280px, 30vw, 420px), 1fr));
	}

	.gallery-empty {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-align: center;
		letter-spacing: var(--tracking-wide);
		opacity: 0.6;
		margin-top: clamp(4rem, 12vh, 8rem);
	}

	@media (max-width: 900px) {
		.gallery-body {
			grid-template-columns: 1fr;
			padding-left: 0;
		}

		.gallery-scroll {
			padding: var(--space-4) clamp(0.75rem, 4vw, 2rem) clamp(3rem, 10vh, 6rem);
		}
	}

	@media (max-width: 767px) {
		.grid.all {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-3);
		}

		.grid.months {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-3);
		}

		.grid.years {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 480px) and (max-width: 767px) {
		.grid.all {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
