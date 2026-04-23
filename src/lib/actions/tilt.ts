/**
 * Mouse-follow 3D tilt action. On pointer move over the element, the element
 * tilts toward the cursor (rotateX / rotateY) with a slight magnification.
 *
 * Sets these CSS custom properties on the host element:
 *   --rx  rotation around X in deg (negative = tilt top toward viewer)
 *   --ry  rotation around Y in deg
 *   --px  normalized cursor X [0,1] within the element (for lighting fx)
 *   --py  normalized cursor Y [0,1]
 *
 * Auto-disables on coarse pointers (touch) so mobile just gets a static card.
 */

export interface TiltOptions {
	/** Max tilt in degrees (default 6). */
	max?: number;
}

export function tilt(node: HTMLElement, options: TiltOptions = {}) {
	const max = options.max ?? 6;
	const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
	if (coarse) {
		node.style.setProperty('--rx', '0deg');
		node.style.setProperty('--ry', '0deg');
		return { destroy() {} };
	}

	let frame = 0;

	function onMove(e: PointerEvent) {
		const rect = node.getBoundingClientRect();
		const px = (e.clientX - rect.left) / rect.width; // 0..1
		const py = (e.clientY - rect.top) / rect.height; // 0..1
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			node.style.setProperty('--px', px.toFixed(3));
			node.style.setProperty('--py', py.toFixed(3));
			// Map 0..1 → -max..max. Positive px (right) tilts right → rotateY positive.
			// Positive py (down) tilts bottom → rotateX negative (top comes forward).
			node.style.setProperty('--ry', ((px - 0.5) * 2 * max).toFixed(2) + 'deg');
			node.style.setProperty('--rx', ((0.5 - py) * 2 * max).toFixed(2) + 'deg');
		});
	}

	function reset() {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			node.style.setProperty('--rx', '0deg');
			node.style.setProperty('--ry', '0deg');
			node.style.setProperty('--px', '0.5');
			node.style.setProperty('--py', '0.5');
		});
	}

	node.addEventListener('pointerenter', onMove);
	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', reset);
	reset();

	return {
		destroy() {
			cancelAnimationFrame(frame);
			node.removeEventListener('pointerenter', onMove);
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', reset);
		}
	};
}
