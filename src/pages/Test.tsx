import { ImmersiveSessionOrigin, useInputSources, useXR } from "@coconut-xr/natuerlich/react"
import { useKeyboardControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { CapsuleCollider, RapierRigidBody, RigidBody, useRapier, vec3 } from "@react-three/rapier"
import { useRef } from "react"
import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { RatioImage } from "../RatioImage"
import InputSource from "../components/InputSource"
import { getInputSourceId } from "@coconut-xr/natuerlich"

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export function Component() {
    const body = useRef<RapierRigidBody>(null)
    const rapier = useRapier()
    const [, get] = useKeyboardControls()
    const inputSources = useInputSources()
    const camera = useThree((state) => state.camera)
    console.log(camera.position)

    useFrame((state) => {
        if (!body.current) return;
        if (useXR.getState().mode === "immersive-vr") return;
        // update camera
        const position = vec3(body.current.translation())
        state.camera.position.set(position.x, position.y, position.z)
        const velocity = body.current.linvel()
        // movement
        let { forward, backward, left, right, jump } = get()
        frontVector.set(0, 0, Number(backward) - Number(forward))
        sideVector.set(Number(left) - Number(right), 0, 0)

        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
        body.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)
        // // jumping
        const world = rapier.world
        const ray = world.castRay(new RAPIER.Ray(body.current.translation(), { x: 0, y: -1, z: 0 }), 0.05, true)
        const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
        if (jump && grounded) body.current.setLinvel({ x: 0, y: 3, z: 0 }, true)
    })

    return (
        <>
            <ambientLight intensity={10} position={[0, 0.85, 0]} />
            <directionalLight intensity={10} position={[1, 1, 1]} />
            <RatioImage url="https://i.imgur.com/MVZJ0Bw.jpeg" />
            <RigidBody ref={body} colliders={false} restitution={0.1} enabledRotations={[false, false, false]}>
                <CapsuleCollider
                    args={[0.75, 0.5]}
                    mass={1}
                >
                    <ImmersiveSessionOrigin position={[0, -0.5, 0]}>
                        {
                            inputSources.map(inputSource => <InputSource key={getInputSourceId(inputSource)} inputSource={inputSource} body={body} />)
                        }
                    </ImmersiveSessionOrigin>
                </CapsuleCollider>
            </RigidBody >
        </>
    )
}