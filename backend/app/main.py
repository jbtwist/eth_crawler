import os
from fastapi import FastAPI
from web3 import Web3
from .tokens import ERC20_ABI, ERC20_TOKENS
from dotenv import load_dotenv


load_dotenv()

app = FastAPI()

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
ALCHEMY_URL = f'https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}'


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/balance/{address}")
def get_balance(address: str):
    w3 = Web3(Web3.HTTPProvider(ALCHEMY_URL))
    address = w3.to_checksum_address(address)
    eth_balance = w3.eth.get_balance(address)
    token_balances = {"ETH": eth_balance / 1e18}

    for name, address in ERC20_TOKENS.items():
        contract = w3.eth.contract(address=w3.to_checksum_address(address), abi=ERC20_ABI)
        balance = contract.functions.balanceOf(address).call()
        token_balances[name] = balance / 1e18

    return token_balances

