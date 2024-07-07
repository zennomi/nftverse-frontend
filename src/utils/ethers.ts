import { Contract, Wallet } from "ethers"
import { JsonRpcProvider } from "ethers"
import { MARKETPLACE_ABI, ERC20_ABI, ERC721_ABI } from "../configs/abi"
import { ListEventStatus, ListingTokenEvent } from "../types/graphql"
import { MARKETPLACE_ADDRESS } from "../configs/addresses"
import { RaribleItem } from "../types/rarible"

const RPC_URL = "https://rpc.sepolia.org/"

export const provider = new JsonRpcProvider(RPC_URL)

export async function buyNFT(token: ListingTokenEvent, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    const [collection, tokenId] = token.token.id.split("-")
    await marketplaceContract.buyNFT(collection, tokenId, token.payToken.id, token.price)
}

export async function offerNFT(token: ListingTokenEvent, price: bigint, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    const [collection, tokenId] = token.token.id.split("-")
    await marketplaceContract.offerNFT(collection, tokenId, price)
}

export async function cancelOffer(id: string, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    const [collection, tokenId] = id.split("-")
    await marketplaceContract.cancelOfferNFT(collection, tokenId)
}

export async function acceptOffer(id: string, offerer: string, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    const [collection, tokenId] = id.split("-")
    await marketplaceContract.acceptOfferNFT(collection, tokenId, offerer)
}

export async function placeBidNFT(token: ListingTokenEvent, price: bigint, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)
    const [collection, tokenId] = token.token.id.split("-")
    await marketplaceContract.bidPlace(collection, tokenId, price)
}

export async function erc20Approve(tokenAddress: string, amount: string | bigint, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const erc20 = new Contract(tokenAddress, ERC20_ABI, wallet)

    let res = await erc20.approve(MARKETPLACE_ADDRESS, amount)

    await res.wait()
}

export async function listNFT(token: RaribleItem, paymentToken: string, price: BigInt, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const collectionAddress = token.contract.split(":")[1]
    const nft = new Contract(collectionAddress, ERC721_ABI, wallet)
    let res = await nft.approve(MARKETPLACE_ADDRESS, token.tokenId)

    await res.wait()

    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    await marketplaceContract.listNft(collectionAddress, token.tokenId, paymentToken, price)
}

export async function auctionNFT(token: RaribleItem, paymentToken: string, price: BigInt, duration: number, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const collectionAddress = token.contract.split(":")[1]
    const START_TIME = Math.round(Date.now() / 1000)

    const nft = new Contract(collectionAddress, ERC721_ABI, wallet)
    let res = await nft.approve(MARKETPLACE_ADDRESS, token.tokenId)

    await res.wait()

    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    await marketplaceContract.createAuction(collectionAddress, token.tokenId, paymentToken, price, BigInt(1), START_TIME, START_TIME + duration * 60)
}

export async function cancelListedNFT(token: ListingTokenEvent, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const collectionAddress = token.collection.id

    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    if (token.status === ListEventStatus.LISTING)
        await marketplaceContract.cancelListedNFT(collectionAddress, token.token.tokenId);
    else await marketplaceContract.cancelAuction(collectionAddress, token.token.tokenId);
}

export async function endAuction(token: ListingTokenEvent, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const collectionAddress = token.collection.id

    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    await marketplaceContract.resultAuction(collectionAddress, token.token.tokenId);
}

export async function getOwnerOfToken(id: string) {
    const [collection, tokenId] = id.split("-")
    const nft = new Contract(collection, ERC721_ABI, provider)

    const owner = await nft.ownerOf(tokenId) as string

    // if (owner === MARKETPLACE_ADDRESS) {
    //     const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI)

    //     const list = await marketplaceContract.listNfts(collection, tokenId)

    //     console.log(list)
    //     if (list.sold) return ListEventStatus.LISTING

    //     return ListEventStatus.AUCTIONING
    // }

    return owner
}