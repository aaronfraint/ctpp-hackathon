all:
	@echo CTPP Hackathon
	@echo --------------
	@echo make python-env
	@echo make data

python-env:
	python -m venv env && source env/bin/activate && pip install -r ./data/requirements.txt

data:
	source env/bin/activate && python ./data/get_flows.py
	source env/bin/activate && python ./data/get_shapes.py
