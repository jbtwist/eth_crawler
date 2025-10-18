import os
from typing import Optional
from fastapi import FastAPI

from app.utils import AlchemyWeb3Provider, get_transactions
from .tokens import ERC20_ABI, ERC20_TOKENS
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
w3 = AlchemyWeb3Provider().w3

@app.get("/get_transactions/{address}")
def get_table(address: str, from_block: str, to_block: str, dir: str, maxCount: int, pageKey: Optional[str] = None):
    records = get_transactions(w3, address, from_block, to_block, dir, maxCount, pageKey)
