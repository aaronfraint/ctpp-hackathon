"""
Download Census Tract geometries for all states
"""

import geopandas as gpd
from shapely.geometry import shape

from api import use_api
from helpers import fips_code_list


def get_tract_shapes(source_state, topic="a101101_e1") -> list:
    params = {
        "in": f"state:{source_state}",
        "for": "tract:*",
        "get": topic,
        "format": "geojson",
    }
    response = use_api(params)
    return response.json()["data"]


def convert_api_data_to_gdf(data_from_api: list) -> gpd.GeoDataFrame:
    data = []
    for feature in data_from_api:
        row = {k: v for k, v in feature["properties"].items()}
        row["geom"] = shape(feature["geometry"])
        data.append(row)

    gdf = gpd.GeoDataFrame.from_records(data).set_geometry("geom")

    names = gdf["name"].str.split(", ", expand=True)
    gdf["tract"] = names[0]
    gdf["county"] = names[1]
    gdf["state"] = names[2]

    return gdf


if __name__ == "__main__":
    state_codes = fips_code_list()

    dfs = []
    for state in state_codes:
        print(state)
        data = get_tract_shapes(state)
        gdf = convert_api_data_to_gdf(data)
        gdf.to_file(f"./data/shapefiles/tiger_2016_{state}.shp")
