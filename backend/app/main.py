import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.alchemy_payloads import AssetTransferParams
from app.utils import AlchemyWeb3Provider, get_transactions

load_dotenv()

app = FastAPI()
w3 = AlchemyWeb3Provider().w3

origin = os.getenv("FRONTEND_URL", "")
methods = os.getenv("ALLOWED_METHODS", "").split(",")
headers = os.getenv("ALLOWED_HEADERS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=methods,
    allow_headers=headers,
)

@app.post("/get_transactions/{address}")
def get_table(query: AssetTransferParams):
    records = get_transactions(
        w3, 
        query    
    )
    return records
