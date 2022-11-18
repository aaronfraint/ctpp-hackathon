all:
	@echo CTPP Hackathon
	@echo --------------
	@echo make python-env
	@echo make data-download-flows
	@echo make data-download-shapes
	@echo make data-etl
	@echo make db-init

bq_schema := CTPP
processed_data_dir := ./data/files/processed_data

python-env:
	conda env create -f environment.yml

data-download-flows:
	mkdir -p ./data/files/flows
	./env/bin/python ./data/python/get_flows.py

data-download-shapes:
	mkdir -p ./data/files/shapefiles_tiger
	python ./data/python/get_shapes.py

data-etl:
	mkdir -p ./data/files/shapefiles_processed
	python ./data/python/etl_shapes.py

db-init:
	psql -d postgres -c "create database ctpp_hackathon;" 
	psql -d ctpp_hackathon -c "create extension postgis;"
	psql -d ctpp_hackathon -f ./data/sql/ST_CurvedLineFromStraightLine.sql

curves-between-tracts:
	shp2pgsql -W "latin1" -I -s 4326 ./data/files/processed_data/merged_tracts.shp usa_tracts | psql -d ctpp_hackathon
	psql -d ctpp_hackathon -f ./data/sql/create_curve_table.sql
	pgsql2shp -f ./data/files/processed_data/tract_to_tract_curves.shp ctpp_hackathon "select * from tract_to_tract_curves"

import-to-bq:

	@echo CONVERTING SHAPEFILE TO CSV WITH GEOJSON SHAPES
	cd $(processed_data_dir) && \
		ogr2ogr -f csv -dialect sqlite -sql "select AsGeoJSON(ST_Transform(geometry, 4326)) as geom, * from $(tablename)" $(tablename).csv ./

	@echo IMPORTING LOCAL CSV TO BIGQUERY
	cd $(processed_data_dir) && \
		bq load --source_format=CSV --skip_leading_rows=1 $(bq_schema).$(tablename) ./$(tablename).csv $(schema)

	@echo TRANSFORMING GEOJSON SHAPES INTO GEOMS WITHIN BIGQUERY
	bq query --nouse_legacy_sql \
		'create or replace table $(bq_schema).$(tablename)_geom as select * except(geom), ST_GeogFromGeoJson(geom, make_valid => TRUE) as geom from $(bq_schema).$(tablename)'

import-curves:
	make import-to-bq \
		tablename=tract_to_tract_curves \
		schema=geom:string,ORIGIN_NAM:string,DESTINATIO:string,B302203_E1:float64

import-tracts:
	make import-to-bq \
		tablename=merged_tracts \
		schema=geom:string,geoid:string,name:string,a101101_e1:float64,tract:string,county:string,state:string
