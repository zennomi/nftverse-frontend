import { DragControls, OrbitControls, PivotControls } from "@react-three/drei"
import { useAppContext } from "../contexts/AppProvider"
import { useEffect } from "react"

export function Component() {
    const { evnPreset, setEvnPreset } = useAppContext()

    useEffect(() => {
        setEvnPreset("night")
    }, [])

    return (
        <>
            {/* <OrbitControls /> */}
            <DragControls><mesh position={[0, 2, 0]}><boxGeometry /><meshBasicMaterial color="res" /></mesh></DragControls>
        </>
    )
}