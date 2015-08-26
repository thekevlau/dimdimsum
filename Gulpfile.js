process.env.APP_NAME = 'dimdimsum';

require('./tasks/client');
require('./tasks/css');

var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('start', ['watch:client', 'watch:css'], function () {
    // Start python server.
});
