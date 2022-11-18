import pandas as pd
from pathlib import Path
from sqlalchemy import create_engine

from env_vars import POSTGIS_DB


if __name__ == "__main__":
    filepath = Path("./data/files/flows")

    engine = create_engine(POSTGIS_DB)

    files = [pd.read_csv(csv) for csv in filepath.rglob("B302203_e1_*.csv")]

    merged_df = pd.concat(files)
    merged_df.to_sql("total_flows", con=engine, if_exists="replace")

    engine.dispose()
