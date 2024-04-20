export const skyboxVertShader = /* glsl */ `
precision highp float; 

varying vec2 vUv;
varying vec4 vPosition;


void main(){
    vUv = uv;
    gl_Position = vec4(position, 1.0);
    vPosition = vec4(position, 1.0);
    gl_Position.z = 1.;
}
`

export const skyboxFragShader = /* glsl */ `

precision highp float; 

varying vec2 vUv;
varying vec4 vPosition;

uniform float uTime;
uniform float uNightMode;
uniform float uYpow;
uniform mat4 uViewDirProjInverse;

uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColorNight0;
uniform vec3 uColorNight1;

const vec2 invAtan = vec2(0.1591, 0.3183);
vec2 SampleSphericalMap(vec3 direction)
{
    vec2 uv = vec2(atan(direction.z, direction.x), asin(direction.y));
    uv *= invAtan;
    uv += 0.5;
    uv.y = 1. - uv.y;
    return uv;
}

void main() { 

    vec4 d = uViewDirProjInverse * vPosition;
    vec3 dir = normalize(d.xyz / d.w);
    vec2 uv = SampleSphericalMap(dir);

    vec3 color = mix(
        mix(uColor0, uColorNight0, uNightMode), 
        mix(uColor1, uColorNight1, uNightMode), 
        smoothstep(.3, .7, uv.y));
    gl_FragColor = vec4(color, 1.); 
} 
    
`