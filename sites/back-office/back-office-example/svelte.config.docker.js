import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use adapter-node for Docker/production builds
		// This creates a standalone Node.js server in the build directory
		adapter: adapter({
			// Options for adapter-node
			out: 'build',
			precompress: false,
			envPrefix: ''
		})
	}
};

export default config;
