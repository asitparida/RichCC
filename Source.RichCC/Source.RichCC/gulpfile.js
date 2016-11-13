var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    del = require('del'),
    html2js = require('gulp-html-js-template'),
    minify = require('gulp-minify'),
    header = require('gulp-header');

gulp.task('styles', function () {
    gulp.src('scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css/'))
});

var errorHandler = function (error) {
    console.log(error);
    this.emit('end');
}

var resolveMinifiedPath = function (path) {
    var params = path.split("/");
    var file = params.splice(params.length - 1, 1)[0];
    var newPath = params.join("/") + "/";

    return {
        file: file,
        path: newPath
    };
}

// Clean the distributable css directory
gulp.task('minify:clean:css', function () {
    return del('css/');
});

// Compile out sass files and minify it
gulp.task('minify:css', ['minify:clean:css'], function () {
    var min = resolveMinifiedPath("./dist/min/css/richcc.min.css");
    return gulp.src('scss/*.scss')
        .pipe(plumber(errorHandler))
        .pipe(sass())
        .pipe(gulp.dest('css/'))
        .pipe(cssmin())
        .pipe(concat(min.file))
        .pipe(gulp.dest(min.path));
});

//Watch CSS task
gulp.task('default:richcc:css', function () {
    gulp.watch('scss/*.scss', ['minify:css']);
});

// Clean the distributable html directory
gulp.task('minify:clean:html:js', function () {
    return del('resource/richcc-templates.js');
});

// Generate HTML To JS
gulp.task('minify:html:js', ['minify:clean:html:js'], function () {
    return gulp.src('resource/richcc-templates.html')
	.pipe(html2js())
	.pipe(gulp.dest('Resource'));
});

// Minify JS Files
gulp.task('minify:js', ['minify:html:js'], function () {
    return gulp.src('resource/*.js')
    .pipe(minify())
    .pipe(gulp.dest('js'))
});

// Clean the concated js directory
gulp.task('clean:concat:js', function () {
    return del('dist/min/js/richcc.min.js');
});

//Concat JS Files
gulp.task('concat:js', ['clean:concat:js', 'minify:js'], function () {
    return gulp.src('./js/*min.js')
    .pipe(concat('richcc.min.js'))
    .pipe(gulp.dest('./dist/min/js'));
});


var banner = ['/**',
  ' * <%= pkg.name %>',
  ' * @version v<%= pkg.version %>',
  ' * @license <%= pkg.license %>',
  ' * @git <%= pkg.git %>',
  ' */',
  ''].join('\n');


var pkg = {
    name: 'RICH-CC',
    version: '1.3.2',
    license: 'MIT',
    git: 'https://github.com/asitparida/RichCC'
}


//Watch JS task
gulp.task('default:richcc:js', function () {
    gulp.watch(['resource/richcc.js', 'resource/richcc-templates.html'], ['concat:js']);
});

//Watch CSS task
gulp.task('default:richcc:dist-prod', function () {
    return gulp.src(['dist/min/js/richcc.min.js', 'dist/min/css/richcc.min.css'])
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('../../dist'));
});

