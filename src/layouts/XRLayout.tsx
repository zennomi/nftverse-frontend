import '../App.css'
import { KeyboardControls, } from '@react-three/drei'
import { XRCanvas } from '@coconut-xr/natuerlich/defaults';

import XR from '../layouts/XR';
import { Leva } from 'leva';
import { MouseEventHandler } from 'react';
import { useAppContext } from '../contexts/AppProvider';

function XRLayout() {
    const { toggleMainMenu } = useAppContext()
    const handleRightClick: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault()
        if (event.button === 2) {
            toggleMainMenu();
        }
    };

    return (
        <div className="XR" onContextMenu={handleRightClick}>
            <Leva />
            <div className="dot" />
            <KeyboardControls
                map={[
                    { name: "forward", keys: ["ArrowUp", "w", "W"] },
                    { name: "backward", keys: ["ArrowDown", "s", "S"] },
                    { name: "left", keys: ["ArrowLeft", "a", "A"] },
                    { name: "right", keys: ["ArrowRight", "d", "D"] },
                    { name: "jump", keys: ["Space"] },
                    { name: "menu", keys: ["M", "m"] }
                ]}
                onChange={(name, pressed,) => {
                    if (name === "menu" && pressed) toggleMainMenu()
                }}
            >
                <XRCanvas gl={{ localClippingEnabled: true }} shadows camera={{ position: [0, 5, 0], rotation: [0, Math.PI / 2, 0], fov: 75 }}>
                    <XR />
                </XRCanvas>
            </KeyboardControls>
        </div>
    )
}

export default XRLayout
