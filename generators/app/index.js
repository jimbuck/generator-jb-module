/// <reference path="../../_references.d.ts" />

'use strict';

var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

var paths = {
  src: 'src/',
  dist: 'dist/',
  vscode: '.vscode/'
};

module.exports = yeoman.Base.extend({
  // Configurations will be loaded here.
  // Ask for user input
  prompting: function () {
    return this.prompt([{
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
    }]).then(answers => {
      this.props = answers;
    });
  },

  // Writing Logic here
  writing: {

    folders: function () {     
      mkdirp.sync(paths.src);
      mkdirp.sync(paths.dist);
      mkdirp.sync(paths.vscode);
    },

    // Copy the configuration files
    config: function () {

      ['settings.json', 'tasks.json'].forEach(function (path) {
        this.fs.copy(
          this.templatePath(paths.vscode + '_' + path),
          this.destinationPath(paths.vscode + path)
        );
      }.bind(this));

      ['package.json', 'tsconfig.json', 'README.md', 'index.js'].forEach(function (path) {
        this.fs.copyTpl(
          this.templatePath('_' + path),
          this.destinationPath(path),
          this.props
        );
      }.bind(this));

      ['gulpfile.js', '.gitignore', '.travis.yml', '.npmignore', 'jsconfig.json'].forEach(function (path) {
        this.fs.copy(
          this.templatePath('_' + path),
          this.destinationPath(path)
        );
      }.bind(this));
    },

    // Install Dependencies
    install: function () {
      
      this.npmInstall([
        'typescript',
        'ava',
        'coveralls',
        'del',
        'gulp',
        'gulp-shell',
        'nyc',
        'yargs',
        '@types/node'
      ], { saveDev: true });
    }
  },
});