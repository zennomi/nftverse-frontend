import { getInputSourceId } from "@coconut-xr/natuerlich";
import { PointerController, TouchHand } from "@coconut-xr/natuerlich/defaults";
import { useXRGamepadReader } from "@coconut-xr/natuerlich/react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, vec3 } from "@react-three/rapier";
import { RefObject } from "react";
import * as THREE from "three"

const SPEED = 5
const vector2 = new THREE.Vector2()
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export default function InputSource({ inputSource, body }: { inputSource: XRInputSource, body: RefObject<RapierRigidBody> }) {
    const reader = useXRGamepadReader(inputSource)

    useFrame((state) => {
        if (!body.current) return;
        const position = vec3(body.current.translation())
        // update camera
        // state.camera.position.set(position.x, position.y, position.z)
        const velocity = body.current.linvel()
        // movement
        reader.readAxes("xr-standard-thumbstick", vector2)
        if (vector2.x === 0 && vector2.y === 0) return;
        frontVector.set(0, 0, vector2.y)
        sideVector.set(-vector2.x, 0, 0)

        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
        body.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)
    })

    return inputSource.hand != null ? (
        <TouchHand
            cursorOpacity={1}
            key={getInputSourceId(inputSource)}
            id={getInputSourceId(inputSource)}
            inputSource={inputSource}
            hand={inputSource.hand}
        />
    ) : (
        <PointerController
            key={getInputSourceId(inputSource)}
            id={getInputSourceId(inputSource)}
            inputSource={inputSource}
        />
    )
}