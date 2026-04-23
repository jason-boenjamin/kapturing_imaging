<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import PortfolioImage from '$lib/components/PortfolioImage.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import ScrollContainer from '$lib/components/ScrollContainer.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Shutter from '$lib/components/Shutter.svelte';

	type ShutterPhase = 'idle' | 'closing' | 'closed' | 'opening';
	import ViewMoreButton from '$lib/components/ViewMoreButton.svelte';
	import { inview } from '$lib/actions/inview';
	import { getPortfolioImages } from '$lib/data/portfolio';
	import { scrollState } from '$lib/stores/scroll.svelte';
	import { base } from '$app/paths';

	const portfolioImages = getPortfolioImages();
	let showScrollIndicator = $state(false);
	let scrollIndicatorFaded = $state(false);
	let isMobile = $state(false);

	type View = 'home' | 'gallery';
	let currentView = $state<View>('home');
	let shutterPhase = $state<ShutterPhase>('idle');
	let pendingView: View | null = null;
	let pendingScrollTarget: 'start' | 'end' | null = null;

	const socialLinks = [
		{ platform: 'Instagram', url: 'https://www.instagram.com/kapture._.imaging/' },
		{ platform: 'LinkedIn', url: 'https://www.linkedin.com/in/kevin-sugiyama-193831270/' }
	];

	onMount(async () => {
		isMobile = window.innerWidth < 768;
		await document.fonts.ready;
		setTimeout(() => (showScrollIndicator = true), 1800);
		setTimeout(() => (scrollIndicatorFaded = true), 5000);
	});

	function transitionTo(next: View, scrollTargetOnHome?: 'start' | 'end') {
		if (shutterPhase !== 'idle') return;
		if (next === currentView && !scrollTargetOnHome) return;
		pendingView = next;
		pendingScrollTarget = scrollTargetOnHome ?? null;
		shutterPhase = 'closing';
	}

	function onShutterPhase(p: 'closed' | 'open') {
		if (p === 'closed') {
			// Content swap happens while the shutter is sealed.
			if (pendingView) currentView = pendingView;
			if (pendingScrollTarget && scrollState.lenis) {
				const max =
					(scrollState.lenis as unknown as { limit: number }).limit ?? 0;
				scrollState.lenis.scrollTo(pendingScrollTarget === 'start' ? 0 : max, {
					immediate: true,
					force: true
				});
			}
			pendingView = null;
			pendingScrollTarget = null;
			// Kick the opening phase in the next frame so the transform has a
			// chance to start from the sealed position.
			requestAnimationFrame(() => (shutterPhase = 'opening'));
		} else {
			shutterPhase = 'idle';
		}
	}

	// Hide scroll indicator on first scroll
	$effect(() => {
		if (scrollState.scroll > 50) {
			scrollIndicatorFaded = true;
		}
	});
</script>

<ScrollContainer>

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
		<div class="about-text" use:inview={{ threshold: 0.2 }}>
			<p class="reveal" style="transition-delay: 0.1s">The art of noticing what will not last.</p>
			<p class="reveal" style="transition-delay: 0.3s">An eye for what time cannot repeat.</p>
			<figure class="signature reveal" style="transition-delay: 0.9s">
				<img
					src="{base}/images/signature/kevin-signature-clean.png"
					alt="Kevin Sugiyama signature"
					width="556"
					height="318"
					loading="lazy"
					decoding="async"
				/>
			</figure>
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

</ScrollContainer>

{#if currentView === 'gallery'}
	<Gallery
		onhome={() => transitionTo('home', 'start')}
		oncontact={() => transitionTo('home', 'end')}
	/>
{/if}

<ViewMoreButton
	visible={currentView === 'gallery' ? false : undefined}
	onactivate={() => transitionTo('gallery')}
/>

<Shutter phase={shutterPhase} onphasechange={onShutterPhase} />

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
		display: flex;
		align-items: center;
		justify-content: center;
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
		align-items: center;
		text-align: center;
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

	.signature {
		align-self: center;
		width: clamp(120px, 18vw, 200px);
		margin-top: var(--space-8);
		user-select: none;
		pointer-events: none;
	}

	.signature img {
		display: block;
		width: 100%;
		height: auto;
		opacity: 0.92;
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
		padding-top: 0;
		margin-bottom: var(--space-8);
	}

	.contact-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: var(--space-16);
		max-width: 500px;
		margin-left: 15%;
	}

	.contact-info {
		padding-top: var(--space-4);
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

		.about-text {
			max-width: 90vw;
		}

		.signature {
			width: clamp(100px, 32vw, 160px);
			margin-top: var(--space-6);
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
