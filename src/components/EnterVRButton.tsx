import { useEnterXR } from "@coconut-xr/natuerlich/react"
import { sessionOptions } from "../configs/vr"

export default function EnterVRButton() {
    const enterVR = useEnterXR("immersive-vr", sessionOptions)
    return (
        <button className="enter-vr-button" onClick={() => { enterVR() }}>Enter VR</button>
    )
}