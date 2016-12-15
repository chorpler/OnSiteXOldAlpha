var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var ignore = require('gulp-ignore');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
  sass: ['./scss/**/*.scss'],
  autoprefixer: ['./www/mikecss/*.css']
};

// gulp.task('default', ['imageview']);
gulp.task('default', ['autoprefix']);

// gulp.task('autoprefix', ['autoprefix1', 'autoprefix2', 'autoprefix3', 'autoprefix4', 'autoprefix5', 'autoprefix6', 'autoprefix7', 'autoprefix8', 'autoprefixfinal']);
gulp.task('autoprefix', ['autoprefix1', 'autoprefixfinal', 'autoprefixfinal2', 'autoprefixfinal3']);

gulp.task('autoprefix1', function() {
	return gulp.src(['./www/mikecss/*.css', '!./www/mikecss/reset_css.css'])
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefix2', function() {
	return gulp.src('./www/mikecss/ionic.tdcards.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefix3', function() {
	return gulp.src('./www/mikecss/OnSite.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefix4', function() {
	return gulp.src('./www/mikecss/flex.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefix5', function() {
	return gulp.src('./www/mikecss/popup.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefix6', function() {
	return gulp.src('./www/mikecss/toolbar.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefix7', function() {
	return gulp.src('./www/mikecss/font-awesome.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefix8', function() {
	return gulp.src('./www/mikecss/fateaclone.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefix9', function() {
	return gulp.src('./www/mikecss/jquery.toolbar.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
		      browsers: ['last 2 versions'],
		      cascade: false,
		      remove: true
		     }))
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefixfinal', function() {
	return gulp.src('./www/mikecss/reset_css.css')
		// .pipe(sourcemaps.init())
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefixfinal2', function() {
	return gulp.src('./www/mikecss/reset_css.css')
		// .pipe(sourcemaps.init())
		.pipe(gulp.dest('./www/css'));
});

gulp.task('autoprefixfinal3', function() {
	return gulp.src('./www/mikecss/reset_css.css')
		// .pipe(sourcemaps.init())
		.pipe(gulp.dest('./www/css'));
});

gulp.task('imageview', function(done) {
  gulp.src('./scss/image_view.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});


gulp.task('ionic-app-sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

// gulp.task('watch', function() {
  // gulp.watch(paths.sass, ['sass']);
// });

gulp.task('watch', function() {
  gulp.watch(paths.autoprefixer, ['autoprefix']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
