
const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

// Load plugins

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const cssnano = require('cssnano');
const gulp = require('gulp');
// Clean assets

function clear() {
    return src('./assets/*', {
        read: false
    })
        .pipe(clean());
}

// CSS function 

function css() {
    const plugins = [
        cssnano()
    ];

    const source = './src/scss/main.scss';

    return src(source)
        .pipe(changed(source))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(postcss(plugins))
        .pipe(concat('style.css'))
        .pipe(dest('./assets/css/'))
        .pipe(browsersync.stream());
}

// Optimize images

function img() {
    return src('./src/img/*')
        .pipe(imagemin())
        .pipe(dest('./assets/img'));
}

// Watch files

function watchFiles() {
    watch('./src/scss/*', css);
    watch('./src/img/*', img);
}

// BrowserSync

function browserSync() {
    browsersync.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });
    gulp.watch("assets/**/*.html", css);
    gulp.watch("src/**/*.scss", css);
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(css, img));