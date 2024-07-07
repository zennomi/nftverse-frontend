import { Container, Text } from "@react-three/uikit";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "../../components/default/card";
import { Button } from "../../components/default/button";
import { useRefetchQueries, useRelatedOffers } from "../../hooks";
import { useWalletContext } from "../../contexts/WalletProvider";
import { useCallback, useState } from "react";
import { formatUnits, isError } from "ethers";
import { RefreshCcw } from "@react-three/uikit-lucide";
import { useToastContext } from "../../contexts/ToastContainer";
import LoadingScreen from "../../components/LoadingScreen";
import { colors } from "../../components/default/theme";
import { ListEventStatus, OfferEvent } from "../../types/graphql";
import { acceptOffer, cancelOffer } from "../../utils/ethers";

export default function OfferTab() {
    const { wallet } = useWalletContext()

    const { toast } = useToastContext()
    const { data, updateQuery } = useRelatedOffers({ user: wallet?.address })
    const offers = data?.offerEventsConnection.edges.map(edge => edge.node) || []
    const [loading, setLoading] = useState<boolean>(false)

    const refresh = useRefetchQueries()

    const handleClick = useCallback(async (offerEvent: OfferEvent, action: "cancel" | "accept") => {
        if (!wallet) return;
        setLoading(true)
        try {
            switch (action) {
                case "cancel":
                    await cancelOffer(offerEvent.listEvent.token.id, wallet.privateKey)
                    toast({ text: "Cancel offer auction successfully", variant: "success" })
                    break;
                case "accept":
                    await acceptOffer(offerEvent.listEvent.token.id, offerEvent.offerer, wallet.privateKey)
                    toast({ text: "Accept offer auction successfully", variant: "success" })
                    break;
                default:
                    break;
            }
            await updateQuery(prev => ({ ...prev, offerEventsConnection: { ...prev.offerEventsConnection, edges: prev.offerEventsConnection.edges.filter(e => e.node.id !== offerEvent.id) } }))
        } catch (error: any) {
            console.error(error)
            if (isError(error, "CALL_EXCEPTION")) {
                toast({ text: error.shortMessage || "Error", variant: "error" })
            } else {
                toast({ text: "Error", variant: "error" })
            }
        }
        setLoading(false)
    }, [wallet,])

    if (!wallet) return <></>

    return (
        <>
            <Card width="100%">
                <CardHeader>
                    <CardTitle>
                        <Text>Your related offers</Text>
                    </CardTitle>
                    <CardDescription>
                        <Text>You can accept, cancel your offer here.</Text>
                    </CardDescription>
                </CardHeader>
                <CardContent gap={8} flexDirection="column">
                    <Container justifyContent="flex-end" flexDirection="row">
                        <Button variant="secondary" height={16} paddingX={4} paddingY={4} gap={4} onClick={refresh}><RefreshCcw width={8} /><Text fontSize={8}>Refresh</Text></Button>
                    </Container>

                    <Container width="100%">
                        <Container flexDirection="column" height={200} overflow="scroll" width="100%" gapRow={8} paddingRight={16} scrollbarBorderRadius={4} scrollbarColor={colors.accent}>
                            {
                                offers.map(offer => {
                                    const isMyOffer = offer.offerer === wallet.address
                                    return (
                                        <Container flexDirection="column" key={offer.id} padding={8} flexShrink={0} backgroundColor={colors.accent} borderRadius={8}>
                                            <Text fontWeight={500}>NFT: {offer.listEvent.token.name || offer.listEvent.token.id}</Text>
                                            <Container alignItems="baseline" justifyContent="space-between">
                                                <Text>Price: {formatUnits(offer.price, offer.listEvent.payToken.decimals)} {offer.listEvent.payToken.symbol}</Text>
                                                <Text fontSize={12} opacity={0.6}>{new Date(offer.timestamp).toLocaleString()}</Text>
                                            </Container>
                                            <Text fontSize={14}>{isMyOffer ? `To: ${offer.listEvent.seller}` : `From: ${offer.offerer}`}</Text>
                                            {
                                                isMyOffer && offer.listEvent.status === ListEventStatus.SOLD &&
                                                <Text fontSize={12} color="red">*This offer was expired</Text>
                                            }
                                            {
                                                isMyOffer ?
                                                    <Button variant="outline" marginTop={8} onClick={() => handleClick(offer, "cancel")}><Text>Cancel</Text></Button> :
                                                    <Button variant="outline" marginTop={8} onClick={() => handleClick(offer, "accept")}><Text>Accept</Text></Button>
                                            }
                                        </Container>
                                    )
                                })
                            }
                        </Container>
                    </Container>
                </CardContent>
            </Card>
            {
                loading && <LoadingScreen distanceToCamera={0.5} />
            }
        </>
    )
}