import requests

from env_vars import CTPP_API_KEY

HEADERS = {"x-api-key": CTPP_API_KEY}
API_ENDPOINT = "http://ctpp.macrosysrt.com/api/data/2016"


def use_api(
    params: dict,
    endpoint: str = API_ENDPOINT,
    headers: dict = HEADERS,
) -> dict:
    response = requests.get(endpoint, headers=headers, params=params)
    return response
