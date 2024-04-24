import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { useFBO } from "@react-three/drei"
import { useMemo } from "react"
import { Text } from 'troika-three-text'

import { Slider } from "../models/Slider"
import { useControls } from "leva"
import { MODES } from "../configs/mode"
import ModeSlider from "../components/ModeSlider"

const TEXT_SPACE = 0.05

export function Component() {

    return (
        <div className="XR">
            <Canvas camera={{ position: [0, 0, 3] }} onCreated={({ gl }) => {
                gl.setClearColor(0xff0000, 0)
                // gl.clearDepth()
                // gl.autoClear = true
            }}>
                {/* <Child /> */}
                <ModeSlider mode="meebit" scale={0.05} />
            </Canvas>
        </div>
    )
}

export function Child() {
    const renderTarget = useFBO();
    const { x, mode } = useControls({ x: 0, mode: { value: MODES[0], options: MODES } })
    const { textScene, textCamera, texts, textGroup } = useMemo(() => {
        const texts = []
        const newScene = new THREE.Scene();
        const group = new THREE.Group();

        //
        // Objects
        const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

        // Materials
        const material = new THREE.MeshBasicMaterial()
        material.color = new THREE.Color(0xff0000)

        // Mesh
        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.z = -2
        group.add(sphere)

        for (const word of MODES) {
            const myText = new Text()

            // Set properties to configure:
            myText.text = word
            myText.fontSize = 0.1
            myText.position.y = 0.05
            myText.position.z = -0.1

            myText.color = new THREE.Color(0x9966FF)
            myText.font = "http://fonts.gstatic.com/s/abeezee/v9/mE5BOuZKGln_Ex0uYKpIaw.ttf"
            myText.textAlign = 'center'
            // Update the rendering:
            myText.sync()

            group.add(myText)

            texts.push({
                mesh: myText,
                x: 0,
                width: 0,
                word,
                center: 0
            })
        }

        group.scale.y = 7.5
        group.scale.z = 7.5
        newScene.add(group);

        const newCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
        return { textScene: newScene, textCamera: newCamera, texts: texts, textGroup: group }
    }, [])

    useFrame(({ gl, size, }, delta) => {
        gl.setRenderTarget(renderTarget)

        gl.render(textScene, textCamera)
        textCamera.aspect = size.width / size.height

        let currentX = 0;

        if (texts[0].width <= 0) {
            for (const text of texts) {
                text.x = currentX
                text.width = text.mesh.geometry.boundingBox.max.x
                text.center = text.x + text.width / 2
                text.mesh.position.x = currentX
                currentX += TEXT_SPACE + text.width
            }
        } else {
            const text = texts.find(t => t.word === mode)
            if (text) {
                textGroup.position.x = THREE.MathUtils.lerp(textGroup.position.x, -text.center, delta * 2)
            }
        }

        gl.setRenderTarget(null);
    })

    renderTarget.texture.wrapS = THREE.RepeatWrapping;
    renderTarget.texture.wrapT = THREE.RepeatWrapping;
    renderTarget.texture.rotation = Math.PI
    renderTarget.texture.repeat.set(-1, 1);

    return (
        <>
            <Slider scale={0.05} map={renderTarget.texture} />
        </>
    )
}