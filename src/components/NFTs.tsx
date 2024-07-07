import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three"
import { isError } from "ethers"
import { useListedTokens } from "../hooks";
import { CollectionCategory, ListEventStatus, ListingTokenEvent } from "../types/graphql";
import { GroupProps, Matrix4, useThree } from "@react-three/fiber";
import { DragControls } from "@react-three/drei";
import { Root, Text } from "@react-three/uikit";
import { Button } from "../components/default/button";
import { Ban, Check } from "@react-three/uikit-lucide";
import { useWalletContext } from "../contexts/WalletProvider";
import { useToastContext } from "../contexts/ToastContainer";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/default/card";
import { buyNFT, erc20Approve } from "../utils/ethers";
import Navigator from "../components/Navigator";
import { useApolloClient } from "@apollo/client";
import LoadingScreen from "../components/LoadingScreen";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { paths } from "../configs/router";

const position = new THREE.Vector3()
const direction = new THREE.Vector3()

const HIDE_POSITION = new THREE.Vector3(0, -10, 0)

const TEST = false

export type NFTProps = GroupProps & {
    token: ListingTokenEvent, cart: ListingTokenEvent[],
    addToCart: (t: ListingTokenEvent) => void,
    removeFromCart: (t: ListingTokenEvent) => void,
    handleBuyClick: () => void,
    navigate: NavigateFunction,
    index: number,
}

export default function NFTs({ NFT, positions, rotations, category }: {
    NFT: (_: NFTProps) => JSX.Element,
    positions: [number, number, number][],
    rotations: [number, number, number][],
    category: CollectionCategory
}) {
    const PAGE_LIMIT = positions.length

    const { wallet } = useWalletContext()
    const [page, setPage] = useState<number>(1)
    const now = useMemo(() => {
        return new Date()
    }, [])
    const { data, updateQuery } = useListedTokens({ after: page === 1 ? undefined : ((page - 1) * PAGE_LIMIT).toString(), first: PAGE_LIMIT, category_eq: category, seller_not_eq: wallet?.address, endTime_gte: now })
    const { cart, addToCart: add, removeFromCart: remove, currentIndex, privateKeys } = useWalletContext()
    const { toast } = useToastContext()
    const [buyingToken, setBuyingToken] = useState<ListingTokenEvent | null>(null)
    const camera = useThree(state => state.camera)
    const dialogRef = useRef<THREE.Mesh>(null)
    const client = useApolloClient();
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!camera || !dialogRef.current) return;
        if (!!buyingToken) {
            camera.getWorldPosition(position)
            camera.getWorldDirection(direction)
            dialogRef.current.position.copy(position).add(direction.multiplyScalar(1))
            dialogRef.current.rotation.copy(camera.rotation)
        } else {
            dialogRef.current.position.copy(HIDE_POSITION)
        }
    }, [buyingToken, camera, dialogRef.current])

    const addToCart = useCallback((token: ListingTokenEvent) => {
        add(token)
        toast({ text: `Add ${token.collection.name}#${token.token.tokenId} to cart!` })
    }, [add, cart])

    const removeFromCart = useCallback((token: ListingTokenEvent) => {
        remove(token.token.id)
        toast({ text: `Remove ${token.collection.name} #${token.token.tokenId} from cart!` })
    }, [remove])

    const handleBuyClick = useCallback((token: ListingTokenEvent) => {
        if (buyingToken) setBuyingToken(null);
        else {
            if (token.status === ListEventStatus.AUCTIONING) {
                toast({ text: "Please join auction here", variant: "info" })
                navigate(paths.nft(token.token.id))
                return;
            } else {
                setBuyingToken(token)
            }
        }
    }, [buyingToken, setBuyingToken])

    const buy = useCallback(async () => {
        setLoading(true)
        if (currentIndex < 0 || !buyingToken) return;
        try {
            await erc20Approve(buyingToken.payToken.id, buyingToken.price, privateKeys[currentIndex])
            await buyNFT(buyingToken, privateKeys[currentIndex])
            toast({ text: "Buy successfully", variant: "success" })
            updateQuery(prev => ({ ...prev, listEventsConnection: { ...prev.listEventsConnection, edges: [...prev.listEventsConnection.edges.filter(e => e.node.id !== buyingToken.id)] } }))
            setBuyingToken(null)
        } catch (error: any) {
            console.error(error)
            if (isError(error, "CALL_EXCEPTION")) {
                toast({ text: error.shortMessage || "Error", variant: "error" })
            } else {
                toast({ text: "Error", variant: "error" })
            }
            await client.refetchQueries({
                include: ["active"],
            });
        }
        setLoading(false)
    }, [buyingToken, privateKeys, currentIndex, client])

    if (!data) return <></>

    return (
        <>
            {
                data.listEventsConnection.edges.map(({ node: d }, index) =>
                    <Suspense key={d.id}>
                        {
                            TEST ?
                                <DragControls
                                    onDrag={(localMatrix: Matrix4, _: Matrix4, worldMatrix: Matrix4, __: Matrix4) => {
                                        console.info(localMatrix, worldMatrix,)
                                    }}
                                >
                                    <NFT
                                        token={d}
                                        position={positions[index] || [0, 0, 0]}
                                        rotation={rotations[index] || [0, 0, 0]}
                                        cart={cart}
                                        addToCart={addToCart}
                                        removeFromCart={removeFromCart}
                                        handleBuyClick={() => handleBuyClick(d)}
                                        navigate={navigate}
                                        index={index}
                                    />
                                </DragControls> :
                                <NFT
                                    token={d}
                                    position={positions[index] || [0, 0, 0]}
                                    rotation={rotations[index] || [0, 0, 0]}
                                    cart={cart}
                                    addToCart={addToCart}
                                    removeFromCart={removeFromCart}
                                    handleBuyClick={() => handleBuyClick(d)}
                                    navigate={navigate}
                                    index={index}
                                />
                        }
                    </Suspense>
                )
            }
            {
                <mesh ref={dialogRef} visible={!!buyingToken} scale={0.3}>
                    <Root>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Text>Confirm buy NFT</Text>
                                </CardTitle>
                                <CardDescription>
                                    <Text>Your transaction will be submitted to blockchain.</Text>
                                </CardDescription>
                            </CardHeader>

                            <CardFooter flexDirection="column" gap={4}>
                                {
                                    currentIndex >= 0 ?
                                        <Button gap={4} flexDirection="row-reverse" width="100%" onClick={buy} disabled={loading}>
                                            <Text>Buy NFT</Text>
                                            <Check height={16} width={16} />
                                        </Button> :
                                        <Button gap={4} flexDirection="row-reverse" width="100%" disabled onClick={() => toast({ text: "Open menu to connect wallet", variant: "info" })}>
                                            <Text>Connect Wallet</Text>
                                            <Ban height={16} width={16} />
                                        </Button>
                                }
                                <Button gap={4} variant="outline" width="100%" onClick={() => setBuyingToken(null)}>
                                    <Ban height={16} width={16} />
                                    <Text>Cancel</Text>
                                </Button>
                            </CardFooter>
                        </Card>
                    </Root>
                </mesh>
            }
            <Navigator page={page} setPage={setPage} maxPage={Math.ceil(data.listEventsConnection.totalCount / PAGE_LIMIT)}>
                <Text>Total listing NFTs: {data.listEventsConnection.totalCount.toString()}</Text>
            </Navigator>
            {
                loading &&
                <LoadingScreen />
            }
        </>
    )
}