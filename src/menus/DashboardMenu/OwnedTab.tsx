import { Container, Image, Text } from "@react-three/uikit";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "../../components/default/card";
import { Button } from "../../components/default/button";
import { useOwnedTokens, usePaymentTokens } from "../../hooks";
import { useWalletContext } from "../../contexts/WalletProvider";
import { useCallback, useMemo, useState } from "react";
import { ZeroAddress, isError, parseUnits } from "ethers";
import { RaribleItem } from "../../types/rarible";
import { colors } from "../../components/default/theme";
import { RefreshCcw, Send } from "@react-three/uikit-lucide";
import { Input } from "../../components/default/input";
import { Label } from "../../components/default/label";
import { RadioGroup, RadioGroupItem } from "../../components/default/radio-group";
import { Controller, useForm } from "react-hook-form";
import { listNFT } from "../../utils/ethers";
import { useToastContext } from "../../contexts/ToastContainer";
import LoadingScreen from "../../components/LoadingScreen";
import { getWeservUrl } from "../../utils";

type TokenType = RaribleItem & { preview: string }

export default function OwnedTab() {
    const { wallet } = useWalletContext()
    const address = wallet?.address || ZeroAddress
    const { data, mutate } = useOwnedTokens({ address })
    const [token, setToken] = useState<TokenType | null>(null)
    const { toast } = useToastContext()
    const { data: { paymentTokens } = { paymentTokens: [] } } = usePaymentTokens()
    const [loading, setLoading] = useState<boolean>(false)

    const { control, getValues, reset } = useForm({
        defaultValues: {
            price: "",
            payment: ZeroAddress
        }
    });

    const tokens = useMemo<TokenType[]>(() => {
        if (!data) return []
        return data.items.map((item: RaribleItem) => ({
            ...item,
            preview: item.meta.content.find(c => c["@type"] === "IMAGE")?.url || ""
        }))
    }, [data])

    const handleListClick = useCallback(async () => {
        if (!wallet || !token) return;
        setLoading(true)
        try {
            const values = getValues()
            if (values.payment !== ZeroAddress) {
                const paymentToken = paymentTokens.find(t => t.id === values.payment)
                if (!paymentToken) return;
                await listNFT(token, paymentToken.id, parseUnits(values.price, paymentToken.decimals), wallet.privateKey)
            }
            reset()
            await mutate({ items: data.items.filter((t: RaribleItem) => t.id !== token.id) }, { revalidate: false })
            setToken(null)
            toast({ text: "List successfully" })
        } catch (error: any) {
            console.error(error)
            if (isError(error, "CALL_EXCEPTION")) {
                toast({ text: error.shortMessage || "Error" })
            } else {
                toast({ text: "Error" })
            }
        }
        setLoading(false)
    }, [wallet, getValues, token, paymentTokens])

    return (
        <>
            <Card width="100%">
                <CardHeader>
                    <CardTitle>
                        <Text>My NFTs</Text>
                    </CardTitle>
                    <CardDescription>
                        <Text>You can list your NFT here.</Text>
                    </CardDescription>
                </CardHeader>
                <CardContent gap={8} flexDirection="column">
                    <Container justifyContent="flex-end" flexDirection="row">
                        <Button variant="secondary" height={16} paddingX={4} paddingY={4} gap={4} onClick={() => mutate()}><RefreshCcw width={8} /><Text fontSize={8}>Refresh</Text></Button>
                    </Container>
                    {
                        token ? <Container flexDirection="column">
                            <Button marginBottom={8} onClick={() => setToken(null)}><Text>Back</Text></Button>
                            <Container flexDirection="row">
                                <Container width="50%" paddingX={10}>
                                    <Image
                                        borderRadius={6}
                                        src={token.preview}
                                        width="100%"
                                        objectFit="cover"
                                        aspectRatio={1}
                                    />
                                </Container>
                                <Container width="50%" flexDirection="column" paddingX={10} >
                                    <Text fontSize={10} color={colors.mutedForeground}>{token.itemCollection.name}</Text>
                                    <Text fontWeight={500}>{token.meta.name || `#${token.tokenId}`}</Text>

                                    <Card borderWidth={1} borderColor={colors.input} backgroundColor={colors.secondary} borderRadius={4} padding={8} marginTop={12}>
                                        <Container flexDirection="column" gap={4}>
                                            <Container flexDirection="column" gap={4}>
                                                <Label><Text>Price</Text></Label>
                                                <Controller
                                                    name="price"
                                                    control={control}
                                                    render={({ field, }) => <Input placeholder="Price" {...field} onValueChange={field.onChange} />}
                                                />
                                            </Container>
                                            <Label><Text>Payment Token</Text></Label>
                                            <Controller
                                                name="payment"
                                                control={control}
                                                render={({ field, }) =>
                                                    <RadioGroup onValueChange={field.onChange}>
                                                        <RadioGroupItem value={ZeroAddress}>
                                                            <Label>
                                                                <Text>ETH</Text>
                                                            </Label>
                                                        </RadioGroupItem>
                                                        {
                                                            paymentTokens.map(t =>
                                                                <RadioGroupItem key={t.id} value={t.id}>
                                                                    <Label>
                                                                        <Text>{t.symbol}</Text>
                                                                    </Label>
                                                                </RadioGroupItem>
                                                            )
                                                        }
                                                    </RadioGroup>
                                                }
                                            />
                                        </Container>
                                        <Container flexDirection="row" flexWrap="wrap" marginTop={12}>
                                            <Container width="50%" paddingRight={4}>
                                                <Button size="sm" width="100%" gap={4} onClick={handleListClick}>
                                                    <Send width={12} />
                                                    <Text fontSize={12}>List</Text>
                                                </Button>
                                            </Container>
                                            <Container width="50%" paddingLeft={4}>
                                                <Button size="sm" width="100%" gap={4} onClick={() => { console.log(getValues()) }}>
                                                    <Send width={12} />
                                                    <Text fontSize={12}>Auction</Text>
                                                </Button>
                                            </Container>
                                        </Container>
                                    </Card>
                                </Container>
                            </Container>
                        </Container> :
                            <Container width="100%">
                                <Container flexDirection="row" flexWrap="wrap" height={200} overflow="scroll" width="100%">
                                    {
                                        tokens.map(t => (
                                            <Container key={t.id} padding={4} width="33%" flexShrink={0}>
                                                <Card flexDirection="column" gap={12} borderRadius={8} key={t.id} padding={4} borderColor={colors.border} borderWidth={1} width="100%">
                                                    <Container width="100%" borderRadius={6} backgroundColor={colors.destructiveForeground}>
                                                        <Image
                                                            borderRadius={6}
                                                            src={getWeservUrl(t.preview, { w: 300, h: 300 })}
                                                            width="100%"
                                                            objectFit="cover"
                                                            aspectRatio={1}
                                                        />
                                                    </Container>
                                                    <Container flexDirection="column">
                                                        <Text fontSize={10} color={colors.mutedForeground}>{t.itemCollection.name}</Text>
                                                        <Text fontSize={12} fontWeight={500}>{t.meta.name || `#${t.tokenId}`}</Text>
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