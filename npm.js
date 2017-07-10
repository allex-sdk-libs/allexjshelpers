var Path = require('path');

function createNpm (Lib, Node) {
  'use strict';
  var Fs = Node.Fs;
  function read (field, path) {
    return Fs.readFieldFromJSONFile(Path.resolve(path || process.cwd(), 'package.json'), field);
  }

  return {
    read: read
  };
}

module.exports = createNpm;

