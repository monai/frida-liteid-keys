dist_files = \
	dist/agents/liteid_2012.cjs \
	dist/agents/liteid_2021.cjs \
	dist/agents/liteid_2021_pkcs11.cjs

all: $(dist_files)

dist/agents/%.cjs: lib/agents/%.cjs
	npx frida-compile --no-source-maps --compress $< -o $@

clean:
	rm -rf dist

.PHONY: all
