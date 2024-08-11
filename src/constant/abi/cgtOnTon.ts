const tokenAbi = {
    "ABI version": 2,
    "version": "2.2",
    "header": ["pubkey", "time", "expire"],
    "functions": [
      {
        "name": "constructor",
        "inputs": [
          {"name": "name", "type": "string"},
          {"name": "symbol", "type": "string"},
          {"name": "decimals", "type": "uint8"},
          {"name": "root_public_key", "type": "uint256"},
          {"name": "total_supply", "type": "uint128"}
        ],
        "outputs": []
      },
      {
        "name": "name",
        "inputs": [],
        "outputs": [
          {"name": "name", "type": "string"}
        ]
      },
      {
        "name": "symbol",
        "inputs": [],
        "outputs": [
          {"name": "symbol", "type": "string"}
        ]
      },
      {
        "name": "decimals",
        "inputs": [],
        "outputs": [
          {"name": "decimals", "type": "uint8"}
        ]
      },
      {
        "name": "totalSupply",
        "inputs": [],
        "outputs": [
          {"name": "total_supply", "type": "uint128"}
        ]
      },
      {
        "name": "balanceOf",
        "inputs": [
          {"name": "owner", "type": "address"}
        ],
        "outputs": [
          {"name": "balance", "type": "uint128"}
        ]
      },
      {
        "name": "transfer",
        "inputs": [
          {"name": "to", "type": "address"},
          {"name": "tokens", "type": "uint128"}
        ],
        "outputs": [
          {"name": "success", "type": "bool"}
        ]
      }
    ],
    "data": [],
    "events": [],
    "fields": [
      {"name": "_pubkey", "type": "uint256"},
      {"name": "_timestamp", "type": "uint64"},
      {"name": "_constructorFlag", "type": "bool"},
      {"name": "name_", "type": "string"},
      {"name": "symbol_", "type": "string"},
      {"name": "decimals_", "type": "uint8"},
      {"name": "rootPublicKey_", "type": "uint256"},
      {"name": "totalSupply_", "type": "uint128"}
    ]
  };