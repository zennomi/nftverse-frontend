import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { useEffect, useRef } from "react"
import { Vector3, useFrame, useThree } from "@react-three/fiber"
import { PositionalAudio, Sparkles } from '@react-three/drei'
import { CapsuleCollider, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier"
import { ImmersiveSessionOrigin, NonImmersiveCamera, useInputSources, useXR } from "@coconut-xr/natuerlich/react"
import { getInputSourceId } from "@coconut-xr/natuerlich"
import InputSource from "./InputSource"
import { getState, useStore } from "../hooks/store"

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export default function Player({ initial, initialRotation }: { initial?: Vector3, initialRotation?: [number, number, number] }) {
    const ref = useRef<RapierRigidBody>(null)
    const rapier = useRapier()
    const inputSources = useInputSources()
    const camera = useThree(state => state.camera)
    const footstepAudio = useRef<THREE.PositionalAudio>(null)
    const teleport = useStore(state => state.teleport)
    const inVR = useXR(({ mode }) => mode !== "none");

    useFrame((state) => {
        if (!ref.current) return;
        const { forward, backward, left, right, jump, boost } = getState().controls
        const velocity = ref.current.linvel()
        // sound
        if (footstepAudio.current) {
            footstepAudio.current.setVolume(0.5)
            footstepAudio.current.playbackRate = boost ? 2 : 1
            if (forward || backward || left || right) {
                if (!footstepAudio.current.isPlaying) {
                    footstepAudio.current.play()
                }
            } else {
                footstepAudio.current.stop()
            }
        }
        // movement
        frontVector.set(0, 0, (backward) - (forward))
        sideVector.set((left) - (right), 0, 0)
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(boost ? SPEED * 2 : SPEED).applyEuler(state.camera.rotation)
        ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)
        // // jumping
        const world = rapier.world
        const ray = world.castRay(new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }), 0.05, true)
        const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
        if (jump && grounded) ref.current.setLinvel({ x: 0, y: 3, z: 0 }, true)
    })
    useEffect(() => {
        if (initialRotation) {
            camera.rotation.set(...initialRotation)
        } else {
            camera.rotation.set(0, 0, 0)
        }
    }, [camera,])
    return (
        <>
            <RigidBody ref={ref} colliders={false} mass={1} type="dynamic" position={initial || [0, 4.5, 1]} enabledRotations={[false, false, false]}
            >
                <CapsuleCollider
                    args={[0.75, 0.5]}
                    mass={1}
                >
                    <NonImmersiveCamera />
                    <ImmersiveSessionOrigin
                        position={[0, -1.5, 0]}
                    >
                        {
                            inputSources.map(inputSource => <InputSource key={getInputSourceId(inputSource)} inputSource={inputSource} body={ref} />)
                        }
                    </ImmersiveSessionOrigin>
                    <PositionalAudio ref={footstepAudio} url="/audios/footstep.wav" loop={false} distance={5} />
                    <Sparkles visible={teleport} count={inVR ? 100 : 1000} scale={1} size={inVR ? 1 : 10} speed={inVR ? 3 : 5} />
                </CapsuleCollider>
            </RigidBody>
        </>
    )
}
