import { OrbitControls } from "@react-three/drei"
import { Canvas, MaterialNode, extend, useLoader } from "@react-three/fiber"
import { GridTransitionMaterial } from "../components/material/gridTransition"
import * as THREE from "three"
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useRef } from "react";

extend({ GridTransitionMaterial })

declare module '@react-three/fiber' {
    interface ThreeElements {
        gridTransitionMaterial: MaterialNode<THREE.Material, typeof GridTransitionMaterial>,
    }
};

export function Component() {


    return (
        <div className="XR">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Child />
            </Canvas>
        </div>
    )
}

export function Child() {
    const [transitionTexture1, transitionTexture2] = useLoader(TextureLoader, ['/textures/halftone.jpg', '/textures/transition2.png',])
    const renderMaterial = useRef<THREE.ShaderMaterial>(null);
    return (
        <>
            <OrbitControls />
            <mesh>
                <planeGeometry />
                <meshBasicMaterial color={"red"} />
            </mesh>
            <mesh position={[0, 0, -1]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial color={"blue"} />
            </mesh>
            <mesh position={[0, 0, -1]}>
                <planeGeometry args={[2, 2]} />
                <gridTransitionMaterial
                    key={GridTransitionMaterial.key}
                    ref={renderMaterial}
                    transparent={false}
                    depthTest={false}
                    depthWrite={true}
                    uBackgroundTexture0={transitionTexture1}
                    uBackgroundTexture1={transitionTexture2}
                    toneMapped={false}
                    uRez={[1000, 1000]}
                    uProgress={0.1}
                />
            </mesh>
        </>
    )
}