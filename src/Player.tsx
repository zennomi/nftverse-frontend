import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RapierRigidBody, RigidBody, useRapier, vec3 } from "@react-three/rapier"

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export function Player() {
    const ref = useRef<RapierRigidBody>(null)
    const rapier = useRapier()
    const [, get] = useKeyboardControls()
    useFrame((state) => {
        if (!ref.current) return;
        const { forward, backward, left, right, jump } = get()
        const velocity = ref.current.linvel()
        const position = vec3(ref.current.translation())
        // update camera
        state.camera.position.set(position.x, position.y, position.z)
        // movement
        frontVector.set(0, 0, Number(backward) - Number(forward))
        sideVector.set(Number(left) - Number(right), 0, 0)
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
        ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)
        // // jumping
        const world = rapier.world
        const ray = world.castRay(new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }), 0.05, true)
        const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
        if (jump && grounded) ref.current.setLinvel({ x: 0, y: 3, z: 0 }, true)
    })
    return (
        <>
            <RigidBody ref={ref} colliders={false} mass={1} type="dynamic" position={[0, 4, 0]} enabledRotations={[false, false, false]}>
                <CapsuleCollider args={[0.75, 0.5]} />
            </RigidBody>
        </>
    )
}
