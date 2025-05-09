install: preinstall
		npm ci --prefix frontend

preinstall:
		npm ci

build: install
		npm run build

start:
		npx start-server -s ./frontend/dist