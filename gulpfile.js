var gulp = require('gulp-param')(require('gulp'), process.argv),
	sftp = require('gulp-sftp'),
	rollup = require('rollup');

var resolve = require('rollup-plugin-node-resolve'),
	babel = require('rollup-plugin-babel'),
	replace = require('rollup-plugin-replace'),
	commonjs = require('rollup-plugin-commonjs');

// Build
// ==============================================
gulp.task('build', function() {
	return rollup.rollup({
		entry: 'src/scripts/main.js',
		format: 'iife',
		dest: './dist/media/bundle.js',
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
	})
    .then(function (bundle) {
		bundle.write({
			format: "iife",
			moduleName: "game",
			dest: "./dist/media/bundle.js",
			sourceMap: true
		});
    });
});

// Upload
// ==============================================
gulp.task('publish', function(host, user, pass) {
	return gulp.src('./dist/**/*')
		.pipe(sftp({
			host: host,
			user: user,
			pass: pass,
			remotePath: '/var/www/sites/'+host+'/'
		}))
});

// Default Server
// ==============================================
gulp.task('default', ['build']);
gulp.task('deploy', ['build','publish']);