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
      <button onClick={() => enterVR()}>Enter VR</button>
      <div className="dot" />
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}>
        <XRCanvas shadows camera={{ position: [0, 5, 0], rotation: [0, Math.PI / 2, 0] }}>
          <XR />
        </XRCanvas>
      </KeyboardControls>
    </div>
  )
}

export default App
