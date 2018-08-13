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
var purescript = require('gulp-purescript');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var exec = require('child_process').exec;

var env = argv.prod ? "prod" : "dev";
var config = yaml.safeLoad(fs.readFileSync('config/build.yml', 'utf8'));
var generated = { buildNum : new Date().getTime() };
var envConf = config[env] || {};

console.log("Building for environment:", env);

for(key in config)
    if(key !== "prod" && key !== "dev")
        envConf[key] = config[key];
envConf.gen = generated;

var injectConfig = function() {
    if(!config[env]) throw "Invalid environment string: \"" + env + "\"";
    return replace(new RegExp("{{%(.*?)%}}","gi"), function(text) {
        var propList = text.replace(new RegExp("{{%|%}}","g"),"").trim().split(".");
        var replaceVal = propList.reduce(function(props,key) {
            if(!props[key])
                throw "Error during replacement. No such property: " + text;
            else
                return props[key];
        }, envConf);
        return replaceVal;
    });
};

var buildCss = function(stylesheet) {  
    exec('mkdir -p public/dist/css');
    exec('cabal run style ' + stylesheet + ' | tail -n 1 1> public/dist/css/' + stylesheet  + '.min.css');
};

gulp.task('build:reader-css', function() {
    gulp.src('src/css/reader.css')
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/dist/css'));

    buildCss("renderer");

});

gulp.task('build:reader-js', ['build:reader-elm'], function() {

    gulp.src(['tmp-elm/Main.js','src/js/RendererInterface.js','src/js/disqus-include.js','src/js/ga-include.js','src/js/ImagePreloader.js'])
        .pipe(concat('reader.js'))
        .pipe(injectConfig())
        .pipe(ifElse(env === "prod", stripDebug))
        .pipe(uglifyJS({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/dist/js'));

    gulp.src('src/js/Renderer.js')
        .pipe(rename('renderer.js'))
        .pipe(injectConfig())
        .pipe(ifElse(env === "prod", stripDebug))
        .pipe(uglifyJS({ mangle: false }).on('error', gutil.log))
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/dist/js'));
});

gulp.task('build:reader-html', function() {
    return gulp.src(['src/html/reader.html','src/html/renderer.html','src/html/mailchimp-signup.html'])
        .pipe(injectConfig())
        .pipe(gulp.dest('public'));
});

gulp.task('build:reader-elm', function() {
    return gulp.src('src/elm/Reader/Main.elm')
        .pipe(elm())
        .pipe(gulp.dest('tmp-elm'));
});

gulp.task('build:countdown-js', ['build:countdown-elm'], function() {

    gulp.src(['tmp-elm/ReleaseCountdown.js','src/js/ga-include.js'])
        .pipe(concat('countdown.js'))
        .pipe(injectConfig())
        .pipe(ifElse(env === "prod", stripDebug))
        .pipe(uglifyJS({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
         }))
        .pipe(gulp.dest('public/dist/js'));
});

gulp.task('build:countdown-html', function() {
    return gulp.src(['src/html/coming_soon.html'])
        .pipe(injectConfig())
        .pipe(gulp.dest('public'));
});

gulp.task('build:countdown-css', function() {
    buildCss("countdown");
});

gulp.task('build:countdown-elm', function() {
    return gulp.src('src/elm/ReleaseCountdown.elm')
        .pipe(elm())
        .pipe(gulp.dest('tmp-elm'));
});

var sources = [
  "src/purescript/**/*.purs",
  "bower_components/purescript-*/src/**/*.purs"
];

gulp.task('build:ps-deps', function() {
    return purescript.compile({ src: sources[1] });
});

gulp.task('build:editor-ps', function() {
    return purescript.compile({ src: sources });
});

gulp.task('build:editor-html', function() {
    return gulp.src(['src/html/editor.html'])
        .pipe(injectConfig())
        .pipe(gulp.dest('public'));
});

gulp.task('build:editor-css', function() {
    buildCss("editor");
});

gulp.task('build:editor', ['build:editor-html','build:editor-css','build:editor-ps'], function() {
    return purescript.bundle(
        { src: "output/**/*.js"
        , module: "Editor.Main"
        , main: "Editor.Main"
        , output: "public/dist/js/editor.js" 
        });
});

gulp.task('build:reader', ['build:reader-html','build:reader-css','build:reader-js'], function() {
    rimraf('./tmp-elm', function() {});
});

gulp.task('build:countdown', ['build:countdown-html','build:countdown-js','build:countdown-css'], function() {
    rimraf('./tmp-elm', function() {});
});
