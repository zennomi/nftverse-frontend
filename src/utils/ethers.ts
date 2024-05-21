import { Contract, Wallet } from "ethers"
import { JsonRpcProvider } from "ethers"
import { MARKETPLACE_ABI, ERC20_ABI } from "../configs/abi"
import { ListingTokenEvent } from "../types/graphql"
import { MARKETPLACE_ADDRESS } from "../configs/addresses"

const RPC_URL = "https://rpc.sepolia.org/"

const provider = new JsonRpcProvider(RPC_URL)


export async function buyNFT(token: ListingTokenEvent, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, wallet)

    await marketplaceContract.buyNFT(token.collection.id, token.token.tokenId, token.payToken.id, token.price)
}

export async function erc20Approve(tokenAddress: string, amount: string, privateKey: string) {
    const wallet = new Wallet(privateKey, provider)
    const erc20 = new Contract(tokenAddress, ERC20_ABI, wallet)

    let res = await erc20.approve(MARKETPLACE_ADDRESS, amount)

    await res.wait()
}