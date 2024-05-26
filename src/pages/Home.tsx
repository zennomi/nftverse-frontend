import { Center, Float, GradientTexture, Text3D } from "@react-three/drei";
import { useEffect, useState } from "react";
import Player from "../components/Player";
import { Store } from "../models/Store";
import { RigidBody } from "@react-three/rapier";
import { useAppContext } from "../contexts/AppProvider";
import { Button } from "../components/default/button";
import { GlassMaterial, Root, Text } from "@react-three/uikit";
import { BrickWall, CarFront, Gamepad2, LayoutGrid, PersonStanding } from "@react-three/uikit-lucide";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three"
import { useCountdown } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { Fullscreen } from "../components/override/Fullscreen";
import { CollectionCategory } from "../types/graphql";
import LoadingScreen from "../components/LoadingScreen";
import { useStore } from "../hooks/store";

const cameraPosition = new THREE.Vector3()

export function Component() {
    const { setEvnPreset } = useAppContext()
    const [category, setCategory] = useState<CollectionCategory | null>(null)
    const [count, { startCountdown, stopCountdown, resetCountdown }] =
        useCountdown({
            countStart: 5,
            intervalMs: 1000,
        })
    const navigate = useNavigate()
    const set = useStore(state => state.set)

    useFrame(({ camera }) => {
        camera.getWorldPosition(cameraPosition)
        if (cameraPosition.distanceTo(new THREE.Vector3(2.35, 0.9, -1.2)) < 2) {
            if (category !== CollectionCategory.FUTURISTIC) setCategory(CollectionCategory.FUTURISTIC)
        } else if (cameraPosition.distanceTo(new THREE.Vector3(2.45, 0.9, 5.3)) < 2) {
            if (category !== CollectionCategory.PFP_MODEL) setCategory(CollectionCategory.PFP_MODEL)
        } else {
            if (!!category) setCategory(null)
        }
    })

    useEffect(() => {
        setEvnPreset("dawn")
    }, [])

    useEffect(() => {
        if (category) {
            set({ teleport: true })
            resetCountdown()
            startCountdown()
        } else {
            set({ teleport: false })
            stopCountdown()
            resetCountdown()
        }
    }, [category])

    useEffect(() => {
        if (!!category && count === 0) {
            set({ teleport: false })
            navigate(`/xr/physics/collection/${category.toLowerCase()}`)
        }
    }, [category, count])

    return (
        <>
            <ambientLight intensity={1} color="#BBBBBB" />
            <directionalLight position={[2.5, 5, 5]} color="#FFFFFF" intensity={0.6} castShadow />
            <RigidBody mass={1} type="fixed" position={[0, 0.1, 0]} rotation={[0, Math.PI, 0]} colliders={"trimesh"}>
                <Store receiveShadow />
            </RigidBody>
            <group position={[2.35, 0.9, -1.2]}>
                <Center >
                    <Text3D
                        font={"/fonts/PoetsenOne_Regular.json"}
                        letterSpacing={-0.05}
                        curveSegments={32}
                        bevelEnabled
                        bevelSize={0.01}
                        bevelThickness={0.01}
                        size={0.4}
                        receiveShadow
                        castShadow
                    >
                        SciFi
                        {/* <meshNormalMaterial /> */}
                        <meshPhysicalMaterial>
                            <GradientTexture
                                stops={[0, 0.2, 0.5, 1]} // As many stops as you want
                                colors={['aqua', 'hotpink', 'hotpink', 'yellow']} // Colors need to match the number of stops
                                innerCircleRadius={0} // Optional, the radius of the inner circle of the gradient, default = 0
                                outerCircleRadius={'auto'} // Optional, the radius of the outer circle of the gradient, default = auto
                            />
                        </meshPhysicalMaterial>
                    </Text3D>
                </Center>
                <mesh position={[0, -0.35, 0.5]} rotation={[-Math.PI / 2, 0, 0]} scale={0.2}>
                    <Root>
                        <Button backgroundColor={'hotpink'} panelMaterialClass={GlassMaterial} borderBend={0.5} borderWidth={4} borderOpacity={0} gap={7}>
                            <LayoutGrid color="white" />
                            <Text color="white">Enter SciFi Gallery</Text>
                        </Button>
                    </Root>
                </mesh>
            </group>
            <group position={[-3.35, 0.9, -1.2]}>
                <Center >
                    <Text3D
                        font={"/fonts/AMCAP_Eternal_Regular.json"}
                        letterSpacing={-0.05}
                        curveSegments={32}
                        bevelEnabled
                        bevelSize={0.01}
                        bevelThickness={0.01}
                        size={0.4}
                        receiveShadow
                        castShadow
                    >
                        CAR
                        <meshStandardMaterial>
                            <GradientTexture
                                stops={[0, 0.2, 0.5, 1]} // As many stops as you want
                                colors={['#2b2d42', '#8d99ae', '#8d99ae', '#edf2f4']} // Colors need to match the number of stops
                                innerCircleRadius={0} // Optional, the radius of the inner circle of the gradient, default = 0
                                outerCircleRadius={'auto'} // Optional, the radius of the outer circle of the gradient, default = auto
                            />
                        </meshStandardMaterial>
                    </Text3D>
                </Center>
                <mesh position={[0, -0.35, 0.5]} rotation={[-Math.PI / 2, 0, 0]} scale={0.2}>
                    <Root>
                        <Button backgroundColor={'#2b2d42'} panelMaterialClass={GlassMaterial} borderBend={0.5} borderWidth={4} borderOpacity={0} gap={7}>
                            <CarFront color="white" />
                            <Text color="white">Enter Car Showroom</Text>
                        </Button>
                    </Root>
                </mesh>
            </group>
            <group position={[-2.75, 0.9, 5.3]} rotation={[0, Math.PI, 0]}>
                <Center >
                    <Text3D
                        font={"/fonts/Inter_Bold.json"}
                        letterSpacing={-0.05}
                        curveSegments={32}
                        bevelEnabled
                        bevelSize={0.01}
                        bevelThickness={0.01}
                        size={0.4}
                        receiveShadow
                        castShadow
                    >
                        GAME
                        <meshBasicMaterial>
                            <GradientTexture
                                stops={[0, 0.2, 0.5, 1]} // As many stops as you want
                                colors={['#fe4a49', '#fed766', '#fed766', '#009fb7']} // Colors need to match the number of stops
                                innerCircleRadius={0} // Optional, the radius of the inner circle of the gradient, default = 0
                                outerCircleRadius={'auto'} // Optional, the radius of the outer circle of the gradient, default = auto
                            />
                        </meshBasicMaterial>
                    </Text3D>
                </Center>
                <mesh position={[0, -0.35, 0.5]} rotation={[-Math.PI / 2, 0, 0]} scale={0.2}>
                    <Root>
                        <Button backgroundColor={'#fed766'} panelMaterialClass={GlassMaterial} borderBend={0.5} borderWidth={4} borderOpacity={0} gap={7}>
                            <Gamepad2 color="white" />
                            <Text color="white">Enter Game Store</Text>
                        </Button>
                    </Root>
                </mesh>
            </group>
            <group position={[0, 0.9, 5.3]} rotation={[0, Math.PI, 0]}>
                <Center >
                    <Text3D
                        font={"/fonts/Minecraft_Ten_Regular.json"}
                        curveSegments={32}
                        bevelEnabled
                        bevelSize={0.01}
                        bevelThickness={0.01}
                        size={0.4}
                        receiveShadow
                        castShadow
                    >
                        VOXEL
                        <meshBasicMaterial>
                            <GradientTexture
                                stops={[0, 0.2, 0.5, 1]} // As many stops as you want
                                colors={['#386641', '#6a994e', '#6a994e', '#a7c957']} // Colors need to match the number of stops
                                innerCircleRadius={0} // Optional, the radius of the inner circle of the gradient, default = 0
                                outerCircleRadius={'auto'} // Optional, the radius of the outer circle of the gradient, default = auto
                            />
                        </meshBasicMaterial>
                    </Text3D>
                </Center>
                <mesh position={[0, -0.35, 0.5]} rotation={[-Math.PI / 2, 0, 0]} scale={0.2}>
                    <Root>
                        <Button backgroundColor={'#386641'} panelMaterialClass={GlassMaterial} borderBend={0.5} borderWidth={4} borderOpacity={0} gap={7}>
                            <BrickWall color="white" />
                            <Text color="white">Enter Minecraft</Text>
                        </Button>
                    </Root>
                </mesh>
            </group>
            <group position={[2.45, 0.9, 5.3]} rotation={[0, Math.PI, 0]}>
                <Center >
                    <Text3D
                        font={"/fonts/Inter_Bold.json"}
                        letterSpacing={-0.05}
                        curveSegments={32}
                        bevelEnabled
                        bevelSize={0.01}
                        bevelThickness={0.01}
                        size={0.4}
                        receiveShadow
                        castShadow
                    >
                        AVATAR
                        <meshBasicMaterial>
                            <GradientTexture
                                stops={[0, 0.2, 0.5, 1]} // As many stops as you want
                                colors={['#006ba6', '#0496ff', '#0496ff', '#ffbc42']} // Colors need to match the number of stops
                                innerCircleRadius={0} // Optional, the radius of the inner circle of the gradient, default = 0
                                outerCircleRadius={'auto'} // Optional, the radius of the outer circle of the gradient, default = auto
                            />
                        </meshBasicMaterial>
                    </Text3D>
                </Center>
                <mesh position={[0, -0.35, 0.5]} rotation={[-Math.PI / 2, 0, 0]} scale={0.2}>
                    <Root>
                        <Button backgroundColor={'#0496ff'} panelMaterialClass={GlassMaterial} borderBend={0.5} borderWidth={4} borderOpacity={0} gap={7}>
                            <PersonStanding color="white" />
                            <Text color="white">Enter Avatar Store</Text>
                        </Button>
                    </Root>
                </mesh>
            </group>
            <Float rotationIntensity={0.5} floatingRange={[-0.05, 0.05]}>
                <Center position={[8, 2.5, 2]} rotation={[0, -Math.PI / 2, 0]}>
                    <Text3D
                        font={"/fonts/Inter_Bold.json"}
                        curveSegments={32}
                        bevelEnabled
                        bevelSize={0.04}
                        bevelThickness={0.1}
                        height={0.5}
                        lineHeight={0.5}
                        letterSpacing={-0.06}
                        size={1}
                    >
                        NFTVERSE
                        <meshPhysicalMaterial>
                            <GradientTexture
                                stops={[0, 0.2, 0.5, 1]} // As many stops as you want
                                colors={['aqua', 'hotpink', 'hotpink', 'yellow']} // Colors need to match the number of stops
                                innerCircleRadius={0} // Optional, the radius of the inner circle of the gradient, default = 0
                                outerCircleRadius={'auto'} // Optional, the radius of the outer circle of the gradient, default = auto
                            />
                        </meshPhysicalMaterial>
                    </Text3D>
                </Center>
            </Float>
            <Fullscreen justifyContent="center" alignContent="center" alignItems="center">
                {
                    category &&
                    <LoadingScreen text={`Enter ${category.toLowerCase()} category in ${count.toString()}s...`} />
                }
            </Fullscreen>
            <Player initial={[-5, 1, 2]} initialRotation={[0, -Math.PI / 2, 0]} />
        </>
    )
}