all: dist/liteid_2012/agent.js

dist/liteid_2012/%.js: lib/liteid_2012/%.mjs
	npx frida-compile --no-source-maps --compress $< -o $@

clean:
	rm -rf dist

.PHONY: all
