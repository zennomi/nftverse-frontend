import { gql, useQuery } from "@apollo/client";
import { ListingTokenEvent } from "../types/graphql";

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

export const useListedTokens = ({ offset, limit }: { offset?: number, limit?: number }) => useQuery<{ listEvents: ListingTokenEvent[], totalListingTokens: number }, { offset?: number, limit?: number }>(GET_LISTED_TOKENS, { variables: { offset, limit } })