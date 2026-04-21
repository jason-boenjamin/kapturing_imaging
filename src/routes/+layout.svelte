<script lang="ts">
	import '../app.css';
	import ScrollContainer from '$lib/components/ScrollContainer.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Kapture Imaging</title>
</svelte:head>

<ScrollContainer>
	{@render children()}
</ScrollContainer>
