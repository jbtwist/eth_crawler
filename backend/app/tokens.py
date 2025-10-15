from enum import Enum

class ABIType(str, Enum):
    FUNCTION = "function"
    ADDRESS = "address"
    UINT256 = "uint256"

class ERC20Function(str, Enum):
    BALANCE_OF = "balanceOf"

class ERC20Parameter(str, Enum):
    OWNER = "_owner"
    BALANCE = "balance"

ERC20_ABI = [
    {
        "constant": True,
        "inputs": [
            {
                "name": ERC20Parameter.OWNER.value,
                "type": ABIType.ADDRESS.value
            }
        ],
        "name": ERC20Function.BALANCE_OF.value,
        "outputs": [
            {
                "name": ERC20Parameter.BALANCE.value,
                "type": ABIType.UINT256.value
            }
        ],
        "type": ABIType.FUNCTION.value,
    }
]

ERC20_TOKENS = {
    "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "DAI":  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
}