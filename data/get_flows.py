"""
Download CTPP flow data for trips 
beginning in each state.
"""

import pandas as pd
from dataclasses import dataclass

from api import use_api
from helpers import fips_code_list


@dataclass
class FlowFromState:
    """
    For a given origin state, get flow data 
    from all trips that started in census 
    tracts within that state.
    """

    src_state: str

    dest_state: str = "*"
    level: str = "tract"
    topic: str = "B302203_e1"
    df: pd.DataFrame = None

    def __post_init__(self):
        self.df = self.get_tract_flows()

    def get_tract_flows(self) -> pd.DataFrame:
        print("Getting data for state:", self.src_state)
        params = {
            "in": f"state:{self.src_state}",
            "for": f"{self.level}:*",
            "get": self.topic,
            "d-in": f"state:{self.dest_state}",
            "d-for": f"{self.level}:*",
        }
        response = use_api(params)
        return pd.DataFrame.from_records(response.json()["data"])


if __name__ == "__main__":
    state_codes = fips_code_list()

    dfs = []
    for state in state_codes:
        flow_data = FlowFromState(state)
        flow_data.df.to_csv(f"./data/flows/from_{state}.csv")

        dfs.append(flow_data.df)

    merged_df = pd.concat(dfs)
    merged_df.to_csv(f"./data/flows/from_all_states.csv")
