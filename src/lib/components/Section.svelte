<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		width = '100vw',
		children
	}: {
		id: string;
		width?: string;
		children: Snippet;
	} = $props();
</script>

<section class="section" data-section={id} style:width={width}>
	{@render children()}
</section>

<style>
	.section {
		flex-shrink: 0;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}

	@media (max-width: 767px) {
		.section {
			width: 100vw !important;
			height: auto;
			min-height: 100svh;
			display: flex;
			flex-direction: column;
		}
	}
</style>
