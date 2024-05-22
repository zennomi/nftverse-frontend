import { useApolloClient } from "@apollo/client"

export const useRefetchQueries = () => {
    const client = useApolloClient()

    return () => client.refetchQueries({
        include: "active",
    })
}