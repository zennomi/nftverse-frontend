import { Suspense, useEffect, useRef } from "react"
import { useAppContext } from "../../contexts/AppProvider"
import Player from "../../components/Player"
import { RigidBody } from "@react-three/rapier"
import { ScifiLab } from "../../models/ScifiLab"
import { useParams } from "react-router-dom"
import { Image, useGLTF } from "@react-three/drei"
import { last } from "lodash"
import { useFrame } from "@react-three/fiber"
import { useToken } from "../../hooks"
import * as THREE from "three"
import { getIPFSUri } from "../../utils"
import { Container, DefaultProperties, Root, Text } from "@react-three/uikit"
import { Boxes } from "@react-three/uikit-lucide"
import { Card } from "../../components/default/card"

// export async function loader({ params }: { params: { id: string } }) {
//     const { id } = params;
//     const { data } = await client.query({
//         query: GET_TOKEN_BY_ID,
//         variables: {
//             id
//         }
//     })

//     return data.tokenById
// }

export function Component() {
    const { setEvnPreset } = useAppContext()

    useEffect(() => {
        setEvnPreset("dawn")
    }, [])
    return (
        <>
            <ambientLight intensity={1} color="#BBBBBB" />
            <directionalLight position={[2.5, 5, 5]} color="#FFFFFF" intensity={0.6} castShadow />
            <RigidBody mass={1} type="fixed" colliders={"trimesh"} scale={0.5} position={[0, 0.5, 0]} >
                <ScifiLab />
            </RigidBody>
            <Player initial={[0, 1, 0]} />
            <NFT />
        </>
    )
}

export function NFT() {
    // const token = useLoaderData() as Token | null

    const { id } = useParams()
    const { data } = useToken(id!)
    const token = data?.tokenById

    if (!token) return <></>


    return (
        <>
            {
                token.animation &&
                <Suspense>
                    <Model animation={token.animation} />
                </Suspense>
            }
            {
                token.image &&
                <Suspense>
                    {/* <DragControls
                        onDrag={(localMatrix: Matrix4, _: Matrix4, worldMatrix: Matrix4, __: Matrix4) => {
                            console.info(localMatrix, worldMatrix,)
                        }}
                    >
                    </DragControls> */}
                    <Image url={getIPFSUri(token.image)} position={[-4.7, 1.37, -1.7]} rotation={[0, 1.9, 0]} scale={2.2} />
                    <Image url={getIPFSUri(token.image)} position={[4.7, 1.37, -1.7]} rotation={[0, -1.9, 0]} scale={2.2} />
                    <Image url={getIPFSUri(token.image)} position={[-3, 1.37, -7.31]} rotation={[0, 0.64, 0]} scale={2.2} />
                    <Image url={getIPFSUri(token.image)} position={[3, 1.37, -7.31]} rotation={[0, -0.64, 0]} scale={2.2} />
                </Suspense>
            }
            <mesh position={[-0.05, 1.37, -7.85]} rotation={[0, 0.015, 0]}>
                <Root width={400} height={205} backgroundColor="DodgerBlue" padding={20} flexDirection="column">
                    <DefaultProperties color="PaleTurquoise">
                        <Container justifyContent="space-between">
                            <Text fontSize={20} fontWeight={600}>{token.name || `#${token.tokenId}`}</Text>
                            <Container gap={4} alignItems="center" alignContent="center">
                                <Boxes width={16} />
                                <Text fontWeight={500}>{token.collection.name}</Text>
                            </Container>
                        </Container>
                        {
                            token.description &&
                            <Text fontSize={12} marginTop={4}>{token.description}</Text>
                        }
                        <Container marginY={10} height={1} width="100%" backgroundColor="PaleTurquoise" />
                        <Text fontWeight={500} marginBottom={8}>Attributes</Text>
                        <Container flexDirection="row" flexWrap="wrap" gap={4} justifyContent="space-around">
                            {
                                token.attributes.map(attr => (
                                    <Card key={attr.traitType} borderColor="PaleTurquoise" backgroundOpacity={0} padding={4} borderRadius={4} hover={{ backgroundOpacity: 0.1 }}>
                                        <Text fontWeight={500} fontSize={8} color="PaleTurquoise">{attr.traitType}</Text>
                                        <Text fontSize={8} color="PaleTurquoise">{attr.value}</Text>
                                    </Card>
                                ))
                            }
                        </Container>
                    </DefaultProperties>
                </Root>
            </mesh>
        </>
    )
}

export function Model({ animation }: { animation: string }) {
    const ref = useRef<THREE.Group>(null)

    const src = animation.startsWith("https://turnon.meebits.app/viewer/") ? "https://livingpfp.meebits.app/api/meebits?type=3d&token_id=" + last(animation.split("/")) : ""

    const gltf = useGLTF(src)

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta / 2
        }
    })

    return (
        <group ref={ref} position={[0, 0.8, -3.2]}>
            <primitive object={gltf.scene} />
        </group>
    )
}