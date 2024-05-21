import { Suspense, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three"
import { Exhibition } from "../models/Exhibition";
import { RatioImage } from "../components/override/RatioImage";
import Player from "../components/Player";
import { useAppContext } from "../contexts/AppProvider";

export function Component() {
    const imgRef = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (imgRef.current) {
            imgRef.current.rotation.y += delta
        }
    })

    const { setEvnPreset } = useAppContext()

    useEffect(() => {
        setEvnPreset("sunset")
    }, [])

    return (
        <>
            <Suspense fallback={null}>
                <Exhibition />
                <group ref={imgRef} >
                    <RatioImage url="https://i.imgur.com/MVZJ0Bw.jpeg" position={[0, 3, 0]} scale={3} depth={0.05} />
                </group>
            </Suspense>
            <Player />
        </>
    )
}