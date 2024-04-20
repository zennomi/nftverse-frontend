import { MaterialNode, extend, useFrame, useThree } from "@react-three/fiber";
import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three"
import { Controllers } from "@coconut-xr/natuerlich/defaults";
import { ImmersiveSessionOrigin } from "@coconut-xr/natuerlich/react";
import { useControls } from "leva";
import { DEFAULT_MODE, MODES, MODE_CONFIG } from "../configs/mode";
import { GroundPrideShaderMaterial, GroundShaderMaterial } from "../components/material/ground";
import { SkyShaderMaterial } from "../components/material/sky";

extend({ SkyShaderMaterial, GroundShaderMaterial, GroundPrideShaderMaterial });

declare module '@react-three/fiber' {
    interface ThreeElements {
        skyShaderMaterial: MaterialNode<THREE.Material, typeof SkyShaderMaterial>,
        groundShaderMaterial: MaterialNode<THREE.Material, typeof GroundShaderMaterial>,
        groundPrideShaderMaterial: MaterialNode<THREE.Material, typeof GroundPrideShaderMaterial>,
    }
};

export function Component() {
    const [mode, setMode] = useState<keyof typeof MODE_CONFIG>(DEFAULT_MODE)
    const [prevMode, setPrevMode] = useState<keyof typeof MODE_CONFIG>(DEFAULT_MODE)
    const camera = useThree(state => state.camera)

    const skyShader = useRef<THREE.ShaderMaterial>(null)
    const groundShader = useRef<THREE.ShaderMaterial>(null)

    useControls({
        mode: { options: MODES, value: mode, onChange: (val) => { setMode((mode) => { setPrevMode(mode); return val }) } }
    })

    useFrame((state, delta) => {

        if (skyShader.current) {
            // update uniform variable
            const _MAT4_1 = new THREE.Matrix4();

            _MAT4_1.copy(state.camera.modelViewMatrix)

            _MAT4_1.elements[12] = _MAT4_1.elements[13] = _MAT4_1.elements[14] = 0;

            _MAT4_1.multiply(state.camera.projectionMatrix)

            _MAT4_1.invert()

            // lerp
            skyShader.current.uTime = state.clock.getElapsedTime() / 2
            skyShader.current.uViewDirProjInverse = _MAT4_1

            skyShader.current.uColor0 = (new THREE.Color(...skyShader.current.uColor0).lerp(new THREE.Color(...MODE_CONFIG[mode].Color0), delta)).toArray()
            skyShader.current.uColor1 = (new THREE.Color(...skyShader.current.uColor1).lerp(new THREE.Color(...MODE_CONFIG[mode].Color1), delta)).toArray()
            skyShader.current.uColorNight0 = (new THREE.Color(...skyShader.current.uColorNight0).lerp(new THREE.Color(...MODE_CONFIG[mode].ColorNight), delta)).toArray()
            skyShader.current.uColorNight1 = (new THREE.Color(...skyShader.current.uColorNight1).lerp(new THREE.Color(...MODE_CONFIG[mode].ColorTiles), delta)).toArray()
        }

        if (groundShader.current) {
            groundShader.current.uTime = state.clock.getElapsedTime() / 2

            // lerp
            groundShader.current.uColor = (new THREE.Color(...groundShader.current.uColor).lerp(new THREE.Color(...MODE_CONFIG[mode].Color), delta)).toArray()
            groundShader.current.uColorNight = (new THREE.Color(...groundShader.current.uColorNight).lerp(new THREE.Color(...MODE_CONFIG[mode].ColorNight), delta)).toArray()
            groundShader.current.uColorTiles = (new THREE.Color(...groundShader.current.uColorTiles).lerp(new THREE.Color(...MODE_CONFIG[mode].ColorTiles), delta)).toArray()
        }
    })

    useEffect(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.position.set(0, 0, 1)
        }
    }, [camera])

    return (
        <>
            <ambientLight intensity={10} position={[0, 0.85, 0]} />
            <directionalLight intensity={10} position={[1, 1, 1]} />
            <Ground shader={groundShader} mode={mode} prevMode={prevMode} />
            <SkyBox shader={skyShader} mode={mode} prevMode={prevMode} />
            {/* <PointerLockControls /> */}
            <ImmersiveSessionOrigin position={[0, -1.5, 1]}>
                <Controllers />
            </ImmersiveSessionOrigin>
        </>
    )
}

export function Ground({ shader, mode, prevMode }: { shader: RefObject<THREE.ShaderMaterial>, mode: keyof typeof MODE_CONFIG, prevMode: keyof typeof MODE_CONFIG }) {
    return (
        <mesh position={[0, -0.5, 1]} rotation={[-Math.PI / 2, 0, 0]}
        >
            <planeGeometry args={[30, 30]} />
            {/* @ts-ignore */}
            {
                mode === "pride" ?
                    <groundPrideShaderMaterial
                        key={GroundPrideShaderMaterial.key}
                        ref={shader}
                        uGrid={0}
                        uFadeDistance={0.15}
                        uProgressSpace={1}
                        uProgressDance={1}
                        uProgressMulti={0}
                        uProgressBall={0}
                        uProgressLoading={0}
                        glslVersion={THREE.GLSL3}
                        transparent={true}
                        needsUpdate={true}
                        uniformsNeedUpdate={true}
                        depthTest
                        depthWrite
                    />
                    :
                    <groundShaderMaterial
                        key={GroundShaderMaterial.key}
                        ref={shader}
                        uGrid={0}
                        uFadeDistance={0.15}
                        uProgressSpace={1}
                        uProgressDance={1}
                        uProgressMulti={0}
                        uProgressBall={0}
                        uProgressLoading={0}
                        glslVersion={THREE.GLSL3}
                        transparent={true}
                        needsUpdate={true}
                        uniformsNeedUpdate={true}
                        depthTest
                        depthWrite
                    />
            }
        </mesh>
    )
}

export function SkyBox({ shader, mode, prevMode }: { shader: RefObject<THREE.ShaderMaterial>, mode: keyof typeof MODE_CONFIG, prevMode: keyof typeof MODE_CONFIG }) {
    const VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0];
    const INDICES = [0, 1, 2, 0, 2, 3];
    const UVS = [0, 1, 0, 0, 1, 0, 1, 1];
    const gemoetry = useRef<THREE.BufferGeometry>(null)


    useEffect(() => {
        if (gemoetry.current) {
            gemoetry.current.setIndex(Array.from(INDICES))
        }
    }, [])

    return (
        <mesh position={[0, 0, 0]}>
            <bufferGeometry
                ref={gemoetry}
                attributes={{
                    position: new THREE.BufferAttribute(new Float32Array(VERTICES), 3),
                    uv: new THREE.BufferAttribute(new Float32Array(UVS), 2),
                }}
            />
            <skyShaderMaterial
                ref={shader}
            />
        </mesh>
    )
}