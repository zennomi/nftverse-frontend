import { Sky, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Outlet } from "react-router-dom";
import { Ground } from "./Ground";
import { Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";

export default function XR() {

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Sky sunPosition={[100, 20, 100]} />
            <Physics debug>
                <Outlet />
                <Ground />
            </Physics>
            <PointerLockControls />
        </Suspense>
    )
}