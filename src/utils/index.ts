export function getIPFSUri(uri: string) {
    return uri.startsWith("ipfs://") ? "https://orange-objective-mockingbird-22.mypinata.cloud/ipfs/" + uri.slice(7) : uri
}