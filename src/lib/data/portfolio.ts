import { base } from '$app/paths';

export interface PortfolioItem {
	src: string;
	alt: string;
	orientation: 'landscape' | 'portrait' | 'square';
}

// Static manifest — replace with NAS/Nextcloud API call in the future
export function getPortfolioImages(): PortfolioItem[] {
	return [
		{ src: `${base}/images/portfolio/01-aston-martin-studio.jpg`, alt: 'Aston Martin front profile in studio lighting', orientation: 'landscape' },
		{ src: `${base}/images/portfolio/02-torii-gate-night.jpg`, alt: 'Torii gate path illuminated at night', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/03-bomber-silhouette-sunset.jpg`, alt: 'B-25 bomber silhouette against sunset sky', orientation: 'landscape' },
		{ src: `${base}/images/portfolio/04-gt3-cup-peniche.jpg`, alt: 'Porsche GT3 Cup car with Peniche livery', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/05-kiyomizu-pagoda.jpg`, alt: 'Kiyomizu-dera pagoda through winter branches', orientation: 'landscape' },
		{ src: `${base}/images/portfolio/06-porsche-911-golden-hour.jpg`, alt: 'Black Porsche 911 at golden hour', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/07-aston-martin-taillight.jpg`, alt: 'Aston Martin taillight detail in darkness', orientation: 'landscape' },
		{ src: `${base}/images/portfolio/08-356-speedster-garage.jpg`, alt: 'Porsche 356 Speedster peering from stone garage', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/09-temple-entrance-snow.jpg`, alt: 'Japanese temple entrance in fresh snow', orientation: 'landscape' },
		{ src: `${base}/images/portfolio/10-gt3-rs-pink.jpg`, alt: 'Pink Porsche GT3 RS in garage', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/11-classic-911-bomber.jpg`, alt: 'Classic Porsche 911 alongside vintage bomber', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/12-martini-gt2rs-seaside.jpg`, alt: 'Martini livery Porsche GT2 RS at seaside', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/13-aston-martin-headlight.jpg`, alt: 'Aston Martin headlight and fender detail', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/14-fox-shrine-fushimi.jpg`, alt: 'Fox guardian statue at Fushimi Inari shrine', orientation: 'portrait' },
		{ src: `${base}/images/portfolio/15-martini-gt2rs-overhead.jpg`, alt: 'Martini Porsche GT2 RS from above', orientation: 'portrait' }
	];
}
