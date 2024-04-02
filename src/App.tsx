import './App.css'
import { KeyboardControls, } from '@react-three/drei'
import {
  useEnterXR
} from "@coconut-xr/natuerlich/react";
import { XRCanvas } from '@coconut-xr/natuerlich/defaults';

import XR from './XR';
import { Leva } from 'leva';

const sessionOptions: XRSessionInit = {
  requiredFeatures: ["local-floor"]
};

function App() {
  const enterVR = useEnterXR("immersive-vr", sessionOptions);
  return (
    <div className="App">
      <Leva />
      <div className="dot" />
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}>
        <XRCanvas shadows camera={{ fov: 45 }}>
          <XR />
        </XRCanvas>
      </KeyboardControls>
    </div>
  )
}

export default App
