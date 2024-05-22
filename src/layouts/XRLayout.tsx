import '../App.css'
import { Environment, KeyboardControls, } from '@react-three/drei'
import { XRCanvas } from '@coconut-xr/natuerlich/defaults';

import { Leva } from 'leva';
import { MouseEventHandler } from 'react';
import { useAppContext } from '../contexts/AppProvider';
import { Outlet } from 'react-router-dom';
import EnterVRButton from '../components/EnterVRButton';

function XRLayout() {
    const { toggleMainMenu, evnPreset, setOpenMainMenu } = useAppContext()
    const handleRightClick: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault()
        if (event.button === 2) {
            toggleMainMenu();
        }
    };

    return (
        <div className="XR" onContextMenu={handleRightClick}>
            <Leva />
            <EnterVRButton />
            <div className="dot" />
            <KeyboardControls
                map={[
                    { name: "forward", keys: ["ArrowUp", "w", "W"] },
                    { name: "backward", keys: ["ArrowDown", "s", "S"] },
                    { name: "left", keys: ["ArrowLeft", "a", "A"] },
                    { name: "right", keys: ["ArrowRight", "d", "D"] },
                    { name: "jump", keys: ["Space"] },
                    { name: "menu", keys: ["M", "m"] },
                    { name: "navigator", keys: ["N", "n"] },
                    { name: "esc", keys: ["Escape"] }
                ]}
                onChange={(name, pressed,) => {
                    if (name === "menu" && pressed) toggleMainMenu();
                    if (name === "esc" && pressed) setOpenMainMenu(false);
                }}
            >
                <XRCanvas shadows camera={{ position: [0, 0, 5], rotation: [0, Math.PI / 2, 0], fov: 75 }} gl={{ localClippingEnabled: true }}>
                    {
                        evnPreset &&
                        <Environment preset={evnPreset} />
                    }
                    <Outlet />
                </XRCanvas>
            </KeyboardControls>
        </div>
    )
}

export default XRLayout
