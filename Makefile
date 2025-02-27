VERSION := $(shell git describe --tags | sed 's/\(.*\)-.*/\1/')

version:
	@echo "export default '$(VERSION)'" > 'src/config/version.js'

build:
	rm -rf dist
	npm run build