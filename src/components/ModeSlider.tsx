import * as THREE from "three"
import { GroupProps, useFrame } from "@react-three/fiber"
import { useFBO } from "@react-three/drei"
import { useMemo } from "react"
import { Text, } from 'troika-three-text'
import { createDerivedMaterial } from "troika-three-utils"

import { Slider } from "../models/Slider"
import { MODES, MODE_CONFIG, TEXT_SPACE } from "../configs/mode"

export default function ModeSlider({ mode, prevMode, ...props }: GroupProps & { mode: keyof typeof MODE_CONFIG, prevMode: keyof typeof MODE_CONFIG }) {
    const renderTarget = useFBO();
    const { textScene, textCamera, texts, textGroup } = useMemo(() => {
        const texts = []
        const newScene = new THREE.Scene();
        const group = new THREE.Group();

        for (const word of MODES) {
            const myText = new Text()

            // Set properties to configure:
            myText.text = word.toUpperCase()
            myText.fontSize = 0.12
            myText.position.y = 0.07
            myText.position.z = -0.1

            // myText.font = "/fonts/FKScreamer-Black.otf"
            // myText.font = "http://fonts.gstatic.com/s/rubikmonoone/v5/e_cupPtD4BrZzotubJD7UbAREgn5xbW23GEXXnhMQ5Y.ttf"
            myText.font = "http://fonts.gstatic.com/s/anton/v7/XIbCenm-W0IRHWYIh7CGUQ.ttf"
            myText.textAlign = 'center'
            myText.strokeColor = "white"
            myText.strokeWidth = 0.001
            // Update the rendering:
            // myText.color = new THREE.Color("#3433a5")
            // myText.material = GradientShader({ color2: new THREE.Color("#ff6dfb"), color1: new THREE.Color("#670bff") })
            myText.material = GradientShader({ color2: new THREE.Color(...MODE_CONFIG[word].colorTop), color1: new THREE.Color(...MODE_CONFIG[word].colorBottom) })
            // myText.color = "white"
            // myText.material = new THREE.MeshBasicMaterial({color: new THREE.Color(...MODE_CONFIG[word].colorBottom)})
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


        if (texts[0].width <= 0) {
            let currentX = 0;
            for (const text of texts) {
                text.x = currentX
                text.width = text.mesh.geometry.boundingBox.max.x
                text.center = text.x + text.width / 2
                text.mesh.position.x = currentX
                currentX += TEXT_SPACE + text.width
            }
        } else {
            const text = texts.find(t => t.word === mode)
            const prevModeText = texts.find(t => t.word === prevMode)
            if (prevMode !== mode) {
                if (prevModeText) {
                    let direction = textCamera.position.x > prevModeText.center ? 0 : 1 // 0: wipe from right to left
                    let progress = direction === 0 ?
                        textCamera.position.x - 0.23 > prevModeText.x + prevModeText.width ? 1 : ((textCamera.position.x - 0.23) - prevModeText.x) / prevModeText.width
                        :
                        textCamera.position.x + 0.23 < prevModeText.x ? 0 : (textCamera.position.x + 0.23 - prevModeText.x) / prevModeText.width
                    if (prevModeText.mesh.material instanceof Array) {
                        prevModeText.mesh.material[1].uniforms.uProgress.value = progress
                        prevModeText.mesh.material[1].uniforms.uDirection.value = direction
                    } else {
                        prevModeText.mesh.material.uniforms.uProgress.value = progress
                        prevModeText.mesh.material.uniforms.uDirection.value = direction
                    }
                }
            }
            if (text) {
                let direction = textCamera.position.x > text.center ? 0 : 1 // 0: wipe from right to left
                let progress = direction === 0 ?
                    textCamera.position.x - 0.23 < text.x ? 0 : (textCamera.position.x - 0.23 - text.x) / text.width
                    :
                    textCamera.position.x + 0.23 > text.x + text.width ? 1 : (textCamera.position.x + 0.23 - text.x) / text.width
                textCamera.position.x = THREE.MathUtils.lerp(textCamera.position.x, text.center, delta)
                if (text.mesh.material instanceof Array) {
                    text.mesh.material[1].uniforms.uProgress.value = progress
                    text.mesh.material[1].uniforms.uDirection.value = direction
                } else {
                    text.mesh.material.uniforms.uProgress.value = progress
                    text.mesh.material.uniforms.uDirection.value = direction
                }
            }
        }

        gl.setRenderTarget(null);
    })

    renderTarget.texture.wrapS = THREE.RepeatWrapping;
    renderTarget.texture.wrapT = THREE.RepeatWrapping;
    renderTarget.texture.rotation = Math.PI
    renderTarget.texture.repeat.set(-1, 1);

    return (
        <group {...props}>
            <Slider map={renderTarget.texture} />
        </group>
    )
}

export function GradientShader({ color2, color1, }: { color2: THREE.Color, color1: THREE.Color }) {
    return createDerivedMaterial(
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, toneMapped: false }),
        {
            uniforms: {
                // Total width of the text, assigned on synccomplete
                uProgress: { value: 1 },
                uDirection: { value: 0 },
                color1: { value: color1 },
                color2: { value: color2 },
            },
            vertexDefs: `
                varying vec2 vUv;
              `,
            vertexMainOutro: `
                vUv = uv;
              `,
            fragmentDefs: `
              varying vec2 vUv;
      
              uniform vec3 color1;
              uniform vec3 color2;
              uniform float uProgress;
              uniform float uDirection;
              `,
            fragmentMainOutro: `
            vec3 mixCol = mix( color2, color1, vUv.y );

            float threhold;
            if (vUv.x <= 0.5) {
                threhold = smoothstep(0.0, 0.5, vUv.x) * 0.2;
            } else {
                threhold = smoothstep(0.0, 0.5, 1.0 - vUv.x) * 0.2;
            }
            float alpha; 
            if (vUv.x <= uProgress - threhold) {
                 alpha = 0.0;
            } else if (vUv.x > uProgress - threhold && vUv.x < uProgress + threhold) {
                alpha = smoothstep(uProgress - threhold, uProgress + threhold, vUv.x);
            } else  if (vUv.x >= uProgress + threhold) {
                alpha = 1.0;
            }
            
            if (uDirection > 0.0) alpha = 1.0 - alpha;
            
            gl_FragColor = vec4(mixCol, alpha);
              `,
        }
    )
}