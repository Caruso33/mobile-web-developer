/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('scripts', function(done) {
	gulp
		.src('js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
	done();
});

gulp.task('scripts-dist', function(done) {
	gulp
		.src('js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
	done();
});

gulp.task('copy-html', function(done) {
	gulp.src('./index.html').pipe(gulp.dest('./dist'));
	done();
});

gulp.task('copy-images', function(done) {
	gulp.src('img/*').pipe(gulp.dest('dist/img'));
	done();
});

gulp.task('styles', function(done) {
	gulp
		.src('sass/**/*.scss')
		.pipe(
			sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError)
		)
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions']
			})
		)
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
	done();
});

gulp.task('lint', function() {
	return (
		gulp
			.src(['js/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
			.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
			.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
			.pipe(eslint.failOnError())
	);
});

gulp.task('tests', function(done) {
	gulp.src('tests/spec/extraSpec.js').pipe(
		jasmine({
			integration: true,
			vendor: 'js/**/*.js'
		})
	);
	done();
});

gulp.task(
	'dist',
	gulp.parallel('copy-html', 'copy-images', 'styles', 'lint', 'scripts-dist')
);

gulp.task(
	'default',
	gulp.parallel('copy-html', 'copy-images', 'styles', 'lint', 'scripts'),
	function() {
		gulp.watch('sass/**/*.scss', gulp.task('styles'));
		gulp.watch('js/**/*.js', gulp.task('lint'));
		gulp.watch('/index.html', gulp.task('copy-html'));
		gulp.watch('./dist/index.html').on('change', browserSync.reload);
		gulp.watch('./build/index.html').on('change', browserSync.reload);

		browserSync.init({
			server: './dist'
		});
	}
);
