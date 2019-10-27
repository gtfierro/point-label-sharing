all: install_dependencies

install_dependencies:
	pip install -r requirements.txt && \
	cd frontend && npm install && \
	cd .. && python app.py


