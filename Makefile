all:
	@echo CTPP Hackathon
	@echo --------------
	@echo make python-env
	@echo make data-download
	@echo make data-etl
	@echo make db-init

python-env:
	python -m venv env && source env/bin/activate && pip install -r ./data/requirements.txt && pip install -r ./data/requirements-dev.txt

data-download:
	./env/bin/python ./data/python/get_flows.py
	./env/bin/python ./data/python/get_shapes.py

data-etl:
	./env/bin/python ./data/python/etl_shapes.py

db-init:
	psql -d postgres -c "create database ctpp_hackathon;" 
    psql -d ctpp_hackathon -c "create extension postgis;"
