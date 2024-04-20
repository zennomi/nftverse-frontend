import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei";
import { groundFragShader, groundVertShader } from "../../assets/glsl/ground";
import { groundPrideFragShader, groundPrideVertShader } from "../../assets/glsl/groundPride";
import { hexToRGB } from "../../utils/color";

export const GroundShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color(0x000000),
        uColorNight: new THREE.Color(0x000000),
        uColorTiles: new THREE.Color(0x000000),
        uGrid: 0,
        uFadeDistance: 0,
        uProgressSpace: 0,
        uProgressDance: 0,
        uProgressMulti: 0,
        uProgressBall: 0,
        uProgressLoading: 0,
    },
    groundVertShader,
    groundFragShader
);

export const GroundPrideShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color(0x000000),
        uColorNight: new THREE.Color(0x000000),
        uColorTiles: new THREE.Color(0x000000),
        uRainbowColor0: new THREE.Color(...hexToRGB("#ff0000")),
        uRainbowColor1: new THREE.Color(...hexToRGB("#ff8d00")),
        uRainbowColor2: new THREE.Color(...hexToRGB("#ffff00")),
        uRainbowColor3: new THREE.Color(...hexToRGB("#00c100")),
        uRainbowColor4: new THREE.Color(...hexToRGB("#001b9e")),
        uRainbowColor5: new THREE.Color(...hexToRGB("#82008d")),
        uRainbowColor6: new THREE.Color(...hexToRGB("#ffabc7")),
        uRainbowColor7: new THREE.Color(...hexToRGB("#49d9ef")),
        uGrid: 0,
        uFadeDistance: 0,
        uProgressSpace: 0,
        uProgressDance: 0,
        uProgressMulti: 0,
        uProgressBall: 0,
        uProgressLoading: 0,
    },
    groundPrideVertShader,
    groundPrideFragShader
);