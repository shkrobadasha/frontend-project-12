install: preinstall frontend-install

preinstall:
	npm ci

frontend-install:
	cd frontend && npm ci 

build: install
	npm run build --prefix frontend

start:
	npx start-server -s ./frontend/dist