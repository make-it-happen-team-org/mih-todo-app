const babel = require('./babel');
const clean = require('./clean');
const concurrent = require('./concurrent');
const cssLint = require('./cssLint');
const cssMin = require('./cssMin');
const env = require('./env');
const jsHint = require('./jsHint');
const karma = require('./karma');
const less = require('./less');
const mochatests = require('./mochatests');
const ngAnnotate = require('./ng.annotate');
const nodeInspector = require('./node.inspector');
const nodemon = require('./nodemon');
const uglify = require('./uglify');
const watch = require('./watch');

module.exports = {
  babel,
  clean,
  concurrent,
  cssLint,
  cssMin,
  env,
  jsHint,
  karma,
  less,
  mochatests,
  ngAnnotate,
  nodeInspector,
  nodemon,
  uglify,
  watch
};
