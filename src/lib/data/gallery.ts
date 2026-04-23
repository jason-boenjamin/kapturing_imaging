import { base } from '$app/paths';
import { generatedGallery } from './gallery-generated';

export interface GalleryItem {
	src: string;
	alt: string;
	/** ISO date string (from EXIF if available). */
	date?: string;
	/** width / height — lets the grid reserve space before load. */
	aspect?: number;
}

/**
 * Gallery manifest. Prefer running `npm run gallery:scan` to regenerate
 * `gallery-generated.ts` from the EXIF metadata of files in
 * `static/images/gallery/` — that's the source of truth. Return value below
 * rewrites the `src` field to include the SvelteKit base path.
 */
export function getGalleryImages(): GalleryItem[] {
	return generatedGallery.map((item) => ({
		...item,
		src: `${base}${item.src}`
	}));
}
