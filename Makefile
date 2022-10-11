build:
	yarn
	yarn build
#	./scripts/automaticmigrate.sh
	docker-compose up -d --build 

.PHONY: build

deploy:
	git pull
	yarn
	yarn build
	./scripts/automaticmigrate.sh
	docker-compose up -d --build 

.PHONY: deploy

up:
	docker-compose up -d 

.PHONY: up

down: 
	docker-compose down

.PHONY: down

logs:
	docker logs sonar-rotas-backend -f

.PHONY: logs
