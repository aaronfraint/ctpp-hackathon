CREATE OR REPLACE FUNCTION ST_CurvedLineFromStraightLine(the_geom GEOMETRY)
RETURNS GEOMETRY AS
$BODY$
	select
	ST_CurveToLine(
		'CIRCULARSTRING(' || 
			st_x(st_startpoint(the_geom)) || ' ' || 
			st_y(st_startpoint(the_geom)) || ', ' || 
			st_x(st_centroid(ST_OffsetCurve(the_geom, st_length(the_geom) / 10, 'quad_segs=4 join=bevel'))) || ' ' || 
			st_y(st_centroid(ST_OffsetCurve(the_geom, st_length(the_geom) / 10, 'quad_segs=4 join=bevel'))) || ', ' || 
			st_x(st_endpoint(the_geom)) || ' ' ||  
			st_y(st_endpoint(the_geom)) || ')'
	)
$BODY$
LANGUAGE sql;