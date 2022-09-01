const makePaceAesName = '_ZN5mcard7iso781611ApduWrapper13make_pace_aesEyRKNSt3__16vectorIhNS2_9allocatorIhEEEES8_';

const resolver = new ApiResolver('module');
const makePaceAesFn = resolver.enumerateMatches(`exports:*!${makePaceAesName}`)[0];

Interceptor.attach(makePaceAesFn.address, {
  onEnter(args) {
    send('enc', args[2].readPointer().readByteArray(0x10));
    send('mac', args[3].readPointer().readByteArray(0x10));
  },
});
