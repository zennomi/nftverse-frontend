import { gql, useQuery } from "@apollo/client";
import { ListingTokenEvent } from "../types/graphql";
import useSWR from "swr/immutable";
import axios from "axios";

export * from "./apollo"

const GET_LISTED_TOKENS = gql`
query GetListingTokens($offset: Int = 0, $limit: Int = 10) {
  listEvents(offset: $offset, orderBy: timestamp_DESC, where: {status_eq: LISTING}, limit: $limit) {
    id
    payToken {
      decimals
      id
      symbol
    }
    price
    seller
    timestamp
    token {
      id
      image
      tokenId
      uri
    }
    collection {
      id
      name
      symbol
    }
  }

  totalListingTokens
}
`

const GET_OWNED_LISTING_TOKENS = gql`
query GetOwnedListingTokens($offset: Int = 0, $limit: Int = 10, $seller_eq: String = "") {
  listEvents(offset: $offset, orderBy: timestamp_DESC, where: {status_eq: LISTING, seller_eq: $seller_eq}, limit: $limit) {
    id
    payToken {
      decimals
      id
      symbol
    }
    price
    seller
    timestamp
    token {
      id
      image
      tokenId
      uri
    }
    collection {
      id
      name
      symbol
    }
  }
}
`

const GET_PAYMENT_TOKENS = gql`
query GetPaymentTokens {
  paymentTokens {
    decimals
    id
    name
    symbol
  }
}
`

const raribleAxios = axios.create({
  baseURL: `https://testnet-api.rarible.org/v0.1`,
  headers: {
    "X-API-KEY": "e6202268-706c-44da-bab1-db9ddb42dc39",
    Accept: "application/json"
  }
})

// graphql 

export const useListedTokens = ({ offset, limit }: { offset?: number, limit?: number }) => useQuery<{ listEvents: ListingTokenEvent[], totalListingTokens: number }, { offset?: number, limit?: number }>(GET_LISTED_TOKENS, { variables: { offset, limit } })

export const useOwnedListingTokens = ({ offset, limit, owner }: { offset?: number, limit?: number, owner?: string }) => useQuery<{ listEvents: ListingTokenEvent[], }, { offset?: number, limit?: number, seller_eq?: string }>(GET_OWNED_LISTING_TOKENS, { variables: { offset, limit, seller_eq: owner } })

export const usePaymentTokens = () => useQuery<{ paymentTokens: { decimals: number, id: string, name: string, symbol: string }[] }>(GET_PAYMENT_TOKENS)
// api
export const useOwnedTokens = ({ address, continuation }: { address: string, continuation?: string }) => useSWR(`useOwnedTokens-${address}`, () => raribleAxios({
  url: "/items/byOwner",
  params: {
    blockchains: "ETHEREUM",
    owner: `ETHEREUM:${address}`,
    continuation
  }
}).then(res => res.data))