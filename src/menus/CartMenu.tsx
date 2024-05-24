import { Container, Image, Text } from "@react-three/uikit";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "../components/default/pagination";
import { useWalletContext } from "../contexts/WalletProvider";
import { colors } from "../components/default/theme";
import { useMemo, useState } from "react";
import { Card } from "../components/default/card";
import { Button } from "../components/default/button";
import { getWeservUrl } from "../utils";
import { formatUnits } from "ethers";
import { groupBy, sum } from "lodash";

const PAGE_LIMIT = 3

export function CartMenu() {
    const { cart, removeFromCart } = useWalletContext()
    const [page, setPage] = useState<number>(1)
    const checkout = useMemo(() => {
        const prices = Object.entries(groupBy(cart, "payToken.id")).map(([id, events]) => ({
            id,
            payToken: events[0].payToken,
            total: sum(events.map(e => BigInt(e.price))),
            count: events.length
        }))

        return { prices }
    }, [cart])

    if (cart.length === 0) return <Card padding={16}><Text>Your cart is empty</Text></Card>
    const offset = (page - 1) * PAGE_LIMIT
    const maxPage = Math.ceil(cart.length / PAGE_LIMIT)

    return (
        <Container flexDirection="row" gap={8}>
            <Container
                marginTop={16}
                overflow="scroll"
                flexGrow={1}
                flexBasis={0}
                padding={16}
                lg={{ paddingX: 32 }}
                flexDirection="column"
                backgroundColor="white"
                borderRadius={6}
                width={500}
            >
                <Container paddingBottom={16}>
                    <Text fontWeight={700}>Total:</Text><Text>{cart.length.toString()} NFT(s)</Text>
                </Container>
                <Container flexDirection="row" overflow="scroll" justifyContent="space-around" paddingBottom={16}>
                    {
                        cart.slice(offset, offset + PAGE_LIMIT).map(token => {
                            const image = getWeservUrl(token.token.image, { w: 300, h: 300 })

                            return (
                                <Container key={token.id} flexShrink={0} flexDirection="column" gap={12} borderRadius={6} borderColor={colors.mutedForeground} borderWidth={1} padding={6}>
                                    <Image
                                        borderRadius={6}
                                        src={image}
                                        width={100}
                                        objectFit="cover"
                                        aspectRatio={1}
                                    />
                                    <Container flexDirection="column" gap={4}>
                                        <Text fontWeight="medium" lineHeight="100%">
                                            {token.collection.name} #{token.token.tokenId}
                                        </Text>
                                        <Container gap={4}>
                                            <Text fontSize={12} lineHeight={16} color={colors.mutedForeground}>
                                                {formatUnits(token.price, token.payToken.decimals)} {token.payToken.symbol}
                                            </Text>
                                            <Button variant="secondary" padding={4} height={16} onClick={() => removeFromCart(token.token.id)}><Text fontSize={8}>Remove</Text></Button>
                                        </Container>
                                    </Container>
                                </Container>
                            )
                        })
                    }
                </Container>
                <Pagination>
                    <PaginationContent>
                        {
                            page > 1 &&
                            <PaginationItem onClick={() => setPage(page - 1)}>
                                <PaginationPrevious />
                            </PaginationItem>
                        }
                        {
                            [...Array(maxPage)].map((_, index) => (
                                <PaginationItem key={index} onClick={() => setPage(index + 1)}>
                                    <PaginationLink isActive={index + 1 === page}>
                                        <Text>{(index + 1).toString()}</Text>
                                    </PaginationLink>
                                </PaginationItem>
                            ))
                        }
                        {
                            page < maxPage &&
                            <PaginationItem onClick={() => setPage(page + 1)} >
                                <PaginationNext />
                            </PaginationItem>
                        }
                    </PaginationContent>
                </Pagination>
            </Container>
            <Container
                marginTop={16}
                overflow="scroll"
                flexGrow={1}
                flexBasis={0}
                padding={16}
                lg={{ paddingX: 32 }}
                flexDirection="column"
                backgroundColor="white"
                borderRadius={6}
                width={200}
                gap={16}
            >
                <Container paddingBottom={16}>
                    <Text fontWeight={700}>Checkout</Text>
                </Container>
                <Container>
                    {
                        checkout.prices.map(price => (
                            <Container key={price.id}>
                                <Container width="30%">
                                    <Text fontWeight={600}>{price.payToken.symbol}:</Text>
                                </Container>
                                <Container width="70%">
                                    <Text>{formatUnits(price.total, price.payToken.decimals)}</Text>
                                </Container>
                            </Container>
                        ))
                    }
                </Container>
                <Button><Text>Confirm</Text></Button>
            </Container>
        </Container>
    )
}