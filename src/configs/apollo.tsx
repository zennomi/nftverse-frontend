import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: 'https://nftverse-subsquid.zenno.moe/graphql',
    cache: new InMemoryCache(),
});