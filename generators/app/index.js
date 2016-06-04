/// <reference path="../../_references.d.ts" />

'use strict';

var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

var paths = {
  src: 'src/',
  dist: 'dist/'
};

module.exports = yeoman.generators.Base.extend({
  // Configurations will be loaded here.
  // Ask for user input
  prompting: function () {
    var done = this.async();
    this.prompt([{
      type: 'input',
      name: 'name',
      message: 'The project name',
      // Defaults to the project's folder name if the input is skipped
      default: this.appname
    }, {
      type: 'input',
      name: 'description',
      message: 'A brief description'
    }, {
        type: 'input',
        name: 'author',
        message: 'The primary author',
        default: 'Jim Buck <jim@jimmyboh.com>',
        store: true
    }, {
        type: 'input',
        name: 'username',
        message: 'Your GitHub username',
        default: 'JimmyBoh',
        store: true
    }, {
      type: 'list',
      name: 'license',
      message: 'Which license are you using?',
      choices: [{
        name: 'MIT (jQuery, .NET Core, Rails)',
        value: 'MIT'
      }, {
        name: 'Apache 2.0 (Android, Apache, Swift)',
        value: 'Apache-2.0'
      }, {
        name: 'GNU GPL v3 (Bash, GIMP, PrivacyBadger)',
        value: 'GPL-3.0'
      }],
      default: 'MIT'
    }], function (answers) {
      this.props = answers;
      done();
    }.bind(this));
  },

  // Writing Logic here
  writing: {

    folders: function () {     
      mkdirp.sync(paths.src);
      mkdirp.sync(paths.dist);
    },

    // Copy the configuration files
    config: function () {

      ['package.json', 'typings.json', 'tsconfig.json', 'README.md', 'index.js'].forEach(function (path) {
        this.fs.copyTpl(
          this.templatePath('_' + path),
          this.destinationPath(path),
          this.props
        );
      }.bind(this));

      ['gulpfile.js', '.gitignore', '.travis.yml', '_references.d.ts', '.npmignore'].forEach(function (path) {
        this.fs.copy(
          this.templatePath('_' + path),
          this.destinationPath(path)
        );
      }.bind(this));
    },

    // Copy application files
    app: function () {
      ['index.ts', 'index.spec.ts'].forEach(function (path) {
        this.fs.copy(
          this.templatePath(paths.src + '_' + path),
          this.destinationPath(paths.src + path)
        );
      }.bind(this));
    },

    // Install Dependencies
    install: function () {
      this.npmInstall([], {}, function () {
        this.spawnCommand('typings', ['install', 'dt~node', '--global', '--save'])
      }.bind(this));
    }
  },
});