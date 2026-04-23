import type Lenis from 'lenis';

export const scrollState = $state<{
	scroll: number;
	progress: number;
	velocity: number;
	direction: number;
	lenis: Lenis | null;
}>({
	scroll: 0,
	progress: 0,
	velocity: 0,
	direction: 0,
	lenis: null
});
