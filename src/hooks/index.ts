import { gql, useQuery } from "@apollo/client";
import { CollectionCategory, ConnectionQuery, ListingTokenEvent, Token } from "../types/graphql";
import useSWR from "swr/immutable";
import axios from "axios";
import { RaribleActivity } from "../types/rarible";
import { getOwnerOfToken } from "../utils/ethers";

export * from "./apollo"

const GET_LISTED_TOKENS = (after?: string) => gql`
query GetListingTokens($seller_not_eq: String = "", $category_eq: CollectionCategory = ART, $first: Int = 10${after ? ', $after: String = "1"' : ''}) {
  listEventsConnection(orderBy: timestamp_DESC, where: {status_eq: LISTING, seller_not_eq: $seller_not_eq, collection: {category_eq: $category_eq}}, first: $first${after ? ', after: $after' : ''}) {
    totalCount
    pageInfo {
      startCursor
      hasPreviousPage
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
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
          name
          description
          image
          animation
          tokenId
          uri
          attributes {
            traitType
            value
          }
        }
        collection {
          id
          name
          symbol
        }
      }
    }
  }
}
`

const GET_OWNED_LISTING_TOKENS = gql`
query GetListingTokens($seller_eq: String = "", $first: Int = 10, $after: String = "1") {
  listEventsConnection(orderBy: timestamp_DESC, where: {seller_eq: $seller_eq, status_in: [LISTING, AUCTIONING]}, first: $first, after: $after) {
    totalCount
    pageInfo {
      startCursor
      hasPreviousPage
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
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
        status
        auctionData {
          endTime
          minBid
          startPrice
          startTime
        }
        bidderEvents(orderBy: timestamp_DESC) {
          bidder
        }
      }
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

const GET_TOKEN_BY_ID = gql`
query GetTokenById($id: String = "") {
  tokenById(id: $id) {
    id
    description
    image
    name
    uri
    tokenId
    animation
    collection {
      category
      id
      name
      symbol
    }
    attributes {
      traitType
      value
    }
  }
}
`

const GET_LISTING_TOKEN = gql`
query GetListingToken($id_eq: String = "") {
  listEvents(where: {token: {id_eq: $id_eq}}, limit: 1) {
    payToken {
      decimals
      id
      name
      symbol
    }
    price
    seller
    timestamp
    token {
      animation
      id
      tokenId
    }
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

export const useListedTokens = ({ first, after, seller_not_eq, category_eq }:
  { first?: number, after?: string, seller_not_eq?: string, category_eq?: CollectionCategory }) => useQuery<{ listEventsConnection: ConnectionQuery<ListingTokenEvent>, }, { first?: number, after?: string, seller_not_eq?: string, category_eq?: CollectionCategory }>(GET_LISTED_TOKENS(after), { variables: { first, after, seller_not_eq, category_eq } })

export const useOwnedListingTokens = ({ first, after, seller_eq, }:
  { first?: number, after?: string, seller_eq?: string, }) => useQuery<{ listEventsConnection: ConnectionQuery<ListingTokenEvent>, }, { first?: number, after: string | null, seller_eq?: string, }>(GET_OWNED_LISTING_TOKENS, { variables: { first, after: after || null, seller_eq, } })

export const usePaymentTokens = () => useQuery<{ paymentTokens: { decimals: number, id: string, name: string, symbol: string }[] }>(GET_PAYMENT_TOKENS)

export const useToken = (id: string) => useQuery<{ tokenById: Token }, { id: string }>(GET_TOKEN_BY_ID, { variables: { id } })

export const useListingToken = (id: string, skip?: boolean) => useQuery<{ listEvents: ListingTokenEvent[] }, { id_eq: string }>(GET_LISTING_TOKEN, { variables: { id_eq: id }, skip })

// api
export const useOwnedTokens = ({ address, continuation }: { address: string, continuation?: string }) => useSWR(`useOwnedTokens-${address}`, () => raribleAxios({
  url: "/items/byOwner",
  params: {
    blockchains: "ETHEREUM",
    owner: `ETHEREUM:${address}`,
    continuation,
    size: 10
  }
}).then(res => res.data))

export const useTokenActivities = (id: string) => useSWR<{ activities: RaribleActivity[] }>(`useTokenActivities-${id}`, () => raribleAxios({
  url: "/activities/search",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  data: JSON.stringify({
    size: 50,
    filter: {
      blockchains: ["ETHEREUM"],
      types: [
        "TRANSFER",
        "MINT",
        "BURN"
      ],
      items: [`ETHEREUM:${id.replace("-", ":")}`]
    },
    sort: "LATEST",
  })
}).then(res => res.data))

export const useOwnerOfToken = (id: string) => useSWR<string>(`useOwnerOfToken-${id}`, () => getOwnerOfToken(id))