// rollup.config.prod.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'src/scripts/main.js',
	format: 'iife',
	dest: 'dist/media/bundle.js',
	sourceMap: 'inline',
	moduleName: 'game',
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify( 'production' )
		}),
		resolve({
			module: true,
			jsnext: true,
			main: true,
			browser: true
		}),
    	commonjs(),
		babel({
			exclude: 'node_modules/**'
		})
	]
};

// prod https://github.com/TrySound/rollup-plugin-uglify
// prod https://github.com/aMarCruz/rollup-plugin-cleanup