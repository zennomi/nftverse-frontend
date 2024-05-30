import { getInputSourceId } from "@coconut-xr/natuerlich";
import { PointerController, TouchHand } from "@coconut-xr/natuerlich/defaults";
import { useXRGamepadButton, useXRGamepadReader } from "@coconut-xr/natuerlich/react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { RefObject } from "react";
import * as THREE from "three"
import { setState, useStore } from "../hooks/store";

const vector2 = new THREE.Vector2()

export default function InputSource({ inputSource }: { inputSource: XRInputSource, body: RefObject<RapierRigidBody> }) {
    const inputSourceId = getInputSourceId(inputSource)
    const reader = useXRGamepadReader(inputSource)
    const { onToggleMenu, onToggleNavigator } = useStore((state) => ({ onToggleMenu: state.actions.onToggleMenu, onToggleNavigator: state.actions.onToggleNavigator }))
    useXRGamepadButton(inputSource, "a-button", () => {
        onToggleMenu()
    })

    useXRGamepadButton(inputSource, "b-button", () => {
        onToggleNavigator()
    })

    useFrame(() => {
        // movement
        reader.readAxes("xr-standard-thumbstick", vector2)
        setState((state) => ({ controls: { ...state.controls, forward: -vector2.y, backward: 0 } }))
        setState((state) => ({ controls: { ...state.controls, right: vector2.x, left: 0 } }))
    })

    return inputSource.hand != null ? (
        <TouchHand
            cursorOpacity={1}
            key={inputSourceId}
            id={inputSourceId}
            inputSource={inputSource}
            hand={inputSource.hand}
        />
    ) : (
        <PointerController
            key={inputSourceId}
            id={inputSourceId}
            inputSource={inputSource}
        />
    )
}