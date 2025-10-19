from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class AssetCategory(str, Enum):
    EXTERNAL = "external"
    INTERNAL = "internal"
    ERC20 = "erc20"
    ERC721 = "erc721"
    ERC1155 = "erc1155"


class AssetTransferParams(BaseModel):
    fromBlock: str = "0x0"
    toBlock: str = "latest"
    fromAddress: str = "0x0000000000000000000000000000000000000000"
    toAddress: str = "0x0000000000000000000000000000000000000000"
    excludeZeroValue: bool = True

    order: str = "desc"
    withMetadata: bool = False
    maxCount: str = "0x3e8"

    category: List[AssetCategory]


class AlchemyGetAssetTransfersRequest(BaseModel):
    id: int = 1
    jsonrpc: str = "2.0"
    method: str = "alchemy_getAssetTransfers"
    params: List[AssetTransferParams]

