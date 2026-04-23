import { base } from '$app/paths';

export interface GalleryItem {
	src: string;
	alt: string;
	// Optional aspect ratio hint for reserving layout space before the image loads.
	aspect?: number; // width / height
}

/**
 * Gallery manifest. To add a new photo:
 *   1. Drop the file into `static/images/gallery/`
 *   2. Add an entry to this array
 *
 * Tip: keep filenames lowercased and hyphenated for consistency.
 */
export function getGalleryImages(): GalleryItem[] {
	return [
		// Example entries — replace with your own:
		// { src: `${base}/images/gallery/01-kyoto-dusk.jpg`, alt: 'Kyoto backstreet at dusk', aspect: 3 / 2 },
		// { src: `${base}/images/gallery/02-aston-detail.jpg`, alt: 'Aston Martin grille detail', aspect: 2 / 3 }
	];
}
