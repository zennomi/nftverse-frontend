import '../App.css'
import { Environment, } from '@react-three/drei'
import { XRCanvas } from '@coconut-xr/natuerlich/defaults';

import { Leva } from 'leva';
import { MouseEventHandler } from 'react';
import { useAppContext } from '../contexts/AppProvider';
import { Outlet } from 'react-router-dom';
import EnterVRButton from '../components/EnterVRButton';
import { Keyboard } from '../components/Keyboard';
import { useStore } from '../hooks/store';

function XRLayout() {
    const { evnPreset, } = useAppContext()
    const onToggleMenu = useStore(({ actions: { onToggleMenu } }) => onToggleMenu)
    const handleRightClick: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault()
        if (event.button === 2) {
            onToggleMenu();
        }
    };

    return (
        <div className="XR" onContextMenu={handleRightClick}>
            <Leva />
            <EnterVRButton />
            <Keyboard />
            <div className="dot" />
            <XRCanvas shadows camera={{ position: [0, 0, 5], rotation: [0, Math.PI / 2, 0], fov: 75 }} gl={{ localClippingEnabled: true }}>
                {
                    evnPreset &&
                    <Environment preset={evnPreset} />
                }
                <Outlet />
            </XRCanvas>
        </div>
    )
}

export default XRLayout
