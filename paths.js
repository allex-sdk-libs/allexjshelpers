var Path = require('path');

function createPaths (lib, Node) {
  var Recognize = lib.moduleRecognition,
    q = lib.q,
    ALLEX_PATH = null,
    Npml = require('./npm')(lib, Node),
    Fs = Node.Fs,
    _root = require('allex_configrootserverruntimelib')();

  function allex() {
    if (ALLEX_PATH) return ALLEX_PATH;
    ALLEX_PATH = Node.getPackagePath(Path.dirname(require.resolve('allex')));
    return ALLEX_PATH;
  }

  function allexModule (module) {
    return Path.resolve(_root, module);
  }

  function allexWebC() {
    return Path.resolve(allex(), 'web_component');
  }

  function allexService(name, cwd) {
    return Recognize(name).then(onRecognizeForAllexService.bind(null, cwd));
  }

  function onRecognizeForAllexService (cwd, r) {
    if (!r) return undefined;
    if ('string' === typeof r) return undefined;
    return q(Path.resolve(cwd ? cwd : _root, 'node_modules', r.modulename));
  }

  function allexServiceWebC(name, cwd) {
    return allexService(name, cwd).then(
      onAllexServiceForAllexServiceWebC
    );
  }

  function onAllexServiceForAllexServiceWebC (service) {
    if (!service) return q(null);
    return q(Path.resolve(service, 'web_component'));
  }

  function findModule (modulename, cwd) {
    if (!cwd) {
      cwd = process.cwd();
    }else{
      cwd = Path.resolve(cwd);
    }

    var cwd_a = cwd.split(Path.sep),
      search;

    while (cwd_a.length) {
      search = Path.resolve(Path.sep+cwd_a.join(Path.sep), 'node_modules', modulename);
      try {
        if (Fs.dirExists(search) && modulename === Npml.read('name', search)) {
          return search;
        }
      } catch (ignore){
        console.log('===>', ignore.message, ignore.stack);
      }
      cwd_a.pop();
    }
    ///nothing found :(
  }

  return {
    allex: allex,
    allexWebC: allexWebC,
    allexService: allexService,
    allexServiceWebC: allexServiceWebC,
    findModule: findModule
  };
}

module.exports = createPaths;
