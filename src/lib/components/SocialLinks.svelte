<script lang="ts">
	let {
		email,
		links
	}: {
		email: string;
		links: Array<{ platform: string; url: string }>;
	} = $props();
</script>

<div class="social-links">
	<a href="mailto:{email}" class="social-link">{email}</a>
	<div class="platforms">
		{#each links as link}
			<a href={link.url} class="social-link" target="_blank" rel="noopener noreferrer">
				{link.platform}
			</a>
		{/each}
	</div>
</div>

<style>
	.social-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.social-links > a {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 300;
		color: var(--color-text-muted);
		transition: color var(--duration-fast) var(--ease-in-out-smooth);
	}

	.social-links > a:hover {
		color: var(--color-text);
	}

	.platforms {
		display: flex;
		gap: var(--space-6);
	}

	.social-link {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 400;
		letter-spacing: var(--tracking-ultra);
		text-transform: uppercase;
		color: var(--color-text-muted);
		transition: color var(--duration-fast) var(--ease-in-out-smooth);
	}

	.social-link:hover {
		color: var(--color-text);
	}
</style>
