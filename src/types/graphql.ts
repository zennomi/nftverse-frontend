export type ListingTokenEvent = {
    id: string,
    payToken: {
        decimals: number,
        id: string,
        symbol: string,
    },
    seller: string,
    timestamp: Date,
    price: string,
    token: {
        id: string,
        image: string,
        tokenId: string,
        uri: string
    },
    collection: {
        id: string,
        name: string,
        symbol: string,
    }
}