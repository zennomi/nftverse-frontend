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
    status: ListEventStatus,
    auctionData?: {
        endTime: string,
        minBid: string,
        startPrice: string,
        startTime: string
    },
    bidderEvents: { bidder: string }[],
    token: {
        id: string,
        name?: string,
        description?: string,
        image?: string,
        animation?: string,
        tokenId: string,
        uri?: string,
        attributes?: {
            traitType: string
            value: string
        }[]
    },
    collection: Collection
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

export enum ListEventStatus {
    LISTING = "LISTING",
    AUCTIONING = "AUCTIONING",
    SOLD = "SOLD",
    CANCELED = "CANCELED",
}

export enum CollectionCategory {
    ART = "ART",
    FUTURISTIC = "FUTURISTIC",
    PFP_MODEL = "PFP_MODEL",
    GAMING = "GAMING",
    JAPAN = "JAPAN",
    CAR = "CAR",
}

export type Token = {
    id: string
    description?: string
    image?: string
    name?: string
    uri?: string
    tokenId: string
    animation?: string
    collection: Collection
    attributes: {
        traitType: string
        value: string
    }[]
    file?: {
        mime: string
        path: string
    }
}

export type Collection = {
    id: string,
    name: string,
    symbol: string,
    category: string,
}