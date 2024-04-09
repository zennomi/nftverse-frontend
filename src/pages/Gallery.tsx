import { Environment } from "@react-three/drei";
import Gallery from "../models/Gallery";
import NFT from "../NFT";
import { Suspense } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Player from "../Player";

export function Component() {
    return (
        <>
            <ambientLight intensity={1} color="#BBBBBB" />
            <directionalLight position={[-0.5, 1, 1]} color="#FFFFFF" intensity={0.6} castShadow />
            <Environment preset="apartment" />
            {/* <NFT information={{ name: "", description: "", url: "https://i.imgur.com/MVZJ0Bw.jpeg" }} position={[0, 2.38, 2.94]} scale={1.2} rotation={[0, Math.PI, 0]} />
            <NFT information={{ name: "", description: "", url: "https://i.imgur.com/MVZJ0Bw.jpeg" }} position={[5.73, 2.38, 2.94]} scale={1.2} rotation={[0, Math.PI, 0]} />
            <NFT information={{ name: "", description: "", url: "https://i.imgur.com/gABVOlF.jpeg" }} position={[-5.73, 2.38, 2.94]} scale={1.2} rotation={[0, Math.PI, 0]} />
            <NFT information={{ name: "", description: "", url: "https://i.imgur.com/gABVOlF.jpeg" }} position={[5.73, 2.38, -2.94]} scale={1.2} /> */}
            <NFT information={{ name: "Kaori Miyazono", description: "Main female protagonist of Shigatsu wa Kimi no Uso", url: "https://i.imgur.com/gABVOlF.jpeg" }} position={[-5.73, 2.38, -2.94]} scale={1.2} />
            <NFT information={{ name: "Mie Ai", description: "Ai is an absentminded person who often forgets to bring her glasses", url: "https://i.imgur.com/iAVxywl.png" }} position={[0, 2.38, -2.94]} scale={1.2} />
            <Suspense fallback={null}>
                <Gallery />
            </Suspense>
            <Player initial={[0, 4, 1]} />
        </>
    )
}