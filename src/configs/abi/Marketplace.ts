const MARKETPLACE_ABI = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_platformFee"
            },
            {
                "type": "address",
                "name": "_feeRecipient"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AcceptedNFT",
        "inputs": [
            {
                "type": "address",
                "name": "nft",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "payToken",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "offerPrice",
                "indexed": false
            },
            {
                "type": "address",
                "name": "offerer",
                "indexed": false
            },
            {
                "type": "address",
                "name": "nftOwner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "BoughtNFT",
        "inputs": [
            {
                "type": "address",
                "name": "nft",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "payToken",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            },
            {
                "type": "address",
                "name": "seller",
                "indexed": false
            },
            {
                "type": "address",
                "name": "buyer",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CanceledOfferredNFT",
        "inputs": [
            {
                "type": "address",
                "name": "nft",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "payToken",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "offerPrice",
                "indexed": false
            },
            {
                "type": "address",
                "name": "offerer",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CreatedAuction",
        "inputs": [
            {
                "type": "address",
                "name": "nft",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "payToken",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "minBid",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "startTime",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "endTime",
                "indexed": false
            },
            {
                "type": "address",
                "name": "creator",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ListedNFT",
        "inputs": [
            {
                "type": "address",
                "name": "nft",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "payToken",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            },
            {
                "type": "address",
                "name": "seller",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OfferredNFT",
        "inputs": [
            {
                "type": "address",
                "name": "nft",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "payToken",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "offerPrice",
                "indexed": false
            },
            {
                "type": "address",
                "name": "offerer",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OwnershipTransferred",
        "inputs": [
            {
                "type": "address",
                "name": "previousOwner",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newOwner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PlacedBid",
        "inputs": [
            {
                "type": "address",
                "name": "nft",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "payToken",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "bidPrice",
                "indexed": false
            },
            {
                "type": "address",
                "name": "bidder",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ResultedAuction",
        "inputs": [
            {
                "type": "address",
                "name": "nft",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "creator",
                "indexed": false
            },
            {
                "type": "address",
                "name": "winner",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            },
            {
                "type": "address",
                "name": "caller",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "acceptOfferNFT",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            },
            {
                "type": "address",
                "name": "_offerer"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "addPayableToken",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_token"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "bidPlace",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            },
            {
                "type": "uint256",
                "name": "_bidPrice"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "bidPlaceByETH",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "buyNFT",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            },
            {
                "type": "address",
                "name": "_payToken"
            },
            {
                "type": "uint256",
                "name": "_price"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "buyNFTByETH",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "calculatePlatformFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_price"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "cancelAuction",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "cancelListedNFT",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "cancelOfferNFT",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "changeFeeRecipient",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_feeRecipient"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "checkIsPayableToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_payableToken"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "createAuction",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            },
            {
                "type": "address",
                "name": "_payToken"
            },
            {
                "type": "uint256",
                "name": "_price"
            },
            {
                "type": "uint256",
                "name": "_minBid"
            },
            {
                "type": "uint256",
                "name": "_startTime"
            },
            {
                "type": "uint256",
                "name": "_endTime"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getListedNFT",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "address",
                        "name": "nft"
                    },
                    {
                        "type": "uint256",
                        "name": "tokenId"
                    },
                    {
                        "type": "address",
                        "name": "seller"
                    },
                    {
                        "type": "address",
                        "name": "payToken"
                    },
                    {
                        "type": "uint256",
                        "name": "price"
                    },
                    {
                        "type": "bool",
                        "name": "sold"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getPayableTokens",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "listNft",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            },
            {
                "type": "address",
                "name": "_payToken"
            },
            {
                "type": "uint256",
                "name": "_price"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "offerNFT",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            },
            {
                "type": "uint256",
                "name": "_offerPrice"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "offerNFTByETH",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "owner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "renounceOwnership",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "resultAuction",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_nft"
            },
            {
                "type": "uint256",
                "name": "_tokenId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newOwner"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updatePlatformFee",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_platformFee"
            }
        ],
        "outputs": []
    }
]

export default MARKETPLACE_ABI