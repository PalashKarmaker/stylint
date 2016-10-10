'use strict';

// strips out block comments and urls
const cleanFileRe = /(\r\n|\n|\r)|(^(\/\*)|([\s'"](\/\*)))(?!\/)(.|[\r\n]|\n)+?\*\/\n?/gm;
const lineEndingsRe = /\r\n|\n|\r/gm;

/**
 * @description parses file for testing by removing extra new lines and block comments
 * @param {Object} [err] error obj from async if it exists
 * @param {Array} [res] array of files to parse
 * @param {boolean} [skipDone] if true, don't call done
 * @returns {Object} the result object from the run
 */
const parse = function (err, res, skipDone) {
  if (err) {
    throw new Error(err);
  }

  res.forEach((file, i) => {
    this.cache.file = this.cache.files[i];
    this.cache.fileNo = i;

    // strip out block comments, but dont destroy line history
    // to do these we replace block comments with new lines
    const lines = file.toString().replace(cleanFileRe, str => {
      // WHERE IS YOUR GOD NOW
      return (new Array(str.split(lineEndingsRe).length)).join('\n');
    }).split('\n');

    // updating cache as we go, and passing to the next step
    lines.forEach((line, lineNo) => {
      this.cache.source = line;
      this.cache.line = this.trimLine(line);
      this.cache.lineNo = lineNo + 1; // line nos don't start at 0
      this.cache.rule = '';
      this.cache.col = null;
      return this.setState(line);
    });

    // save previous file
    this.cache.prevFile = this.cache.file;
  });

  this.transformMessages(skipDone);

  return this.cache.report;
};

module.exports = parse;
