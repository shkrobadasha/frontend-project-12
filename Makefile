.PHONY: build start

build:
	npm run build

start: build
	npx start-server -s ./frontend/dist
