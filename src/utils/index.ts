export function getIPFSUri(uri?: string) {
    if (!uri) return ""
    return uri.startsWith("ipfs://") ? "https://orange-objective-mockingbird-22.mypinata.cloud/ipfs/" + uri.slice(7) : uri
}

export function getWeservUrl(url: string | undefined, config?: {
    w?: number,
    h?: number,
    maxage?: `${number}d` | `${number}w` | `${number}M` | `${number}y`
}) {
    if (!url) url = "wsrv.nl/placeholder.svg"
    return `https://wsrv.nl/?url=${encodeURI(getIPFSUri(url))}${config?.w ? '&w=' + config.w : ''}${config?.h ? '&h=' + config.h : ''}${config?.maxage ? '&maxage=' + config.maxage : ''}`
}

export function shortenAddress(address: string, config?: {}) {
    return `${address.slice(0, 7)}...${address.slice(-6)}`
}