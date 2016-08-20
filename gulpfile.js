var gulp = require('gulp');
var elm = require('gulp-elm');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-clean-css');
var uglifyJS = require('gulp-uglify');
var concat = require('gulp-concat');
var rimraf = require('rimraf');

gulp.task('build:reader-css', function() {
    gulp.src('public/static/css/reader.css')
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/'));
    gulp.src('public/static/css/renderer.css')
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build/'));
});

gulp.task('build:reader-js', ['build:reader-elm'], function() {

    gulp.src(['tmp-elm/Main.js','public/static/js/RendererInterface.js','public/static/js/disqus-include.js'])
        .pipe(concat('reader.js'))
        .pipe(uglifyJS({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/static/build'));

});

gulp.task('build:reader-elm', function() {
    return gulp.src('public/elm/Reader/Main.elm')
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
        .pipe(gulp.dest('public/static/build'));
});

gulp.task('build:reader', ['build:reader-css','build:reader-js'], function() {
    rimraf('./tmp-elm', function() {});
});
