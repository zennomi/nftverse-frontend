import { GroupProps, MaterialNode, extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { RefObject, forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three"
import { Controllers } from "@coconut-xr/natuerlich/defaults";
import { ImmersiveSessionOrigin } from "@coconut-xr/natuerlich/react";
import { useControls } from "leva";
import { DEFAULT_MODE, MODES, MODE_CONFIG } from "../configs/mode";
import { GroundPrideShaderMaterial, GroundShaderMaterial } from "../components/material/ground";
import { SkyShaderMaterial } from "../components/material/sky";
import { TransitionMaterial } from "../components/material/wipeTransition";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { OrbitControls, PerspectiveCamera, useFBO } from "@react-three/drei";
import { CheckboardTransitionMaterial } from "../components/material/checkboardTransittion";

extend({ SkyShaderMaterial, GroundShaderMaterial, GroundPrideShaderMaterial, TransitionMaterial, CheckboardTransitionMaterial });

declare module '@react-three/fiber' {
    interface ThreeElements {
        skyShaderMaterial: MaterialNode<THREE.Material, typeof SkyShaderMaterial>,
        groundShaderMaterial: MaterialNode<THREE.Material, typeof GroundShaderMaterial>,
        groundPrideShaderMaterial: MaterialNode<THREE.Material, typeof GroundPrideShaderMaterial>,
        transitionMaterial: MaterialNode<THREE.Material, typeof TransitionMaterial>,
    }
};

export function Component() {
    const [mode, setMode] = useState<keyof typeof MODE_CONFIG>(DEFAULT_MODE)
    const [prevMode, setPrevMode] = useState<keyof typeof MODE_CONFIG>(DEFAULT_MODE)
    const { camera, viewport } = useThree()

    const renderedScene1 = useRef<THREE.Group>(null);
    const renderedScene2 = useRef<THREE.Group>(null);
    // const exampleScene = useRef();

    const renderTarget = useFBO();
    const renderTarget2 = useFBO();
    const renderMaterial = useRef<THREE.ShaderMaterial>(null);
    const renderMesh = useRef<THREE.Mesh>(null)

    const renderCamera = useRef<THREE.PerspectiveCamera>(null);

    const transitionTexture = useLoader(TextureLoader, '/textures/transition2.png')

    useControls({
        mode: { options: MODES, value: mode, onChange: (val) => { setMode((mode) => { setPrevMode(mode); return val }) } },
    })

    useFrame(({ gl, scene, clock, size }, delta) => {
        if (renderMaterial.current) {
            renderMaterial.current.uTime = clock.getElapsedTime() / 2
            renderMaterial.current.uRez = [size.width, size.height]
        }
        if (renderedScene1.current && renderedScene2.current && renderMaterial.current && renderMesh.current && renderCamera.current) {
            if (renderMaterial.current.progression < 0.9999) {
                renderMesh.current.visible = true;
                renderedScene1.current.visible = true;
                renderedScene2.current.visible = false;

                gl.setRenderTarget(renderTarget);

                renderMaterial.current.progression = THREE.MathUtils.lerp(
                    renderMaterial.current.progression,
                    1,
                    delta * 4
                );

                gl.render(scene, renderCamera.current);

                gl.setRenderTarget(renderTarget2);

                renderedScene1.current.visible = false;
                renderedScene2.current.visible = true;

                gl.render(scene, renderCamera.current);
                renderedScene2.current.visible = false;

                gl.setRenderTarget(null);
            } else {
                renderedScene1.current.visible = false;
                renderedScene2.current.visible = true;
                renderMesh.current.visible = false;
            }

        }
    })

    useEffect(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.position.set(0, 0, 1)
        }
    }, [camera])

    useEffect(() => {
        if (mode === prevMode) {
            return;
        }

        if (renderMaterial.current) renderMaterial.current.progression = 0;
    }, [mode, prevMode, renderMaterial]);

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={10} position={[0, 0.85, 0]} />
            <directionalLight intensity={10} position={[1, 1, 1]} />
            {/* <mesh>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial color="red" />
            </mesh> */}
            <mesh ref={renderMesh} position={[0, 0, -4]}>
                <planeGeometry args={[viewport.width, viewport.height]} />
                {/* <bufferGeometry
                    ref={gemoetry}
                    attributes={{
                        position: new THREE.BufferAttribute(new Float32Array(VERTICES), 3),
                        uv: new THREE.BufferAttribute(new Float32Array(UVS), 2),
                    }}
                /> */}
                {/* <transitionMaterial
                    ref={renderMaterial}
                    transparent={false}
                    depthTest={false}
                    depthWrite={false}
                    tex={renderTarget.texture}
                    tex2={renderTarget2.texture}
                    toneMapped={false}
                /> */}
                {/* @ts-ignore */}
                <checkboardTransitionMaterial
                    ref={renderMaterial}
                    transparent={false}
                    depthTest={false}
                    depthWrite={false}
                    tex={renderTarget.texture}
                    tex2={renderTarget2.texture}
                    toneMapped={false}
                    tMixTexture={transitionTexture}
                />

            </mesh>
            <PerspectiveCamera
                makeDefault={false}
                ref={renderCamera}
                position={camera.position.clone()}
                rotation={camera.rotation.clone()}
                far={camera.far}
                fov={75}
            />
            <Background mode={prevMode} ref={renderedScene1} visible={false} />
            <Background mode={mode} ref={renderedScene2} />
            {/* <PointerLockControls /> */}
            <ImmersiveSessionOrigin position={[0, -1.5, 1]}>
                <Controllers />
            </ImmersiveSessionOrigin>
        </>
    )
}

export const Background = forwardRef<THREE.Group, { mode: keyof typeof MODE_CONFIG } & GroupProps>(function ({ mode, ...props }, ref) {
    const skyShader = useRef<THREE.ShaderMaterial>(null)
    const groundShader = useRef<THREE.ShaderMaterial>(null)

    useFrame(({ camera, clock, },) => {
        if (skyShader.current) {
            // update uniform variable
            const _MAT4_1 = new THREE.Matrix4();

            _MAT4_1.copy(camera.modelViewMatrix)

            _MAT4_1.elements[12] = _MAT4_1.elements[13] = _MAT4_1.elements[14] = 0;

            _MAT4_1.multiply(camera.projectionMatrix)

            _MAT4_1.invert()

            skyShader.current.uTime = clock.getElapsedTime() / 2
            skyShader.current.uViewDirProjInverse = _MAT4_1
        }

        if (groundShader.current) {
            groundShader.current.uTime = clock.getElapsedTime() / 2
        }
    })

    return (
        <group {...props} ref={ref} >
            <Ground shader={groundShader} mode={mode} />
            <SkyBox shader={skyShader} mode={mode} />
        </group>
    )
})

export function Ground({ shader, mode, }: { shader: RefObject<THREE.ShaderMaterial>, mode?: keyof typeof MODE_CONFIG }) {
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
                        uColor={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].Color))}
                        uColorNight={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].ColorNight))}
                        uColorTiles={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].ColorTiles))}
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
                        uColor={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].Color))}
                        uColorNight={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].ColorNight))}
                        uColorTiles={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].ColorTiles))}
                    />
            }
        </mesh>
    )
}

export function SkyBox({ shader, mode, }: { shader: RefObject<THREE.ShaderMaterial>, mode: keyof typeof MODE_CONFIG }) {
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
                uColor0={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].Color0))}
                uColor1={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].Color1))}
                uColorNight0={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].ColorNight))}
                uColorNight1={new THREE.Color(new THREE.Color(...MODE_CONFIG[mode].ColorTiles))}
            />
        </mesh>
    )
}