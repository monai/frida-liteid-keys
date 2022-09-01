const moduleName = 'pwpw-card-pkcs11.so';
const kdfOffset = 0x000a0120;
const counterOffset = 0x00205a04;

waitForLib(moduleName, () => {
  const module = findModule(moduleName);

  const deriveKeyFn = module.base.add(kdfOffset);
  interceptKeys(module.base, deriveKeyFn);
});

function interceptKeys(base, fn) {
  const cBase = base.add(counterOffset);

  let pos;
  let out;
  Interceptor.attach(fn, {
    onEnter(args) {
      pos = args[1];
      out = args[3];
    },
    onLeave() {
      const key = out.readByteArray(0x10);
      const c = cBase.add(pos << 2).readByteArray(4);

      send('c', c);
      send('key', key);
    },
  });
}

function findModule(pattern) {
  const modules = Process.enumerateModules();

  for (const module of modules) {
    if (module.path.match(pattern)) {
      return module;
    }
  }

  return undefined;
}

function waitForLib(lib, done) {
  const dlopen = Module.findExportByName('/usr/lib/libSystem.B.dylib', 'dlopen');

  let filename;
  Interceptor.attach(dlopen, {
    onEnter(args) {
      filename = Memory.readCString(ptr(args[0]));
      if (!filename.match(lib)) {
        filename = null;
      }
    },
    onLeave() {
      if (filename) {
        done(null, filename);
      }
    },
  });
}
