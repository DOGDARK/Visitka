lint:
	ruff format .
	ruff check --fix .

up_frontend:
	cd frontend && python -m http.server 8080

build_api:
	docker build -t api:latest -f Dockerfile.api .

build_bot:
	docker build -t bot:latest -f Dockerfile.bot .

build_pg:
	docker build -f Dockerfile.pg -t pg:latest .
