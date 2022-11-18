create table if not exists tract_to_tract_curves as

with all_flows as (
	select origin_name, destination_name, b302203_e1
	from total_flows
	where origin_name != destination_name
	group by origin_name, destination_name, b302203_e1
)
select
	f.*, 
	ST_CurvedLineFromStraightLine(
        st_setsrid(
            st_makeline(
		        st_centroid(a.geom),
                st_centroid(b.geom)
            ), 
            4326
        )
    ) as geom
from all_flows f
left join usa_tracts a on a.name = f.origin_name
left join usa_tracts b on b.name = f.destination_name;



ALTER TABLE tract_to_tract_curves
ALTER COLUMN geom TYPE geometry('LINESTRING', 4326)
USING ST_Transform(ST_SetSRID(geom, 4326), 4326);