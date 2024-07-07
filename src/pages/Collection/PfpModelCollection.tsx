import { Suspense, useCallback, useEffect, useMemo } from "react";
import { formatUnits } from "ethers"
import Player from "../../components/Player";
import { useAppContext } from "../../contexts/AppProvider";
import { RigidBody } from "@react-three/rapier";
import { CollectionCategory, ListEventStatus, ListingTokenEvent } from "../../types/graphql";
import { GroupProps } from "@react-three/fiber";
import { Float, PositionalAudio, useGLTF } from "@react-three/drei";
import { Container, MetalMaterial, Root, Text } from "@react-three/uikit";
import { Button } from "../../components/default/button";
import { Eye, Gavel, PackageMinus, PackagePlus, ShoppingCart } from "@react-three/uikit-lucide";
import { Lab } from "../../models/Lab";
import { last } from "lodash";
import { NavigateFunction } from "react-router-dom";
import NFTs from "../../components/NFTs";
import { useStore } from "../../hooks/store";

const positions: [number, number, number][] = [
    [-3.5, 1, 0.14],
    [3.1, 1, 0.14],
    [-3.5, 1, -7.36],
    [3.1, 1, -7.36],
    [-3.5, 1, -14.86],
    [3.1, 1, -14.86],
    [-3.5, 1, -22.36],
    [3.1, 1, -22.36],
    [-3.5, 1, -29.86],
    [3.1, 1, -29.86],
]

const rotations: [number, number, number][] = [
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
]

export function Component() {
    const { setEvnPreset } = useAppContext()
    const { set } = useStore(state => ({ set: state.set }))

    useEffect(() => {
        setEvnPreset("sunset")
        set({ menu: false, navigator: false })
    }, [])

    return (
        <>
            <ambientLight intensity={1} color="#BBBBBB" />
            <directionalLight position={[-0.5, 1, 1]} color="#FFFFFF" intensity={0.6} castShadow />
            <RigidBody mass={1} type="fixed" colliders={"trimesh"} scale={0.05} position={[0, 0.1, 0]} rotation={[0.015, 0.01, 0]}>
                <Lab />
            </RigidBody>
            <Player initial={[0, 4, 1]} />
            <NFTs NFT={NFT} positions={positions} rotations={rotations} category={CollectionCategory.PFP_MODEL} />
            <Suspense>
                <PositionalAudio url="/audios/background/Space - Cinematic Ambient Background.mp3" loop autoplay position={[0, 5, 0]} />
            </Suspense>
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
        navigate: NavigateFunction,
    }) {
    const animation = token.token.animation?.startsWith("https://turnon.meebits.app/viewer/") ? "https://livingpfp.meebits.app/api/meebits?type=3d&token_id=" + last(token.token.animation.split("/")) : ""
    const inCart = useMemo(() => cart.some(t => t.token.id === token.token.id), [cart])

    const add = useCallback(() => {
        addToCart(token)
    }, [addToCart])

    const remove = useCallback(() => {
        removeFromCart(token)
    }, [removeFromCart])

    const gltf = useGLTF(animation)

    if (!animation) return <></>

    return (
        <group {...props} >
            <Float
                rotationIntensity={0.5}
                floatIntensity={2}
            >
                <primitive object={gltf.scene} />
            </Float>
            <mesh position={[0, 3.25, 1]}>
                <Root>
                    <Container borderRadius={8} backgroundColor="cyan" padding={8}>
                        <Text>{token.token.name || `${token.collection.name} #${token.token.tokenId}`}</Text>
                    </Container>
                </Root>
            </mesh>
            <mesh position={[0, -0.4, 0.9]} scale={0.5}>
                <Root>
                    <Container gap={8}>
                        <Container gap={6}>
                            <Button
                                backgroundColor={'cyan'}
                                panelMaterialClass={MetalMaterial}
                                borderBend={0.5} borderWidth={4}
                                borderOpacity={0}
                                gap={6}
                                paddingX={6}
                                onClick={handleBuyClick}
                                flexDirection="row-reverse"
                            >
                                <Text color="white" fontSize={19}>{formatUnits(token.price, token.payToken.decimals)} {token.payToken.symbol}</Text>
                                {
                                    token.status === ListEventStatus.AUCTIONING ?
                                        <Gavel color="white" /> :
                                        <ShoppingCart color="white" />
                                }
                            </Button>
                            {
                                inCart
                                    ? <Button
                                        backgroundColor={'cyan'}
                                        panelMaterialClass={MetalMaterial}
                                        borderBend={0.5} borderWidth={4}
                                        borderOpacity={0}
                                        gap={6}
                                        paddingX={6}
                                        onClick={remove}
                                        flexDirection="row-reverse"
                                    >
                                        <PackageMinus color="white" />
                                    </Button>
                                    :
                                    <Button
                                        backgroundColor={'cyan'}
                                        panelMaterialClass={MetalMaterial}
                                        borderBend={0.5} borderWidth={4}
                                        borderOpacity={0}
                                        gap={6}
                                        paddingX={6}
                                        onClick={add}
                                        flexDirection="row-reverse"
                                    >
                                        <PackagePlus color="white" />
                                    </Button>
                            }
                        </Container>
                        <Container flexDirection="row" gap={3}>
                            <Button backgroundColor={'cyan'} panelMaterialClass={MetalMaterial} borderBend={0.5} borderWidth={4} borderOpacity={0} size="icon" onClick={() => navigate(`/xr/physics/token/futuristic/${token.token.id}`)}>
                                <Eye color="white" />
                            </Button>
                        </Container>
                    </Container>
                </Root>
            </mesh>
        </group>
    )
}