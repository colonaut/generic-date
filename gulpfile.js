var gulp = require('gulp');
var ts = require('gulp-typescript');
var _ts = require('gulp-typescript-alpha-1.5.0');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('build-dev', function () {
    return gulp.src('src/*.ts')
        .pipe(ts({
            target: 'ES5',
            module: 'commonjs'
            //noImplicitAny: true,
            //sortOutput: true,
            //outDir: './'
            //out: 'generic-date.0.1.min.js'
            }))
        .pipe(gulp.dest('src'));
});
gulp.task('map-dev', function () {
    return gulp.src('src/*.js')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src'));
});
gulp.task('watch-dev', function() {
    gulp.watch('src/*.ts', ['build-dev']);
    gulp.watch('src/*.ts', ['map-dev']);
});

gulp.task('build', function () {
    return gulp.src('src/*.js')
        .pipe(concat('generic-date.0.1.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});



