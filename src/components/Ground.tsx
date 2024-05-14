import * as THREE from "three"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useTexture } from "@react-three/drei"

export function Ground(props: any) {
    const texture = useTexture("/textures/long_white_tiles_ao_1k.jpg")
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    return (
        <RigidBody {...props} type="fixed" colliders={false}>
            <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial map={texture} map-repeat={[240, 240]} color="white" />
            </mesh>
            <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>
    )
}
