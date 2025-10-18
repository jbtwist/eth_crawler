import os
from typing import Optional
from fastapi import FastAPI

from app.utils import AlchemyWeb3Provider, get_transactions
from .tokens import ERC20_ABI, ERC20_TOKENS
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()
w3 = AlchemyWeb3Provider().w3

origin = os.getenv("FRONTEND", "")
methods = os.getenv("ALLOWED_METHODS", "").split(",")
headers = os.getenv("ALLOWED_HEADERS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=methods,
    allow_headers=headers,
)

@app.get("/get_transactions/{address}")
def get_table(address: str, from_block: str, to_block: str, dir: str, maxCount: int, pageKey: Optional[str] = None):
    records = get_transactions(w3, address, from_block, to_block, dir, maxCount, pageKey)
