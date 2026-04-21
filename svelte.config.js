import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/kapturing_imaging' : ''
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: true,
			strict: true
		}),
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
