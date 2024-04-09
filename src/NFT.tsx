import { Euler, Vector3, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react';
import { motion } from "framer-motion-3d"
import { Container, Root, Text } from '@react-three/uikit';
import * as THREE from "three"
import { RatioImage } from './RatioImage';
import { Card } from './components/card';
import { RootContainer, SVG, } from '@coconut-xr/koestlich';
import { Glass, IconButton } from '@coconut-xr/apfel-kruemel';
import { useNavigate } from 'react-router-dom';
import { NftInformation } from './types';

const direction = new THREE.Vector3()
const position = new THREE.Vector3()

export default function NFT(props: { position?: Vector3, scale?: number, rotation?: Euler, information: NftInformation, }) {
    const { information } = props
    const [hover, setHover] = useState(false)
    const [near, setNear] = useState(false)
    const [liked, setLiked] = useState(false)
    const navigate = useNavigate();
    const popup = useRef<THREE.Group<THREE.Object3DEventMap>>(null)
    const nft = useRef<THREE.Group<THREE.Object3DEventMap>>(null)

    useFrame((state) => {
        state.camera.getWorldPosition(position)
        state.camera.getWorldDirection(direction)
        if (popup.current) {
            popup.current.position.copy(position).add(direction.multiplyScalar(2))
            popup.current.rotation.copy(state.camera.rotation)
        }

        if (nft.current) {
            const distance = nft.current.position.distanceTo(position)
            if (near !== distance < 4)
                setNear(!near)
        }
    })

    return (
        <>
            <group
                ref={popup}
            >
                <motion.mesh
                    variants={{
                        close: { scale: 0 },
                        open: { scale: 1 },
                    }}
                    animate={hover && !near ? "open" : "close"}
                    transition={{
                        duration: 0.8,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                    rotation={[-Math.PI / 6, 0, 0]}
                    position={[0, -0.35, 0]}
                >
                    <Root>
                        <Container alignContent="center">
                            <Card maxWidth={100} borderRadius={8} padding={8} gap={2} flexDirection="column" alignContent="center">
                                <Text fontSize={8}>{information.name}</Text>
                                <Text fontSize={6} opacity={0.7}>
                                    {information.description}
                                </Text>
                            </Card>
                        </Container>
                    </Root>
                </motion.mesh>
            </group>
            <group ref={nft} position={props.position} rotation={props.rotation}>
                <RatioImage
                    onPointerMove={() => setHover(true)} onPointerLeave={() => setHover(false)}
                    url={information.url}
                    toneMapped
                    position={[0, 0, 0]}
                    scale={props.scale}
                    depth={0}
                />
                <mesh
                    position={[0, -0.8, 0.5]}
                >
                    <RootContainer flexDirection='row' alignContent='center' alignItems='center' justifyContent='center'>
                        <Glass borderRadius={32} padding={16} flexDirection='row' gapColumn={16} scaleX={near ? 1 : 0} alignContent='center' alignItems='center'>
                            <IconButton size="md" platter display={near ? 'flex' : 'none'} onClick={() => { setLiked(!liked) }}>
                                <SVG url="/icons/heart.svg" depth={3} color={liked ? "red" : "white"} />
                            </IconButton>
                            <IconButton size="md" platter display={near ? 'flex' : 'none'}>
                                <SVG url="/icons/cart.svg" depth={3} />
                            </IconButton>
                            <IconButton size="md" platter display={near ? 'flex' : 'none'}>
                                <SVG url="/icons/information.svg" depth={3} />
                            </IconButton>
                            <IconButton size="md" platter display={near ? 'flex' : 'none'} onClick={() => { navigate("/nft") }}>
                                <SVG url="/icons/eye.svg" depth={3} />
                            </IconButton>
                        </Glass>
                    </RootContainer>
                </mesh>
            </group>
        </>
    )
}