import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three"
import Player from "../../components/Player";
import { useAppContext } from "../../contexts/AppProvider";
import { RigidBody } from "@react-three/rapier";
import { Gltf, PositionalAudio, useGLTF } from "@react-three/drei";
import NFTs, { NFTProps } from "../../components/NFTs";
import { CollectionCategory } from "../../types/graphql";
import { Container, DefaultProperties, Root, Text } from "@react-three/uikit";
import { useFrame } from "@react-three/fiber";
import { formatUnits } from "ethers";
import { CarFront } from "@react-three/uikit-lucide";
import { Button } from "../../components/default/button";
import { CarBuilding } from "../../models/CarBuilding";
import { useStore } from "../../hooks/store";

const positions: [number, number, number][] = [
    [5.85, 0.3, -2.8],
    [3, 0.3, -2.8],
    [-3, 0.3, -2.8],
    [-5.85, 0.3, -2.8],
]

const rotations: [number, number, number][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]

const screenPositions: [number, number, number][] = [
    [-1.235, 1.185, 2],
    [-1.775, 1.187, 2],
    [1.886, 1.188, 2],
    [1.383, 1.19, 2],
]

const displayPositions = [2.5, 2.5, 2.5, 2.5,]

const MAX_LENGTH = 5
const MAX_WIDTH = 2.5



export function Component() {
    const { setEvnPreset } = useAppContext()
    const { set } = useStore(state => ({ set: state.set }))

    useEffect(() => {
        set({ menu: false, navigator: false })
        setEvnPreset("dawn")
    }, [])

    return (
        <>
            <ambientLight intensity={1} color="#BBBBBB" />
            <directionalLight position={[-0.5, 1, 1]} color="#FFFFFF" intensity={0.6} castShadow />
            <RigidBody mass={1} type="fixed" colliders={"trimesh"}>
                <Gltf src="/models/TOYOTA Booth Design- KUWAIT - AL-SAYER.glb" position={[0, 0.2, 0]} />
                <CarBuilding scale={0.07} position={[6, -0.2, 0]} />
            </RigidBody>
            <NFTs NFT={NFT} positions={positions} rotations={rotations} category={CollectionCategory.CAR} />
            <Player initial={[0, 1, 5]} />
            <Suspense>
                <PositionalAudio url="/audios/background/TokyoDrift-TeriyakiBoyz_mucu.mp3" loop autoplay position={[0, 20, 0]} />
            </Suspense>
        </>
    )
}

export function NFT({ token, index, navigate, handleBuyClick, ...props }: NFTProps) {
    const src = token.token.animation ? token.token.animation : ""

    const outer = useRef<THREE.Group>(null!)
    const inner = useRef<THREE.Group>(null!)
    const screen = useRef<THREE.Mesh>(null!)

    useLayoutEffect(() => {
        outer.current.matrixWorld.identity()
        const box = new THREE.Box3().setFromObject(inner.current, true)

        const x = (box.max.x + box.min.x) / 2
        const y = box.min.y
        const z = (box.max.z + box.min.z) / 2

        const xLength = (box.max.x - box.min.x)
        const zLength = (box.max.z - box.min.z)
        const needRotate = xLength > zLength
        const [length, width] = needRotate ? [xLength, zLength] : [zLength, xLength]
        const rotateY = needRotate ? -Math.PI / 2 : 0

        const scale = length / width > 2 ? MAX_LENGTH / length : MAX_WIDTH / width
        outer.current.rotation.set(0, rotateY, 0)
        outer.current.scale.set(scale, scale, scale)

        if (needRotate) {
            outer.current.position.set(z * scale, -y * scale, -x * scale)
        } else {
            outer.current.position.set(-x * scale, -y * scale, -z * scale)
        }
    }, [])

    useFrame((state, delta) => {
        let camPosition = new THREE.Vector3()
        let screenPosition = new THREE.Vector3()

        state.camera.getWorldPosition(camPosition)
        screen.current.getWorldPosition(screenPosition)

        let distance = camPosition.distanceTo(screenPosition)

        const speed = delta * 4

        if (distance > 2.5) {
            screen.current.position.z = THREE.MathUtils.lerp(screen.current.position.z, screenPositions[index][2], speed)
            screen.current.rotation.x = THREE.MathUtils.lerp(screen.current.rotation.x, -0.79, speed)
            screen.current.scale.copy(screen.current.scale.lerp(({ x: 0.1, y: 0.1, z: 0.1 }), speed))
        } else {
            screen.current.position.z = THREE.MathUtils.lerp(screen.current.position.z, displayPositions[index], speed)
            screen.current.rotation.x = THREE.MathUtils.lerp(screen.current.rotation.x, 0, speed)
            screen.current.scale.copy(screen.current.scale.lerp(({ x: 0.2, y: 0.2, z: 0.2 }), speed))

        }
    })

    return (
        <group {...props}>
            <group ref={outer}>
                <group ref={inner}>
                    <Gltf src={src} />
                </group>
            </group>
            <mesh ref={screen} position={screenPositions[index]} scale={0.1} rotation={[-0.79, 0, 0]}>
                <Root width={250} height={350} backgroundColor="MidnightBlue" padding={20} flexDirection="column">
                    <DefaultProperties color="cyan" >
                        <Container flexDirection="column" borderWidth={1} borderColor="cyan" padding={10}>
                            <Container gap={8} cursor="pointer" onClick={() => navigate(`/xr/physics/token/futuristic/${token.token.id}`)}>
                                <CarFront />
                                <Text fontSize={20} fontWeight={500} marginBottom={10}>{token.token.name || `#${token.token.tokenId}`}</Text>
                            </Container>
                            {
                                token.token.attributes?.slice(0, 8).map(attr => (
                                    <Container key={attr.traitType} justifyContent="space-between" marginBottom={8}>
                                        <Text>{attr.traitType}:</Text>
                                        <Text textAlign="right" marginLeft={4} fontWeight={500}>{attr.value}</Text>
                                    </Container>
                                ))
                            }
                            <Container justifyContent="space-between">
                                <Text>Price:</Text>
                                <Button hover={{ backgroundOpacity: 0.2 }} variant="ghost" borderWidth={2} padding={8} borderColor="cyan" borderRadius={8} marginLeft={8} onClick={handleBuyClick}>
                                    <Text fontWeight={500}>{formatUnits(token.price, token.payToken.decimals)} ${token.payToken.symbol}</Text>
                                </Button>
                            </Container>
                        </Container>
                    </DefaultProperties>
                </Root>
            </mesh>
        </group>
    )
}

useGLTF.preload('/models/TOYOTA Booth Design- KUWAIT - AL-SAYER.glb')