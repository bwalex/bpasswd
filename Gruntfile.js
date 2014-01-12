var path = require("path");
var wrench = require("wrench");
var fs = require("fs");
var archiver = require("archiver");
var pretty = require("prettysize");

module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      bpasswd: {
        options: {
          standalone: 'BPasswd',
          debug: false,
          transform: [
            require('deamdify')
          ],
        },
        files: {
          'dist/bpasswd.js' : ['common/bpasswd/bpasswd.js']
        }
      }
    },

    uglify: {
      bpasswd: {
        options: {
          report: 'min'
        },
        files: {
          'dist/bpasswd.min.js' : ['dist/bpasswd.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('chrome-ext', 'Compile the BPasswd chrome extension.', function() {
    var done = this.async(),
        archive = archiver('zip'),
        ostream = fs.createWriteStream('dist/bpasswd-chrome.zip');

    archive.on('error', function(err) {
      grunt.log.error(err);
      grunt.fail.warn('Archiving failed.');
    });

    ostream.on('close', function() {
      done();
    });

    archive.pipe(ostream);

    archive.append(fs.createReadStream('dist/bpasswd.min.js'), { name: 'bpasswd/bpasswd.js' });
    archive.bulk([
      { expand: true, cwd: 'chrome', src: ['**/*'] }
    ]);

    archive.finalize(function(err, bytes) {
      if (err)
        throw(err);
      console.log('Final size: ' + pretty(bytes));
    });
  });


  grunt.registerTask('firefox-ext', 'Compile the BPasswd firefox addon SDK extension.', function() {
    var done = this.async();

    if (!fs.existsSync('tmp'))
      fs.mkdirSync('tmp');
    wrench.rmdirSyncRecursive('tmp/firefox', true);
    wrench.copyDirSyncRecursive('firefox-jetpack/bpasswd2', 'tmp/firefox');
    fs.writeFileSync('tmp/firefox/data/bpasswd/bpasswd.js', fs.readFileSync('dist/bpasswd.min.js'));

    grunt.util.spawn({
      cmd: 'cfx',
      args: [
        'xpi',
        '--package-path=firefox-jetpack/packages',
        '--pkgdir=tmp/firefox',
        '--output-file=dist/bpasswd-jetpack.xpi'
      ]
    }, function(err, res, code) {
      if (err)
        throw(err);

      stats = fs.statSync('dist/bpasswd-jetpack.xpi');
      console.log('Final size: ' + pretty(stats.size));
      done();
    });
  });


  grunt.registerTask('bundle', ['browserify', 'uglify']);
  grunt.registerTask('compile', ['bundle', 'chrome-ext', 'firefox-ext']);
};