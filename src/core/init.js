'use strict';

const defaults = require('lodash').defaults;

const defaultOptions = {
  watch: false,
  config: null,
  strict: false,
  callback () {},
};

/**
 * @description initialization function, does routing and kicks it all off
 * @param {Object} [options] options passed to stylint
 * @param {String} [pathPassed] path to files to lint
 * @return {Function} always returns a function, determined by cli flags
 */
const init = function (options, pathPassed) {
  options = defaults(options || {}, defaultOptions);

  this.config = this.setConfig(options.config);

  // if you want to use transparent mixins, pass in an array of them
  // this also covers the (more common probably) custom property use case
  this.cache.customProperties = this.config.mixins || this.config.customProperties || this.cache.customProperties;

  // we do the check here just in case
  // they don't pass in a reporter when using a custom config
  if (options.reporter) {
    this.reporter = require(options.reporter);
  }
  else if (this.config.reporter) {
    this.reporter = require(this.config.reporter);
  }
  else {
    this.reporter = require('./reporter');
  }

  // if path/ passed in use that for the dir
  this.state.path = pathPassed || this.state.path || process.cwd();
  this.callback = this.callback || options.callback;

  // fire watch or read based on flag
  if (options.watch) {
    return this.watch();
  }

  return this;
};

module.exports = init;
