import { extend, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three"
import EnterVRButton from "../components/EnterVRButton";
import { Controllers, XRCanvas } from "@coconut-xr/natuerlich/defaults";
import { ImmersiveSessionOrigin } from "@coconut-xr/natuerlich/react";
import { useControls } from "leva";
import { SkyShaderMaterial } from "../components/material/sky";
import { GroundShaderMaterial } from "../components/material/ground";

const MODE_CONFIG: Record<string, Record<string, string | number>> = {
    meebit: {
        Color0: "#171445",
        Color1: "#3433a5",
        Color: "#b8bcfc",
        ColorNight: "#5567F5",
        ColorTiles: "#3a3cb2",
        progressDance: 1,
        timescale: 0.5
    },
    pride: {
        Color0: "#171445",
        Color1: "#3433a5",
        Color: "#ffb83e",
        ColorNight: "#fdc25b",
        ColorTiles: "#fdc25b",
        progressDance: 1,
        timescale: 0.5
    },
    zen: {
        Color0: "#006db6",
        Color1: "#5daee5",
        Color: "#65bffb",
        ColorNight: "#fdc25b",
        ColorTiles: "#ffffff",
        progressDance: 1,
        timescale: 0.5
    },
}

const MODES = Object.keys(MODE_CONFIG)

const DEFAULT_MODE = MODES[2]

extend({ SkyShaderMaterial, GroundShaderMaterial });

export function Component() {
    const { test } = useControls({ test: false })

    return (
        <div className="XR">
            <EnterVRButton />
            <XRCanvas camera={{ position: [0, 0, 1] }}>
                <ambientLight intensity={10} position={[0, 0.85, 0]} />
                <directionalLight intensity={10} position={[1, 1, 1]} />

                <Ground />

                <SkyBox />
                {/* <OrbitControls /> */}
                {/* <PointerLockControls /> */}
                <ImmersiveSessionOrigin position={[0, -1.5, 1]}>
                    <Controllers />
                </ImmersiveSessionOrigin>
            </XRCanvas>
        </div>
    )
}

export function Ground() {
    const shader = useRef<THREE.ShaderMaterial>(null)

    useFrame((state) => {
        if (shader.current) {
            shader.current.uTime = state.clock.getElapsedTime() / 2
        }
    })

    return (
        <mesh position={[0, -0.5, 1]} rotation={[-Math.PI / 2, 0, 0]}
        >
            {/* <Plane /> */}
            <planeGeometry args={[30, 30]} />
            {/* <meshBasicMaterial color="red" /> */}
            <groundShaderMaterial
                key={GroundShaderMaterial.key}
                ref={shader}
                uColor={new THREE.Color(MODE_CONFIG["meebit"].Color)}
                uColorNight={new THREE.Color(MODE_CONFIG["meebit"].ColorNight)}
                uColorTiles={new THREE.Color(MODE_CONFIG["meebit"].ColorTiles)}
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
        </mesh>
    )
}

export function SkyBox() {
    const VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0];
    const INDICES = [0, 1, 2, 0, 2, 3];
    const UVS = [0, 1, 0, 0, 1, 0, 1, 1];
    const skyShader = useRef<THREE.ShaderMaterial>(null)
    const gemoetry = useRef<THREE.BufferGeometry>(null)
    const [mode, setMode] = useState<keyof typeof MODE_CONFIG>(DEFAULT_MODE)
    const [prevMode, setPrevMode] = useState<keyof typeof MODE_CONFIG>(DEFAULT_MODE)
    useControls({
        mode: { options: MODES, value: mode, onChange: (val) => { setMode((mode) => { setPrevMode(mode); return val }) } }
    })

    useFrame((state, delta) => {
        if (gemoetry.current) {
            gemoetry.current.setIndex(Array.from(INDICES))
        }
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

            skyShader.current.uColor0 = (new THREE.Color(...skyShader.current.uColor0).lerp(new THREE.Color(MODE_CONFIG[mode].Color0), delta)).toArray()
            skyShader.current.uColor1 = (new THREE.Color(...skyShader.current.uColor1).lerp(new THREE.Color(MODE_CONFIG[mode].Color1), delta)).toArray()
        }
    })

    return (
        <mesh position={[0, 0, 0]}>
            <bufferGeometry
                ref={gemoetry}
                attributes={{
                    position: new THREE.BufferAttribute(new Float32Array(VERTICES), 3),
                    uv: new THREE.BufferAttribute(new Float32Array(UVS), 2),
                }}
            />
            {/* @ts-ignore */}
            <skyShaderMaterial
                ref={skyShader}
                uColor0={new THREE.Color(MODE_CONFIG[prevMode].Color0)}
                uColor1={new THREE.Color(MODE_CONFIG[prevMode].Color1)}
                uColorNight0={new THREE.Color(MODE_CONFIG[prevMode].ColorNight)}
                uColorNight1={new THREE.Color(MODE_CONFIG[prevMode].ColorTiles)}
                uMultiplier={12}
                uAlpha={0.5}
                uNightMode={0}
                uYpow={1}
                key={SkyShaderMaterial.key}
            />
        </mesh>
    )
}