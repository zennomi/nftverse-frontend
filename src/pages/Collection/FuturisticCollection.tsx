import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three"
import { formatUnits, isError } from "ethers"
import Player from "../../components/Player";
import { useAppContext } from "../../contexts/AppProvider";
import { RigidBody } from "@react-three/rapier";
import { ScifiGallery } from "../../models/ScifiGallery";
import { useListedTokens } from "../../hooks";
import { CollectionCategory, ListingTokenEvent } from "../../types/graphql";
import { RatioImage } from "../../components/override/RatioImage";
import { GroupProps, Matrix4, useThree } from "@react-three/fiber";
import { DragControls } from "@react-three/drei";
import { Container, GlassMaterial, MetalMaterial, Root, Text } from "@react-three/uikit";
import { Button } from "../../components/default/button";
import { Ban, Check, Eye, Heart, PackageMinus, PackagePlus, ShoppingCart } from "@react-three/uikit-lucide";
import { useWalletContext } from "../../contexts/WalletProvider";
import { useToastContext } from "../../contexts/ToastContainer";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/default/card";
import { buyNFT, erc20Approve } from "../../utils/ethers";
import { getIPFSUri } from "../../utils";
import Navigator from "../../components/Navigator";
import { useApolloClient } from "@apollo/client";
import LoadingScreen from "../../components/LoadingScreen";
import { NavigateFunction, useNavigate } from "react-router-dom";

const position = new THREE.Vector3()
const direction = new THREE.Vector3()

const HIDE_POSITION = new THREE.Vector3(0, -10, 0)

const positions: [number, number, number][] = [
    [0, 2.6, -8.31],
    [-10.26, 2.6, -10.26],
    [10.26, 2.6, -10.26],
    [-13.06, 2.6, -16.61],
    [0, 2.6, -19.5],
    [13.06, 2.6, -16.57],
]

const rotations: [number, number, number][] = [
    [0, 0, 0],
    [0, -Math.PI / 6, 0],
    [0, Math.PI / 6, 0],
    [0, -2 * Math.PI / 3, 0],
    [0, Math.PI, 0],
    [0, 2 * Math.PI / 3, 0],
]

const PAGE_LIMIT = positions.length

const TEST = false

export function Component() {
    const { setEvnPreset } = useAppContext()

    useEffect(() => {
        setEvnPreset("dawn")
    }, [])

    return (
        <>
            <ambientLight intensity={1} color="#BBBBBB" />
            <directionalLight position={[-0.5, 1, 1]} color="#FFFFFF" intensity={0.6} castShadow />
            <RigidBody mass={1} type="fixed" colliders={"trimesh"}>
                <ScifiGallery position={[0, 0, 0]} scale={50} />
            </RigidBody>
            <Player initial={[0, 4, 1]} />
            <NFTs />
        </>
    )
}

export function NFTs() {
    const { wallet } = useWalletContext()
    const [page, setPage] = useState<number>(1)
    const { data, updateQuery } = useListedTokens({ after: page === 1 ? undefined : ((page - 1) * PAGE_LIMIT - 1).toString(), first: PAGE_LIMIT, category_eq: CollectionCategory.FUTURISTIC, seller_not_eq: wallet?.address })
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
        buyingToken ? setBuyingToken(null) : setBuyingToken(token)
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
                                        <Button gap={4} flexDirection="row-reverse" width="100%" onClick={buy}>
                                            <Text>Buy NFT</Text>
                                            <Check height={16} width={16} />
                                        </Button> :
                                        <Button gap={4} flexDirection="row-reverse" width="100%" disabled>
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

export function NFT({
    token, cart, addToCart, removeFromCart, handleBuyClick, navigate, ...props }:
    GroupProps & {
        token: ListingTokenEvent, cart: ListingTokenEvent[],
        addToCart: (t: ListingTokenEvent) => void,
        removeFromCart: (t: ListingTokenEvent) => void,
        handleBuyClick: () => void,
        navigate: NavigateFunction
    }) {
    const image = getIPFSUri(token.token.image)
    const imageRef = useRef<THREE.Mesh>(null)
    const [width, setWidth] = useState<number>(1)

    const inCart = useMemo(() => cart.some(t => t.token.id === token.token.id), [cart])

    const add = useCallback(() => {
        addToCart(token)
    }, [addToCart])

    const remove = useCallback(() => {
        removeFromCart(token)
    }, [removeFromCart])

    useEffect(() => {
        if (imageRef.current) {
            setWidth(imageRef.current.scale.x)
        }
    }, [imageRef,])

    return (
        <group {...props}>
            <mesh position={[0, 0, -0.026]}>
                <boxGeometry args={[width * 1.1, 3 * 1.1, 0.05]} />
                <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} polygonOffset={true} polygonOffsetFactor={1} />
            </mesh>
            <RatioImage
                ref={imageRef}
                url={image}
                toneMapped
                scale={3}
                depth={0}
            />
            <mesh position={[0, 1.3, 0.1]} scale={0.8}>
                <Root>
                    <Container backgroundColor="black" panelMaterialClass={GlassMaterial} borderRadius={6} padding={6}>
                        <Text color="white">{token.collection.name} #{token.token.tokenId}</Text>
                    </Container>
                </Root>
            </mesh>
            <mesh position={[0, -1.3, 0.01]} scale={0.5}>
                <Root flexDirection="row" justifyContent="space-between" paddingX={20} gap={3} width={width * 200}>
                    <Container gap={6}>
                        <Button
                            backgroundColor={'crimson'}
                            panelMaterialClass={MetalMaterial}
                            borderBend={0.5} borderWidth={4}
                            borderOpacity={0}
                            gap={6}
                            paddingX={6}
                            onClick={handleBuyClick}
                            flexDirection="row-reverse"
                        >
                            <Text color="pink" fontSize={19}>{formatUnits(token.price, token.payToken.decimals)} {token.payToken.symbol}</Text>
                            <ShoppingCart color="pink" />
                        </Button>
                        {
                            inCart
                                ? <Button
                                    backgroundColor={'crimson'}
                                    panelMaterialClass={MetalMaterial}
                                    borderBend={0.5} borderWidth={4}
                                    borderOpacity={0}
                                    gap={6}
                                    paddingX={6}
                                    onClick={remove}
                                    flexDirection="row-reverse"
                                >
                                    <PackageMinus color="pink" />
                                </Button>
                                :
                                <Button
                                    backgroundColor={'crimson'}
                                    panelMaterialClass={MetalMaterial}
                                    borderBend={0.5} borderWidth={4}
                                    borderOpacity={0}
                                    gap={6}
                                    paddingX={6}
                                    onClick={add}
                                    flexDirection="row-reverse"
                                >
                                    <PackagePlus color="pink" />
                                </Button>
                        }
                    </Container>
                    <Container flexDirection="row" gap={3}>
                        <Button backgroundColor={'crimson'} panelMaterialClass={MetalMaterial} borderBend={0.5} borderWidth={4} borderOpacity={0} size="icon" onClick={() => navigate(`/xr/physics/token/futuristic/${token.token.id}`)}>
                            <Eye color="pink" />
                        </Button>
                        <Button backgroundColor={'crimson'} panelMaterialClass={MetalMaterial} borderBend={0.5} borderWidth={4} borderOpacity={0} size="icon">
                            <Heart color="pink" />
                        </Button>
                    </Container>
                </Root>
            </mesh>
        </group>
    )
}