import { Euler, Vector3, useFrame, useThree } from '@react-three/fiber'
import { useRef, useState } from 'react';
import { motion } from "framer-motion-3d"
import { Container, Root, Text } from '@react-three/uikit';
import * as THREE from "three"
import { RatioImage } from './RatioImage';
import { Card } from './components/card';
import { RootContainer, SVG, } from '@coconut-xr/koestlich';
import { Glass, IconButton } from '@coconut-xr/apfel-kruemel';
import { useNavigate } from 'react-router-dom';

const rotation = new THREE.Vector3()

export default function NFT(props: { position?: Vector3, scale?: number, rotation?: Euler }) {
    const [hover, setHover] = useState(false)
    const [near, setNear] = useState(false)
    const [liked, setLiked] = useState(false)
    const navigate = useNavigate();
    const popup = useRef<THREE.Group<THREE.Object3DEventMap>>(null)
    const nft = useRef<THREE.Group<THREE.Object3DEventMap>>(null)
    const get = useThree((state) => state.get)

    useFrame((state) => {
        if (popup.current) {
            popup.current.position.copy(state.camera.position).add(state.camera.getWorldDirection(rotation).multiplyScalar(1.5))
            popup.current.rotation.copy(state.camera.rotation)
        }

        if (nft.current) {
            const distance = nft.current.position.distanceTo(state.camera.position)
            setNear(distance < 4)
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
                >
                    <Root>
                        <Container alignContent="center">
                            <Card borderRadius={32} padding={32} gap={8} flexDirection="column" alignContent="center">
                                <Text fontSize={32}>Mahiru Shiina</Text>
                                <Text fontSize={24} opacity={0.7}>
                                    This is an NFT.
                                </Text>
                            </Card>
                        </Container>
                    </Root>
                </motion.mesh>
            </group>
            <group ref={nft} position={props.position} rotation={props.rotation}>
                <RatioImage
                    onPointerMove={() => setHover(true)} onPointerLeave={() => setHover(false)}
                    url="https://i.imgur.com/MVZJ0Bw.jpeg"
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
                            <IconButton size="md" platter display={near ? 'flex' : 'none'} onClick={() => { get().camera.position.set(0, 4, 0); navigate("/nft") }}>
                                <SVG url="/icons/eye.svg" depth={3} />
                            </IconButton>
                        </Glass>
                    </RootContainer>
                </mesh>
            </group>
        </>
    )
}