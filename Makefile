lint:
	ruff format .
	ruff check --fix .

up_frontend:
	cd frontend && python -m http.server 8080