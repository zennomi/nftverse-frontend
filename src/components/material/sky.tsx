import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei";
import { skyboxFragShader, skyboxVertShader } from "../../assets/glsl/skybox";

export const SkyShaderMaterial = shaderMaterial(
    {
        uColor0: new THREE.Color(0x000000),
        uColor1: new THREE.Color(0x000000),
        uColorNight0: new THREE.Color(0x000000),
        uColorNight1: new THREE.Color(0x000000),
        uNightMode: 0,
        uYpow: 1,
        uTime: 0,
        uViewDirProjInverse: [
            0.466307669878006,
            0,
            0,
            0,
            0,
            0.4624166488647461,
            -0.060114167630672455,
            5.512794132300769e-8,
            0,
            0,
            0,
            -49.99949645996094,
            0,
            -0.12891525030136108,
            -0.9916556477546692,
            50.0004997253418
        ]
    },
    skyboxVertShader,
    skyboxFragShader
);