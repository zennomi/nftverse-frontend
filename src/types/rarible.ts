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