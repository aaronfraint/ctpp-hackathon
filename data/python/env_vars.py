import os
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

CTPP_API_KEY = os.getenv("CTPP_API_KEY")
POSTGIS_DB = os.getenv("POSTGIS_DB")
