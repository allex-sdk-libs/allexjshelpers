'use strict';

var Path = require('path'),
  ConfigRoot = require('allex_configrootserverruntimelib')();

function createAllexJSHelpers (lib) {
  'use strict';

  var Node = require('allex_nodehelpersserverruntimelib')(lib),
    Fs = Node.Fs,
    ALLEX_WORKSPACE_DIR = Path.resolve(Fs.systemHome(), 'allexjs'),
    ALLEXJSPATH = Path.resolve(ALLEX_WORKSPACE_DIR, '.allexjs.json'),
    ALLEX_DIR = ConfigRoot,
    ALLEX_MODULES_DIR = Path.resolve(ALLEX_DIR, 'node_modules'),
    ALLEX_JS_EXISTS = allexJSExists();

  function allexJSExists () {
    return Fs.existsSync(ALLEXJSPATH);
  };

  function getAllexJSData () {
    return Fs.safeReadJSONFileSync(ALLEXJSPATH);
  }

  function store (data) {
    Fs.writeJSONSync(ALLEXJSPATH, data);
  }

  function storeToAllexJS (type, name, value) {
    var current = getAllexJSData();
    if (!current[type]) current[type] = {};
    current[type][name] = value;
    store(current);
  }

  function readFromAllexJS(type, name) {
    return getAllexJSData()[type][name]
  }

  function destroyTmpDir () {
    //TODO
  }

  function removeFromAllexJS (type, name) {
    var current = getAllexJSData();
    delete current[type][name];
    store(current);
  }

  function createTmpDir () {
    Fs.ensureDirSync(Path.resolve(ALLEX_WORKSPACE_DIR, '.tmp'));
  }

  function solutionKey (project, name) {
    return project+'/'+name;
  }

  function getDefaultAlias () {
    if (!ALLEX_JS_EXISTS) {
      return 'allex';
    }

    var t = getAllexJSData();
    return t && t.default_alias ? t.default_alias : 'allex';
  }

  return {
    getDefaultAlias : getDefaultAlias,
    ALLEX_WORKSPACE_DIR : ALLEX_WORKSPACE_DIR,
    destroyTmpDir : destroyTmpDir,
    createTmpDir : createTmpDir,
    storeToAllexJS : storeToAllexJS,
    removeFromAllexJS : removeFromAllexJS,
    getAllexJSData : getAllexJSData,
    readFromAllexJS : readFromAllexJS,
    store : store,
    solutionKey: solutionKey,
    ALLEX_DIR : ALLEX_DIR,
    ALLEX_MODULES_DIR : ALLEX_MODULES_DIR,
    allexJSExists : allexJSExists,
    paths: require('./paths')(lib, Node)
  };
}

module.exports = createAllexJSHelpers;
