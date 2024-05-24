import { Container, Image, Text } from "@react-three/uikit";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "../../components/default/card";
import { Button } from "../../components/default/button";
import { useOwnedListingTokens, useRefetchQueries } from "../../hooks";
import { useWalletContext } from "../../contexts/WalletProvider";
import { useCallback, useState } from "react";
import { ZeroAddress, formatUnits, isError } from "ethers";
import { colors } from "../../components/default/theme";
import { useToastContext } from "../../contexts/ToastContainer";
import { ListingTokenEvent } from "../../types/graphql";
import { getIPFSUri, getWeservUrl } from "../../utils";
import { cancelListedNFT } from "../../utils/ethers";
import LoadingScreen from "../../components/LoadingScreen";
import { RefreshCcw } from "@react-three/uikit-lucide";


export default function OnsaleTab() {
    const { wallet } = useWalletContext()
    const address = wallet?.address || ZeroAddress
    const { data, updateQuery } = useOwnedListingTokens({ seller_eq: address, first: 50, })
    const [token, setToken] = useState<ListingTokenEvent | null>(null)
    const { toast } = useToastContext()
    const [loading, setLoading] = useState<boolean>(false)

    const refresh = useRefetchQueries()

    const handleCancelClick = useCallback(async () => {
        if (!wallet || !token) return;
        setLoading(true)
        try {
            await cancelListedNFT(token, wallet.privateKey)
            updateQuery(prev => ({ ...prev, listEventsConnection: { ...prev.listEventsConnection, edges: [...prev.listEventsConnection.edges.filter(e => e.node.id !== token.id)] } }))
            setToken(null)
            toast({ text: "Cancel successfully" })
        } catch (error: any) {
            console.error(error)
            if (isError(error, "CALL_EXCEPTION")) {
                toast({ text: error.shortMessage || "Error" })
            } else {
                toast({ text: "Error" })
            }
        }
        setLoading(false)
    }, [wallet, token, toast])

    return (
        <>
            <Card width="100%">
                <CardHeader>
                    <CardTitle>
                        <Text>My listing NFTs</Text>
                    </CardTitle>
                    <CardDescription>
                        <Text>You can cancel your NFT here.</Text>
                    </CardDescription>
                </CardHeader>
                <CardContent gap={8} flexDirection="column">
                    <Container justifyContent="flex-end" flexDirection="row">
                        <Button variant="secondary" height={16} paddingX={4} paddingY={4} gap={4} onClick={refresh}><RefreshCcw width={8} /><Text fontSize={8}>Refresh</Text></Button>
                    </Container>
                    {
                        token ? <Container flexDirection="column">
                            <Button marginBottom={8} onClick={() => setToken(null)}><Text>Back</Text></Button>
                            <Container flexDirection="row">
                                <Container width="50%" paddingX={10}>
                                    <Image
                                        borderRadius={6}
                                        src={getIPFSUri(token.token.image)}
                                        width="100%"
                                        objectFit="cover"
                                        aspectRatio={1}
                                    />
                                </Container>
                                <Container width="50%" flexDirection="column" paddingX={10} >
                                    <Text fontSize={10} color={colors.mutedForeground}>{token.collection.name}</Text>
                                    <Text fontWeight={500}>{`#${token.token.tokenId}`}</Text>
                                    <Card borderRadius={8} backgroundColor={colors.muted} padding={8}>
                                        <Text fontSize={8} color={colors.primary} fontWeight={500}>Price</Text>
                                        <Text fontWeight={600}>{formatUnits(token.price, token.payToken.decimals)} {token.payToken.symbol}</Text>
                                        <Button size="sm" marginTop={12} onClick={handleCancelClick}><Text fontSize={12} >Cancel</Text></Button>
                                    </Card>
                                </Container>
                            </Container>
                        </Container> :
                            <Container width="100%">
                                <Container flexDirection="row" flexWrap="wrap" height={200} overflow="scroll" width="100%">
                                    {
                                        data?.listEventsConnection.edges.map(({ node: t }) => (
                                            <Container key={t.id} padding={4} width="33%" flexShrink={0}>
                                                <Card flexDirection="column" gap={12} borderRadius={8} padding={4} borderColor={colors.border} borderWidth={1} width="100%" >
                                                    <Container width="100%" borderRadius={6} backgroundColor={colors.destructiveForeground}>
                                                        <Image
                                                            borderRadius={6}
                                                            src={getWeservUrl(t.token.image, { w: 300, h: 300 })}
                                                            width="100%"
                                                            objectFit="cover"
                                                            aspectRatio={1}
                                                        />
                                                    </Container>
                                                    <Container flexDirection="column">
                                                        <Text fontSize={10} color={colors.mutedForeground}>{t.collection.name}</Text>
                                                        <Text fontSize={12} fontWeight={500}>{`#${t.token.tokenId}`}</Text>
                                                        <Button height={10} paddingX={4} paddingY={8} marginTop={6} onClick={() => setToken(t)}>
                                                            <Text fontSize={8}>View</Text>
                                                        </Button>
                                                    </Container>
                                                </Card>
                                            </Container>
                                        ))
                                    }
                                </Container>
                            </Container>
                    }
                </CardContent>
            </Card>
            {
                loading && <LoadingScreen />
            }
        </>
    )
}