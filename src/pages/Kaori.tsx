import { Environment, Float, Image } from "@react-three/drei";
import { Kaori } from "../models/Kaori";
import { Stage } from "../models/Stage";
import Player from "../Player";
import { RigidBody } from "@react-three/rapier";
import { Root, Text } from "@react-three/uikit";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Suspense, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";

export function Component() {
    const [started, setStarted] = useState(false)
    return (
        <>
            <Environment preset="warehouse" />

            <group visible={started} position={[0, 2, 2.5]} >
                <Kaori />
            </group>

            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
                <mesh position={[0, 1.6, 8]} rotation={[-Math.PI / 6, 0, 0]}>
                    <Root>
                        <Card borderRadius={24} padding={24} gap={8} flexDirection="column" alignContent="center" alignItems="center">
                            <Text fontSize={24}>Miyazono Kaori</Text>
                            <Text fontSize={18} opacity={0.7}>
                                {started ? "She's performing!" : "Click below button to see her"}
                            </Text>
                            <Button platter onClick={() => setStarted(!started)}>
                                <Text fontSize={18}>
                                    {started ? "Stop" : "Start"}
                                </Text>
                            </Button>
                        </Card>
                    </Root>
                </mesh>
            </Float>
            <Image url="https://i.imgur.com/gABVOlF.jpeg" position={[0, 4.80, -10.52]} scale={[11.90, 5.8]} />
            <Suspense fallback={<LoadingScreen />}>
                <RigidBody mass={1} type="fixed" position={[0, 1, 0]} colliders={"trimesh"} >
                    <Stage />
                </RigidBody>
            </Suspense>
            <Player initial={[0, 0, 20]} />
        </>
    )
}