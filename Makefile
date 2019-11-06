all: install_dependencies

install_dependencies:
	pip install -r requirements.txt && \
	cd frontend && npm install && npm run build


