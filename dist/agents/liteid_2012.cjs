📦
1549 /lib/agents/liteid_2012.cjs
✄
const moduleName = 'pwpw-card-pkcs11.so';
const kdfOffset = 0x000a0120;
const counterOffset = 0x00205a04;
const counterLabels = {
    1: 'enc',
    2: 'mac',
};
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
            const counter = cBase.add(pos << 2).add(3).readU8();
            const counterLabel = counterLabels[counter];
            if (counterLabel) {
                send(counterLabel, key);
            }
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
