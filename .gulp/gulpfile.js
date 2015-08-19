'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
// var del = require('del');
// var glob = require('glob');
// var path = require('path');

// Process SVG
gulp.task('svg', function() {

    return gulp.src('../public/img/svg/src/**/*.svg')
        .pipe($.svgmin())
        .pipe(gulp.dest('../public/img/svg/min'))
        .pipe($.svgstore({
            fileName: 'sprite.svg',
            prefix: 'icon-',
            inlineSvg: true,
            transformSvg: function($svg, done) {
                $svg.find('[fill]').removeAttr('fill');
                $svg.find('[stroke]').removeAttr('stroke');
                done(null, $svg);
            }
        }))
        .pipe(gulp.dest('../public/img/svg/sprite'));

});

// Watch Files For Changes & Reload
gulp.task('watch', function() {
    gulp.watch(['../public/img/svg/src/**/*.svg'], ['svg']);
});

// Build Production Files, the Default Task
gulp.task('default', function (cb) {
    runSequence('svg', cb);
});