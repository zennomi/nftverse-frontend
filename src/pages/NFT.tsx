import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three"
import { Exhibition } from "../models/Exhibition";
import { RatioImage } from "../RatioImage";
import Player from "../Player";

export default function NftPage() {
    const imgRef = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (imgRef.current) {
            imgRef.current.rotation.y += delta
        }
    })

    return (
        <>
            <Environment preset="sunset" />
            <Exhibition />
            <group ref={imgRef} >
                <RatioImage url="https://i.imgur.com/MVZJ0Bw.jpeg" position={[0, 3, 0]} scale={3} depth={0.05} />
            </group>
            <Player />
        </>
    )
}