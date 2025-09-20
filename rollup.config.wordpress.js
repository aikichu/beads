import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.wordpress.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'BeadApp',
		file: 'wordpress/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// Extract CSS to a separate file
		css({ output: 'bundle.css' }),

		// Resolve dependencies
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// Minify for production
		production && terser({
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug'],
				passes: 2
			},
			mangle: {
				properties: {
					regex: /^_/
				}
			},
			format: {
				comments: false
			}
		})
	],
	watch: {
		clearScreen: false
	}
};