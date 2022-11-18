import pandas as pd
import geopandas as gpd
from pathlib import Path

shp_path = Path("./data/files/shapefiles_tiger")

if __name__ == "__main__":

    gdfs = [gpd.read_file(shp) for shp in shp_path.rglob("*.shp")]

    merged_gdf = pd.concat(gdfs)

    print(merged_gdf.shape)

    merged_gdf.to_file("./data/files/shapefiles_processed/merged_tracts.shp")
