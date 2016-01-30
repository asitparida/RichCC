var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    del = require('del'),
    html2js = require('gulp-html-js-template'),
    minify = require('gulp-minify');

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

// Clean the distributable html directory
//gulp.task('minify:clean:html:js', function () {
//    return del('Resource/vx-grid-templates.js');
//});

//gulp.task('minify:html:js', ['minify:clean:html:js'], function () {
//    return gulp.src('Resource/vx-grid-templates.html')
//	.pipe(html2js())
//	.pipe(gulp.dest('Resource'));
//});

// Minify JS Files
//gulp.task('minify:js', ['minify:html:js'], function () {
//    return gulp.src('Resource/*.js')
//    .pipe(minify())
//    .pipe(gulp.dest('js'))
//});

// Clean the concated js directory
//gulp.task('clean:concat:js', function () {
//    return del('dist/min/js/vx.grid.all.min.js');
//});

//Concat JS Files
//gulp.task('concat:js', ['clean:concat:js', 'minify:js'], function () {
//    return gulp.src('./js/*min.js')
//    .pipe(concat('vx.grid.all.min.js'))
//    .pipe(gulp.dest('./dist/min/js'));
//});

//Watch JS task
//gulp.task('default:vxgrid:js', function () {
//    gulp.watch(['Resource/vx-grid.js', 'Resource/vx-grid-templates.html'], ['concat:js']);
//});

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
