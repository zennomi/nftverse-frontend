import { NonImmersiveCamera, ImmersiveSessionOrigin } from "@coconut-xr/natuerlich/react";
import { Sky, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Outlet, useLocation } from "react-router-dom";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function XR() {
    const get = useThree((state) => state.get)
    const location = useLocation();
    useEffect(() => {
        console.log("Hellooo")
        get().camera.position.set(0, 4, 0)
    }, [location]);

    return (
        <>
            <Sky sunPosition={[100, 20, 100]} />
            <Physics>
                <Outlet />
                <Ground />
                <Player />
            </Physics>
            <PointerLockControls />
            <NonImmersiveCamera position={[0, 4, 0]} />
            <ImmersiveSessionOrigin />
        </>
    )
}