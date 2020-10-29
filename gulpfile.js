const { src, dest, parallel, series, watch } = require('gulp')
const browserSynk = require('browser-sync').create()
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const sourcemaps = require('gulp-sourcemaps')
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')
const mediaGroup = require('gulp-group-css-media-queries')
const csso = require('gulp-csso')
const babel = require('gulp-babel')
const fileinclude = require('gulp-file-include')
const zip = require('gulp-zip');

const paths = {
    server: 'src/',
    src: {
        html: 'src/assets/html/pages/*.html',
        js: 'src/assets/js/main.js',
        scss: 'src/assets/scss/main.scss',
        fonts: 'src/assets/font/**/*.*',
        video: 'src/assets/video/**/*.*',
        audio: 'src/assets/audio/**/*.*',
        img: 'src/assets/img/**/*.*',
        icons: 'src/assets/icons/**/*.*',
        lib: 'src/assets/lib/**/*.*',
        css: 'src/assets/css/main.css'
    },
    dev: {
        html: 'src/',
        js: 'src/assets/js/',
        css: 'src/assets/css/',
        fonts: 'src/assets/font/',
        video: 'src/assets/video/',
        audio: 'src/assets/audio/',
        img: 'src/assets/img/',
        icons: 'src/assets/icons/',
        lib: 'src/assets/lib/',
    },
    watch: {
        html: 'src/assets/html/**/*.html',
        js: ['src/assets/js/**/*.js', '!src/assets/js/main.js'],
        scss: 'src/assets/scss/**/*.scss',
        fonts: 'src/assets/font/**/*.*',
        video: 'src/assets/video/**/*.*',
        audio: 'src/assets/audio/**/*.*',
        img: 'src/assets/img/**/*.*',
        icons: 'src/assets/icons/*.*',
        lib: 'src/assets/lib/**/*.*',
    },
    dist: {
        html: 'dist/',
        js: 'dist/assets/js/',
        fonts: 'dist/assets/font/',
        css: 'dist/assets/css/',
        video: 'dist/assets/video/',
        audio: 'dist/assets/audio/',
        img: 'dist/assets/img/',
        icons: 'dist/assets/icons/',
        lib: 'dist/assets/lib/',
    },
}
const distFilesName = {
    js: 'main.js',
    css: 'main.css'
}

// live server
let webserver = () => {
    browserSynk.init({
        server: {
            baseDir: paths.server,
            notify: true,
            online: true
        }
    })
}

/* 
 *
 *
 * * * * * * * * * * WATCHERS * * * * * * * * * * *
 *
 *
 */
// scripts 
let js = () => {
    return src(paths.watch.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat(distFilesName.js))
        .pipe(uglify())
        .pipe(sourcemaps.write('', {
            sourceMappingURLPrefix: ''
        }))
        .pipe(dest(paths.dev.js))
        .pipe(browserSynk.stream())
}

// html
let html = () => {
    return src(paths.src.html)
        .pipe(fileinclude())
        .pipe(dest(paths.dev.html))
        .pipe(browserSynk.stream())
}

// styles
let scss = () => {
    return src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(mediaGroup())
        .pipe(autoprefixer({
            overrideBrowserslist: 'last 3 version',
            flexbox: true,
            grid: true
        }))
        .pipe(csso())
        .pipe(sourcemaps.write('', {
            sourceMappingURLPrefix: ''
        }))
        .pipe(dest(paths.dev.css))
        .pipe(browserSynk.stream())
}

// fonts
let fonts = () => {
    return src(paths.src.fonts)
        .pipe(browserSynk.stream())
}

// video
let video = () => {
    return src(paths.src.video)
        .pipe(browserSynk.stream())
}

// audio
let audio = () => {
    return src(paths.src.audio)
        .pipe(browserSynk.stream())
}

// img
let img = () => {
    return src(paths.src.img)
        .pipe(browserSynk.stream())
}

// lib
let lib = () => {
    return src(paths.src.lib)
        .pipe(browserSynk.stream())
}

// icons
let icons = () => {
    return src(paths.src.icons)
        .pipe(browserSynk.stream())
}

// watcher
let watcher = () => {
    watch(paths.watch.js, js)
    watch(paths.watch.html, html)
    watch(paths.watch.scss, scss)
    watch(paths.watch.fonts, fonts)
    watch(paths.watch.video, video)
    watch(paths.watch.audio, audio)
    watch(paths.watch.img, img)
    watch(paths.watch.lib, lib)
    watch(paths.watch.icons, icons)
}

/* 
 *
 *
 * * * * * * * * * * BUILD * * * * * * * * * * *
 *
 *
 */

let fileFrom = {
    js: 'src/assets/js/main.js',
    html: 'src/*.html',
    css: 'src/assets/css/main.css',
    fonts: 'src/assets/font/**/*.*',
    video: 'src/assets/video/**/*.*',
    audio: 'src/assets/audio/**/*.*',
    img: 'src/assets/img/**/*.*',
    icons: 'src/assets/icons/*.*',
    lib: 'src/assets/lib/**/*.*',
}

// build
const build = {
    js: () => {
        return src(fileFrom.js)
            .pipe(dest(paths.dist.js))
    },
    html: () => {
        return src(fileFrom.html)
            .pipe(dest(paths.dist.html))
    },
    css: () => {
        return src(fileFrom.css)
            .pipe(dest(paths.dist.css))
    },
    fonts: () => {
        return src(fileFrom.fonts)
            .pipe(dest(paths.dist.fonts))
    },
    video: () => {
        return src(fileFrom.video)
            .pipe(dest(paths.dist.video))
    },
    audio: () => {
        return src(fileFrom.audio)
            .pipe(dest(paths.dist.audio))
    },
    img: () => {
        return src(fileFrom.img)
            .pipe(dest(paths.dist.img))
    },
    icons: () => {
        return src(fileFrom.icons)
            .pipe(dest(paths.dist.icons))
    },
    lib: () => {
        return src(fileFrom.lib)
            .pipe(dest(paths.dist.lib))
    },
    zip: () => {
        return src(['**/*.*', '!node_modules/**/*.*', '!dist/**/*.*', '!package-lock.json'])
            .pipe(zip('archive.zip'))
            .pipe(dest('dist/'))
    }
}

exports.server = webserver
exports.js = js
exports.html = html
exports.scss = scss

exports.default = series(
    parallel(
        js,
        html,
        scss,
        fonts,
        video,
        audio,
        img,
        icons,
        lib
    ),
    parallel(
        webserver,
        watcher
    )
)

exports.build = series(
    parallel(
        scss,
        html,
        js,
        fonts,
        video,
        audio,
        img,
        icons,
        lib
    ),
    parallel(
        build.lib,
        build.icons,
        build.img,
        build.fonts,
        build.video,
        build.audio,
        build.js,
        build.html,
        build.css,
    ),
    build.zip
)