import json
import os
import hashlib

from dotenv import load_dotenv
from web3 import Web3

from app.alchemy_payloads import AssetCategory, AssetTransferParams
from app import cache

load_dotenv()

empty_address = "0x0000000000000000000000000000000000000000"

class AlchemyWeb3Provider:
    _instance = None
    _w3 = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
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

def get_in_transactions(
        w3: Web3, 
        address: str, 
        from_block: str, 
        to_block: str
    ) -> dict:
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

    if response.get('result'):
        response['result']['direction'] = 'in'

    return response.get('result', {})

def get_out_transactions(
        w3: Web3, 
        address: str, 
        from_block: str, 
        to_block: str
    ) -> dict:
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
    if response.get('result'):
        response['result']['direction'] = 'out'
    return response.get('result', {})

def get_transactions(
        w3: Web3, 
        query: AssetTransferParams
    ) -> dict:
    # If creating a robust search engine, I would implement more complex 
    # caching strategies, for this MVP I think this is enough
    cache_instance = cache.get_cache()
    cache_key = _generate_cache_key(query)
    cached_result = cache_instance.get(cache_key)
    if cached_result is not None:
        return cached_result
    
    # TODO: Use order, maxCount, withMetadata, pageKey in the query
    if query.fromAddress == empty_address and query.toAddress != empty_address:
        transactions = get_in_transactions(
            w3, 
            query.toAddress, 
            query.fromBlock, 
            query.toBlock
        )
    elif query.toAddress == empty_address and query.fromAddress != empty_address:
        transactions = get_out_transactions(
            w3,
            query.fromAddress,
            query.fromBlock,
            query.toBlock
        )
    else:
        transactions = {}
    cache_instance.set(cache_key, transactions)
    return transactions

def _generate_cache_key(params: AssetTransferParams) -> str:
    params_dict = params.model_dump(exclude_unset=True)
    params_str = json.dumps(params_dict, sort_keys=True)
    hash_key = hashlib.sha256(params_str.encode()).hexdigest()
    return f"alchemy:transactions:{hash_key}"

