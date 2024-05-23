export function getIPFSUri(uri?: string) {
    if (!uri) return ""
    return uri.startsWith("ipfs://") ? "https://orange-objective-mockingbird-22.mypinata.cloud/ipfs/" + uri.slice(7) : uri
}