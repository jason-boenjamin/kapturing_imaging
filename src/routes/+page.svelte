<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import PortfolioImage from '$lib/components/PortfolioImage.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import { inview } from '$lib/actions/inview';
	import { getPortfolioImages } from '$lib/data/portfolio';
	import { scrollState } from '$lib/stores/scroll.svelte';

	const portfolioImages = getPortfolioImages();
	let showScrollIndicator = $state(false);
	let scrollIndicatorFaded = $state(false);

	const socialLinks = [
		{ platform: 'Instagram', url: 'https://www.instagram.com/kapture._.imaging/' },
		{ platform: 'LinkedIn', url: 'https://www.linkedin.com/in/kevin-sugiyama-193831270/' }
	];

	onMount(async () => {
		await document.fonts.ready;
		setTimeout(() => (showScrollIndicator = true), 1800);
		setTimeout(() => (scrollIndicatorFaded = true), 5000);
	});

	// Hide scroll indicator on first scroll
	$effect(() => {
		if (scrollState.scroll > 50) {
			scrollIndicatorFaded = true;
		}
	});
</script>

<!-- HERO -->
<Section id="hero">
	<div class="hero">
		<Logo />
		<div
			class="scroll-indicator"
			class:visible={showScrollIndicator}
			class:faded={scrollIndicatorFaded}
		>
			<span>SCROLL</span>
			<div class="scroll-line"></div>
		</div>
	</div>
</Section>

<!-- PORTFOLIO -->
<section class="portfolio-section" data-section="portfolio">
	<div class="portfolio-lead"></div>
	{#each portfolioImages as image, i}
		<PortfolioImage
			src={image.src}
			alt={image.alt}
			orientation={image.orientation}
			priority={i < 2}
		/>
	{/each}
	<div class="portfolio-trail"></div>
</section>

<!-- ABOUT -->
<Section id="about">
	<div class="about">
		<span class="section-label" use:inview>ABOUT</span>
		<div class="about-text" use:inview={{ threshold: 0.2 }}>
			<p class="reveal" style="transition-delay: 0.1s">The art of noticing what won&rsquo;t last.</p>
			<p class="reveal" style="transition-delay: 0.3s">An eye for what time cannot repeat.</p>
		</div>
	</div>
</Section>

<!-- CONTACT -->
<Section id="contact">
	<div class="contact">
		<span class="section-label" use:inview>CONTACT</span>
		<div class="contact-content">
			<ContactForm />
			<div class="contact-info" use:inview={{ threshold: 0.2 }}>
				<SocialLinks email="kevin.sugiyama001@gmail.com" links={socialLinks} />
			</div>
		</div>
		<span class="copyright">&copy; {new Date().getFullYear()} Kapture Imaging</span>
	</div>
</Section>

<style>
	/* ── Hero ── */
	.hero {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		position: relative;
		overflow: hidden;
		padding: var(--space-8) var(--space-6);
	}

	.scroll-indicator {
		position: absolute;
		bottom: var(--space-8);
		right: var(--space-8);
		display: flex;
		align-items: center;
		gap: var(--space-3);
		opacity: 0;
		transition: opacity var(--duration-normal) var(--ease-in-out-smooth);
	}

	.scroll-indicator.visible {
		opacity: 0.5;
	}

	.scroll-indicator.faded {
		opacity: 0;
		pointer-events: none;
	}

	.scroll-indicator span {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 300;
		letter-spacing: var(--tracking-ultra);
		color: var(--color-text-muted);
	}

	.scroll-line {
		width: 40px;
		height: 1px;
		background: var(--color-text-muted);
		transform-origin: left;
		animation: lineExpand 1.5s var(--ease-in-out-smooth) infinite;
	}

	@keyframes lineExpand {
		0%, 100% { transform: scaleX(0.5); opacity: 0.3; }
		50% { transform: scaleX(1); opacity: 1; }
	}

	/* ── Portfolio ── */
	.portfolio-section {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		height: 100vh;
		flex-shrink: 0;
		gap: clamp(2rem, 4vw, 5rem);
	}

	.portfolio-lead {
		flex-shrink: 0;
		width: 15vw;
	}

	.portfolio-trail {
		flex-shrink: 0;
		width: 20vw;
	}

	/* ── About ── */
	.about {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		align-items: center;
		padding: var(--section-padding-y) var(--section-padding-x);
	}

	.section-label {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 300;
		letter-spacing: var(--tracking-ultra);
		color: var(--color-text-muted);
		align-self: start;
		padding-top: var(--space-16);
		opacity: 0;
		transition: opacity var(--duration-normal) var(--ease-out-expo);
	}

	.section-label:global(.in-view) {
		opacity: 0.6;
	}

	.about-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 35ch;
	}

	.about-text p {
		font-family: var(--font-serif);
		font-size: var(--text-2xl);
		line-height: var(--leading-snug);
		font-weight: 400;
	}

	.about-text .reveal {
		opacity: 0;
		transform: translateY(15px);
		transition:
			opacity var(--duration-normal) var(--ease-out-expo),
			transform var(--duration-slow) var(--ease-out-expo);
	}

	.about-text:global(.in-view) .reveal {
		opacity: 1;
		transform: translateY(0);
	}

	/* ── Contact ── */
	.contact {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: var(--section-padding-y) var(--section-padding-x);
		position: relative;
	}

	.contact .section-label {
		margin-bottom: var(--space-12);
	}

	.contact-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--space-16);
		max-width: 500px;
		margin-left: 15%;
	}

	.contact-info {
		opacity: 0;
		transform: translateY(15px);
		transition:
			opacity var(--duration-normal) var(--ease-out-expo),
			transform var(--duration-slow) var(--ease-out-expo);
	}

	.contact-info:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.copyright {
		position: absolute;
		bottom: var(--space-8);
		right: var(--space-8);
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 300;
		letter-spacing: var(--tracking-wide);
		color: var(--color-dim);
	}

	/* ── Mobile ── */
	@media (max-width: 767px) {
		.hero {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;
			min-height: 100svh;
			height: 100svh;
			padding: var(--space-8) var(--space-6);
		}

		/* Landscape / short mobile viewports */
		@media (orientation: landscape) and (max-height: 520px) {
			.hero {
				padding: var(--space-4) var(--space-6);
			}
		}

		.portfolio-section {
			flex-direction: column;
			height: auto;
			width: 100vw;
			gap: var(--space-8);
			padding: var(--space-8) 0;
		}

		.portfolio-lead,
		.portfolio-trail {
			width: 100%;
			height: var(--space-8);
		}

		.about {
			grid-template-columns: 1fr;
			gap: var(--space-8);
		}

		.about-text {
			max-width: 90vw;
		}

		.contact-content {
			margin-left: 0;
			max-width: 100%;
		}

		.scroll-indicator {
			bottom: var(--space-10);
			left: var(--space-4);
			right: auto;
			transform: none;
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-3);
		}

		.scroll-indicator.visible span,
		.scroll-indicator.visible .scroll-line {
			animation: breathe 2.6s var(--ease-in-out-smooth) infinite;
		}

		.scroll-line {
			width: 1px;
			height: 32px;
			transform: none;
			animation: none;
		}

		@keyframes breathe {
			0%, 100% { opacity: 0.35; }
			50% { opacity: 1; }
		}
	}
</style>
