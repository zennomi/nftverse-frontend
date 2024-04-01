import { Environment } from "@react-three/drei";
import Gallery from "../models/Gallery";
import NFT from "../NFT";

export default function GalleryPage() {
    return (
        <>
            <ambientLight intensity={1} color="#BBBBBB" />
            <directionalLight position={[-0.5, 1, 1]} color="#FFFFFF" intensity={0.6} castShadow />
            <Environment preset="apartment" />
            <NFT position={[0, 2.38, 2.9]} scale={1.2} rotation={[0, Math.PI, 0]} />
            <NFT position={[5.7, 2.38, 2.9]} scale={1.2} rotation={[0, Math.PI, 0]} />
            <NFT position={[-5.7, 2.38, 2.9]} scale={1.2} rotation={[0, Math.PI, 0]} />
            <NFT position={[5.7, 2.38, -2.9]} scale={1.2} />
            <NFT position={[-5.7, 2.38, -2.9]} scale={1.2} />
            <NFT position={[0, 2.38, -2.9]} scale={1.2} />
            <Gallery />
        </>
    )
}