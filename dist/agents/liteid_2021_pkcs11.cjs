📦
1020 /lib/agents/liteid_2021_pkcs11.cjs
✄
const moduleName = 'mcard-pkcs11.so';
const makePaceAesName = '_ZN5mcard7iso781611ApduWrapper13make_pace_aesEyRKNSt3__16vectorIhNS2_9allocatorIhEEEES8_';
waitForLib(moduleName, () => {
    const resolver = new ApiResolver('module');
    const makePaceAesFn = resolver.enumerateMatches(`exports:*!${makePaceAesName}`)[0];
    Interceptor.attach(makePaceAesFn.address, {
        onEnter(args) {
            send('enc', args[2].readPointer().readByteArray(0x10));
            send('mac', args[3].readPointer().readByteArray(0x10));
        },
    });
});
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
