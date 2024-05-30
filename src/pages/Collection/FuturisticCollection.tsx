import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three"
import { formatUnits } from "ethers"
import Player from "../../components/Player";
import { useAppContext } from "../../contexts/AppProvider";
import { RigidBody } from "@react-three/rapier";
import { ScifiGallery } from "../../models/ScifiGallery";
import { CollectionCategory, ListingTokenEvent } from "../../types/graphql";
import { RatioImage } from "../../components/override/RatioImage";
import { GroupProps } from "@react-three/fiber";
import { Container, GlassMaterial, MetalMaterial, Root, Text } from "@react-three/uikit";
import { Button } from "../../components/default/button";
import { Eye, Heart, PackageMinus, PackagePlus, ShoppingCart } from "@react-three/uikit-lucide";
import { getIPFSUri } from "../../utils";
import { NavigateFunction } from "react-router-dom";
import NFTs from "../../components/NFTs";
import { PositionalAudio } from "@react-three/drei";

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
            <NFTs NFT={NFT} positions={positions} rotations={rotations} category={CollectionCategory.FUTURISTIC} />
            <Suspense>
                <PositionalAudio url="/audios/background/Futuristic Music - Sci-fi City.ogg" loop autoplay position={[0, 15, 0]} />
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