# frida-liteid-keys

This script dumps the secure messaging session keys of the Lithuanian ID cards. ATK 2012 and ATK 2021 cards are supported.

Example usage:

```shell
bin/liteid-2012-keys.mjs /usr/local/bin/pkcs11-tool -v --module /Library/PWPW-Card/lib/pwpw-card-pkcs11.so --login --pin XXX -O

bin/liteid-2021-keys-pkcs11.mjs /usr/local/bin/pkcs11-tool -v --module /Library/mCard/lib/mcard-pkcs11.so -O
bin/liteid-2021-keys.mjs -n "Softemia mCard toolbox"
```
