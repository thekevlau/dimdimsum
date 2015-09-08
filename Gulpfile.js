process.env.APP_NAME = 'dimdimsum';

require('./tasks/client');
// require('./tasks/css');

var cp = require('child_process');
var gulp = require('gulp');
var gutil = require('gulp-util');
var psTree = require('ps-tree');
var watch = require('watch');

var currentProcess;

gulp.task('start', ['watch:client'], function () {
    watch.watchTree('./' + process.env.APP_NAME + '/', { ignoreDotFiles: true },
            function (file) {
        if (currentProcess) {
            gutil.log('Restarting python server...');
            currentProcess.on('close', function () {
                currentProcess = cp.exec('python run.py');
                currentProcess.stdout.pipe(process.stdout);
                currentProcess.stderr.pipe(process.stderr);
            });
            psTree(currentProcess.pid, function (err, children) {
                // Kill all children and then parent with SIGKILL flag:
                // kill -9 children... parent.
                cp.spawn('kill', ['-9'].concat(children.map(function (p) {
                    // Children process objects in callback have pid on PID property :/
                    return p.PID;
                })).concat([currentProcess.pid]));
            });
        }
        else {
            gutil.log('Starting python server...');
            currentProcess = cp.exec('python run.py');
            currentProcess.stdout.pipe(process.stdout);
            currentProcess.stderr.pipe(process.stderr);
        }
    });
});
