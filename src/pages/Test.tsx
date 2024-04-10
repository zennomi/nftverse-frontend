import { Fullscreen, Text } from "@react-three/uikit";
import { Card } from "../components/apfel/card";
import { RatioImage } from "../components/override/RatioImage"
import NFT from "../components/NFT";
import { Environment } from "@react-three/drei";
import Player from "../components/Player";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export function Component() {
    const camera = useThree(state => state.camera)
    useEffect(() => {
        console.log(camera)
    }, [camera])
    return (
        <>
            <ambientLight intensity={10} position={[0, 0.85, 0]} />
            <directionalLight intensity={10} position={[1, 1, 1]} />
            <Environment preset="apartment" />
            <Fullscreen attachCamera={false} justifyContent="center" alignContent="center" alignItems="center">
                <Card borderRadius={32} padding={16} flexDirection="column" gapColumn={16} justifyContent="center" alignContent="center" alignItems="center">
                    <Text fontSize={24}>Loading...</Text>
                </Card>
            </Fullscreen>
            <RatioImage url="https://i.imgur.com/MVZJ0Bw.jpeg" />
            <NFT information={{ name: "Mie Ai", description: "Ai is an absentminded person who often forgets to bring her glasses", url: "https://i.imgur.com/iAVxywl.png" }} position={[0, 2.38, -2.94]} scale={1.2} />
            <Player />
        </>
    )
}