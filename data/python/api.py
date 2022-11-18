import os
import requests
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

HEADERS = {"x-api-key": os.getenv("CTPP_API_KEY")}
API_ENDPOINT = "http://ctpp.macrosysrt.com/api/data/2016"


def use_api(
    params: dict,
    endpoint: str = API_ENDPOINT,
    headers: dict = HEADERS,
) -> dict:
    response = requests.get(endpoint, headers=headers, params=params)
    return response
