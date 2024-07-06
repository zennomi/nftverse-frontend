import { Container, Image, Text } from "@react-three/uikit";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "../../components/default/card";
import { Button } from "../../components/default/button";
import { useOwnedListingTokens, useRefetchQueries } from "../../hooks";
import { useWalletContext } from "../../contexts/WalletProvider";
import { useCallback, useMemo, useState } from "react";
import { ZeroAddress, formatUnits, isError } from "ethers";
import { colors } from "../../components/default/theme";
import { useToastContext } from "../../contexts/ToastContainer";
import { ListingTokenEvent } from "../../types/graphql";
import { getIPFSUri, getWeservUrl } from "../../utils";
import { cancelListedNFT, endAuction } from "../../utils/ethers";
import LoadingScreen from "../../components/LoadingScreen";
import { RefreshCcw } from "@react-three/uikit-lucide";
import { Badge } from "../../components/default/badge";
import { useNavigate } from "react-router-dom";


export default function OnsaleTab() {
    const { wallet } = useWalletContext()
    const address = wallet?.address || ZeroAddress
    const { data, updateQuery } = useOwnedListingTokens({ seller_eq: address, first: 10, })
    const [token, setToken] = useState<ListingTokenEvent | null>(null)
    const { toast } = useToastContext()
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const refresh = useRefetchQueries()

    const status = useMemo<number>(() => {
        // 0: nothing, 1: can cancel, 2: can not cancel and end, 3: can end 
        if (!token) return 0
        if (!token.auctionData) return 1
        if (token.bidderEvents.length === 0) return 1
        if (new Date(token.auctionData.endTime) <= new Date()) return 2
        return 3
    }, [token])

    const handleCancelClick = useCallback(async () => {
        if (!wallet || !token) return;
        setLoading(true)
        try {
            await cancelListedNFT(token, wallet.privateKey)
            updateQuery(prev => ({ ...prev, listEventsConnection: { ...prev.listEventsConnection, edges: [...prev.listEventsConnection.edges.filter(e => e.node.id !== token.id)] } }))
            setToken(null)
            toast({ text: "Cancel successfully", variant: "success" })
        } catch (error: any) {
            console.error(error)
            if (isError(error, "CALL_EXCEPTION")) {
                toast({ text: error.shortMessage || "Error", variant: "error" })
            } else {
                toast({ text: "Error", variant: "error" })
            }
        }
        setLoading(false)
    }, [wallet, token, toast])

    const handleEndAuctionClick = useCallback(async () => {
        if (!wallet || !token) return;
        setLoading(true)
        try {
            await endAuction(token, wallet.privateKey)
            updateQuery(prev => ({ ...prev, listEventsConnection: { ...prev.listEventsConnection, edges: [...prev.listEventsConnection.edges.filter(e => e.node.id !== token.id)] } }))
            setToken(null)
            toast({ text: "End auction successfully", variant: "success" })
        } catch (error: any) {
            console.error(error)
            if (isError(error, "CALL_EXCEPTION")) {
                toast({ text: error.shortMessage || "Error", variant: "error" })
            } else {
                toast({ text: "Error", variant: "error" })
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
                                        <Text fontSize={8} color={colors.primary} fontWeight={500}>{token.auctionData ? "Current price" : "Price"}</Text>
                                        <Text fontWeight={600}>{formatUnits(token.price, token.payToken.decimals)} {token.payToken.symbol}</Text>
                                        {
                                            token.auctionData &&
                                            <>
                                                <Text fontSize={8}>{token.bidderEvents.length.toString()} users joined auction</Text>
                                                <Text fontSize={8}>End at {(new Date(token.auctionData.endTime)).toLocaleString()}</Text>
                                            </>
                                        }
                                        {
                                            status == 1 ?
                                                <Button size="sm" marginTop={12} onClick={handleCancelClick} disabled={loading}>
                                                    <Text fontSize={12} >{token.auctionData ? "Cancel auction" : "Cancel listing"}</Text>
                                                </Button>
                                                : status == 2 &&
                                                <Button size="sm" marginTop={12} onClick={handleEndAuctionClick} disabled={loading}><Text fontSize={12} >End auction</Text></Button>
                                        }
                                    </Card>
                                    <Button marginTop={12} size="sm" onClick={() => navigate(`/xr/physics/token/futuristic/${token.token.id}`)}>
                                        <Text fontSize={12}>Show in NFT room</Text>
                                    </Button>
                                </Container>
                            </Container>
                        </Container> :
                            <Container width="100%">
                                <Container flexDirection="row" flexWrap="wrap" height={200} overflow="scroll" width="100%">
                                    {
                                        data?.listEventsConnection.edges.map(({ node: t }) => (
                                            <Container key={t.id} padding={4} width="33%" flexShrink={0}>
                                                <Card flexDirection="column" gap={12} borderRadius={8} padding={4} borderColor={colors.border} borderWidth={1} width="100%" >
                                                    <Badge positionType="absolute" zIndexOffset={100} borderWidth={0} positionTop={8} positionRight={8}>
                                                        <Text fontSize={8}>{t.auctionData ? "AUCTION" : "LIST"}</Text>
                                                    </Badge>
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
                loading && <LoadingScreen distanceToCamera={0.5} />
            }
        </>
    )
}