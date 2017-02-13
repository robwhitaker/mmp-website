var gulp = require('gulp');
var elm = require('gulp-elm');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-clean-css');
var uglifyJS = require('gulp-uglify');
var concat = require('gulp-concat');
var rimraf = require('rimraf');
var yaml = require('js-yaml');
var fs = require('fs');
var replace = require('gulp-replace');
var stripDebug = require('gulp-strip-debug');
var ifElse = require('gulp-if-else');
var argv = require('yargs').argv;

var env = argv.dev ? "dev" : "prod";
var config = yaml.safeLoad(fs.readFileSync('config/build.yml', 'utf8'));
var generated = { buildNum : new Date().getTime() };

for(key in config)
    config[key].gen = generated;

var injectConfig = function() {
    if(!config[env]) throw "Invalid environment string: \"" + env + "\"";
    return replace(new RegExp("{{%(.*?)%}}","gi"), function(text) {
        var propList = text.replace(new RegExp("{{%|%}}","g"),"").trim().split(".");
        var replaceVal = propList.reduce(function(props,key) {
            if(!props[key])
                throw "Error during replacement. No such property: " + text;
            else
                return props[key];
        }, config[env]);
        return replaceVal;
    });
};

gulp.task('build:reader-css', function() {
    gulp.src('public/static/css/reader.css')
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/css'));

    gulp.src('public/static/css/renderer.css')
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/css'));
});

gulp.task('build:reader-js', ['build:reader-elm'], function() {

    gulp.src(['tmp-elm/Main.js','public/static/js/RendererInterface.js','public/static/js/disqus-include.js','public/static/js/ga-include.js','public/static/js/ImagePreloader.js'])
        .pipe(concat('reader.js'))
        .pipe(injectConfig())
        .pipe(ifElse(env === "prod", stripDebug))
        .pipe(uglifyJS({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/js'));

    gulp.src('public/static/js/Renderer.js')
        .pipe(rename('renderer.js'))
        .pipe(injectConfig())
        .pipe(ifElse(env === "prod", stripDebug))
        .pipe(uglifyJS({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/js'));
});

gulp.task('build:reader-html', function() {
    return gulp.src(['public/static/html/reader.html','public/static/html/renderer.html'])
        .pipe(injectConfig())
        .pipe(gulp.dest('public'));
});

gulp.task('build:reader-elm', function() {
    return gulp.src('public/elm/Reader/Main.elm')
        .pipe(elm())
        .pipe(gulp.dest('tmp-elm'));
});

gulp.task('build:countdown-js', ['build:countdown-elm'], function() {

    gulp.src(['tmp-elm/ReleaseCountdown.js','public/static/js/ga-include.js'])
        .pipe(concat('countdown.js'))
        .pipe(injectConfig())
        .pipe(ifElse(env === "prod", stripDebug))
        .pipe(uglifyJS({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/js'));
});

gulp.task('build:countdown-html', function() {
    return gulp.src(['public/static/html/coming_soon.html'])
        .pipe(injectConfig())
        .pipe(gulp.dest('public'));
});

gulp.task('build:countdown-css', function() {
    gulp.src('public/static/css/countdown.css')
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/css'));
});

gulp.task('build:countdown-elm', function() {
    return gulp.src('public/elm/ReleaseCountdown.elm')
        .pipe(elm())
        .pipe(gulp.dest('tmp-elm'));
});

gulp.task('build:editor-js', function() {
    gulp.src(['editor.js','init-editor.js'], { cwd: 'public/static/js' })
        .pipe(concat('editor.js'))
        .pipe(uglifyJS({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/js'));
});

gulp.task('build:reader', ['build:reader-html','build:reader-css','build:reader-js'], function() {
    rimraf('./tmp-elm', function() {});
});

gulp.task('build:countdown', ['build:countdown-html','build:countdown-js','build:countdown-css'], function() {
    rimraf('./tmp-elm', function() {});
});
