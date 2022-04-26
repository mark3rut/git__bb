const { src, dest, watch, parallel, series } = require('gulp');

const scss             = require('gulp-sass')(require('sass'));
// const scss = require('gulp-sass');
const concat           = require('gulp-concat');
const autoprefixer     = require('gulp-autoprefixer');
const uglify           = require('gulp-uglify');
const imagemin         = require('gulp-imagemin');
const del              = require('del');
const browserSync      = require('browser-sync').create();


function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notify: false
  });
}

function styles() {
  return src('app/scss/style.scss')
  // .pipe(scss({outputStyle: 'expanded'}))
  .pipe(scss({outputStyle: 'compressed'}))
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'],
    grid: true
  }))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}

function jsScript() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
    'node_modules/mixitup/dist/mixitup.js',
    'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
    'node_modules/rateyo/src/jquery.rateyo.js',
    'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function imageS() {
  return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
	  imagemin.mozjpeg({quality: 75, progressive: true}),
	  imagemin.optipng({optimizationLevel: 5}),
	  imagemin.svgo({
		  plugins: [
			  {removeViewBox: true},
			  {cleanupIDs: false}
		  ]
	})
  ]))
  .pipe(dest('dist/images'))
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.scss', '!app/js/main.min.js'], jsScript);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

function delL() {
  return del('dist')
}

function build() {
  return src([
    'app/**/*.html',
    'app/fonts/*.woff',
    'app/fonts/*.woff2',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}


  exports.styles = styles;
  exports.jsScript = jsScript;
  exports.browsersync = browsersync;
  exports.watching = watching;

  exports.delL = delL;
  exports.imageS = imageS;
  exports.build = build;
  // exports.build = series(delL, imageS, build);
  // exports.default = series(delL, imageS, build);

  exports.default = parallel(series(delL, imageS, build), styles, jsScript, browsersync, watching,);