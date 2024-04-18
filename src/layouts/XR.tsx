import { Sky, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Outlet } from "react-router-dom";
import { Ground } from "../components/Ground";
import { Suspense } from "react";
import LoadingScreen from "../components/LoadingScreen";
import MainMenu from "../menus/MainMenu";
import ToastContainer from "../contexts/ToastContainer";

export default function XR() {

    return (
        <Suspense fallback={<LoadingScreen />}>
            <ToastContainer>
                <Sky sunPosition={[100, 20, 100]} />
                <Physics>
                    <Outlet />
                    <Ground />
                </Physics>
                <MainMenu />
                <PointerLockControls />
            </ToastContainer>
        </Suspense>
    )
}