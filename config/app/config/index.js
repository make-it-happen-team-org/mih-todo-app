const _ = require('lodash');
const glob = require('glob');
const ENV_ALL_CONFIG = require('../env/all');
const NODE_ENV_CONFIG = require(`../env/${ process.env.NODE_ENV }`);
const resolvingConfig = () => _.extend(
  module.exports,
  ENV_ALL_CONFIG,
  NODE_ENV_CONFIG || {}
);
const getGlobbedFiles = (globPatterns, removeRoot) => {
  let output = [];
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i'); // eslint-disable-line
  const globHandler = (err, files) => {
    if (removeRoot) {
      files = files.map(file => file.replace(removeRoot, ''));
    }
    output = _.union(output, files);
  };

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else {
    if (_.isString(globPatterns)) {
      if (urlRegex.test(globPatterns)) {
        output.push(globPatterns);
      } else {
        glob(globPatterns, {sync: true}, globHandler);
      }
    }
  }

  return output;
};
const getJavaScriptAssets = (includeTests) => {
  let output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');

  // To include tests
  if (includeTests) {
    output = _.union(output, this.getGlobbedFiles(this.assets.tests));
  }

  return output;
};
const getCSSAssets = () => this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');

/**
 * Resolve environment configuration by extending each env configuration file,
 * and lastly merge/override that with any local repository configuration that exists
 * in local.js
 */
resolvingConfig();
module.exports.getGlobbedFiles = getGlobbedFiles;
module.exports.getJavaScriptAssets = getJavaScriptAssets;
module.exports.getCSSAssets = getCSSAssets;
