lint:
	ruff format .
	ruff check --fix .

up_frontend:
	cd frontend && python -m http.server 8080

build_api:
	docker build -t api:latest -f Dockerfile.api .

build_bot:
	docker build -t bot:latest -f Dockerfile.bot .

up_tdb:
	docker run -d -p "5431:5432" --rm --name tdb -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tdb postgres
