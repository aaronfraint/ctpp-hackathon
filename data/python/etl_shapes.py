import pandas as pd
import geopandas as gpd
from pathlib import Path

shp_path = Path("./data/files/shapefiles_tiger")

if __name__ == "__main__":

    gdfs = [gpd.read_file(shp) for shp in shp_path.rglob("*.shp")]

    merged_gdf = pd.concat(gdfs)

    merged_gdf.set_crs(epsg=4326, inplace=True)

    merged_gdf.to_file("./data/files/processed_data/merged_tracts.shp")
