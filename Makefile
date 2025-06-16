install: preinstall frontend-install

preinstall:
	npm ci

frontend-install:
	rm -rf frontend/node_modules
	cd frontend && npm install

build: install
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist