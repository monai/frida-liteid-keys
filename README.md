# liteid-keys

This script dumps the secure messaging session keys of the Lithuanian ID card's electronic signature application. It intercepts calls to key derivation function `KDF(K, c)` defined in Doc 9303-11 section 9.7.1 and prints its result and counter `c` value.

Example usage:

```shell
npx liteid-keys /usr/local/bin/pkcs11-tool --module /Library/PWPW-Card/lib/pwpw-card-pkcs11.so --login --pin XXXXXXXX --list-objects
```
