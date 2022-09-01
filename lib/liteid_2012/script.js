const pkcs11Lib = 'pwpw-card-pkcs11.so';

waitForLib(pkcs11Lib, function (_, filename) {
  const cardModule = findModule('libpwpw-card.3.dylib');

  // 0007afe0 _sc_pace_ga_derieve_key
  const deriveKeyFn = cardModule.base.add(0x0007afe0);
  interceptKeys(cardModule.base, deriveKeyFn);
});


function interceptKeys(base, fn) {
  const cBase = base.add(0x00150b54);

  var pos;
  var out;
  Interceptor.attach(fn, {
    onEnter: function (args) {
      pos = args[1];
      out = args[3];
    },
    onLeave: function (ret) {
      const key = out.readByteArray(0x10);
      const c = cBase.add(pos << 2).readByteArray(4);

      send('c', c);
      send('key', key);
    }
  });
}

function findModule(pattern) {
  const modules = Process.enumerateModules();
  let l = modules.length;
  while (l--) {
    if (modules[l].path.match(pattern)) {
      return modules[l];
    }
  }
}

function waitForLib(lib, done) {
  const dlopen = Module.findExportByName('/usr/lib/libSystem.B.dylib', 'dlopen');

  var filename;
  Interceptor.attach(dlopen, {
    onEnter: function (args) {
      filename = Memory.readCString(ptr(args[0]));
      if (!filename.match(lib)) {
        filename = null;
      }
    },
    onLeave: function (ret) {
      if (filename) {
        done(null, filename);
      }
    }
  });
}
