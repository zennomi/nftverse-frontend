export type RaribleItem = {
    id: string,
    collection: string,
    tokenId: string,
    itemCollection: {
        id: string,
        name: string,
    },
    contract: string,
    meta: {
        name: string,
        content: {
            "@type": "IMAGE",
            url: string,
            representation: "ORIGINAL",
            mimeType: "image/png",
            available: boolean,
        }[]
    }
}

export type RaribleActivity = {
    "@type": "TRANSFER" | "MINT" | "BURN"
    id: string
    date: string
    lastUpdatedAt: string
    cursor: string
    reverted: string
    from: string
    owner: string
    contract: string
    collection: string
    tokenId: string
    itemId: string
    value: string
    blockchainInfo: {
        transactionHash: string
        blockHash: string
        blockNumber: number
    }
}