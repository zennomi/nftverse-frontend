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
        image?: string,
        tokenId: string,
        uri?: string
    },
    collection: {
        id: string,
        name: string,
        symbol: string,
    }
}

export type ConnectionQuery<T> = {
    totalCount: number,
    pageInfo: {
        startCursor: number
        hasPreviousPage: boolean
        hasNextPage: boolean
        endCursor: number
    }
    edges: {
        cursor: number
        node: T
    }[]
}

export enum CollectionCategory {
    ART = "ART",
    FUTURISTIC = "FUTURISTIC",
    PFP_MODEL = "PFP_MODEL",
    GAMING = "GAMING",
    JAPAN = "JAPAN",
}
