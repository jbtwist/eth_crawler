from typing import Optional

from app.alchemy_payloads import AssetCategory, AssetTransferParams

import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

class AlchemyWeb3Provider:
    _instance = None
    _w3 = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AlchemyWeb3Provider, cls).__new__(cls)
            ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
            ALCHEMY_URL = os.getenv(
                "ALCHEMY_URL",
                "https://eth-mainnet.g.alchemy.com/v2/"
            )
            ALCHEMY_URI = f"{ALCHEMY_URL}{ALCHEMY_API_KEY}"
            cls._w3 = Web3(Web3.HTTPProvider(ALCHEMY_URI))
        return cls._instance

    @property
    def w3(self) -> Web3:
        return self._w3


def get_web3() -> Web3:
    return AlchemyWeb3Provider().w3

def get_in_transactions(w3: Web3, address: str, from_block: str, to_block: str):
    transfer_params = AssetTransferParams(
        fromBlock=from_block,
        toBlock=to_block,
        toAddress=address,
        category=[
            AssetCategory.EXTERNAL,
            AssetCategory.INTERNAL,
            AssetCategory.ERC20,
            AssetCategory.ERC721,
            AssetCategory.ERC1155
        ],
        excludeZeroValue=False
    )

    response = w3.provider.make_request(
        "alchemy_getAssetTransfers",
        [transfer_params.model_dump(exclude_unset=True)]
    )
    return response.get('result', {}).get('transfers', [])

def get_out_transactions(w3: Web3, address: str, from_block: str, to_block: str):
    transfer_params = AssetTransferParams(
        fromBlock=from_block,
        toBlock=to_block,
        fromAddress=address,
        category=[
            AssetCategory.EXTERNAL,
            AssetCategory.INTERNAL,
            AssetCategory.ERC20,
            AssetCategory.ERC721,
            AssetCategory.ERC1155
        ],
        excludeZeroValue=False
    )

    response = w3.provider.make_request(
        "alchemy_getAssetTransfers",
        [transfer_params.model_dump(exclude_unset=True)]
    )
    return response.get('result', {}).get('transfers', [])

def get_transactions(w3: Web3, address: str, from_block: str, to_block: str, dir: str, maxCount: int, pageKey: Optional[str] = None):
    pass