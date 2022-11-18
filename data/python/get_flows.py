"""
Download CTPP flow data for trips 
beginning in each state.
"""

import pandas as pd
from pathlib import Path
from dataclasses import dataclass

from api import use_api
from helpers import fips_code_list, codes_for_b302203


@dataclass
class FlowFromState:
    """
    For a given origin state, get flow data
    from all trips that started in census
    tracts within that state.
    """

    src_state: str
    topic: str

    dest_state: str = "*"
    level: str = "tract"
    df: pd.DataFrame = None

    def __post_init__(self):
        self.df = self.get_tract_flows()

    def get_tract_flows(self) -> pd.DataFrame:
        print(f"Getting {self.topic} for state: {self.src_state}")
        params = {
            "in": f"state:{self.src_state}",
            "for": f"{self.level}:*",
            "get": self.topic,
            "d-in": f"state:{self.dest_state}",
            "d-for": f"{self.level}:*",
        }
        response = use_api(params).json()
        if "data" not in response:
            print(response)
        return pd.DataFrame.from_records(response["data"])


def main():
    state_codes = fips_code_list()
    topic_codes = codes_for_b302203()

    for topic in topic_codes:
        for state in state_codes:
            output_file = Path(f"./data/files/flows/{topic}_from_{state}.csv")
            if not output_file.exists():
                flow_data = FlowFromState(state, topic)
                flow_data.df.to_csv(output_file)
            else:
                print(f"{topic} - {state} already exists")


if __name__ == "__main__":
    main()
