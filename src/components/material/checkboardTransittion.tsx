import { shaderMaterial } from "@react-three/drei";

export const CheckboardTransitionMaterial = shaderMaterial(
  {
    progression: 1,
    tex: null,
    tex2: null,
    tMixTexture: null,
    transition: 0,
    useTexture: 1,
    threshold: 0.1,
  },
  /*glsl*/ `
  varying vec2 vUv;
  void main() {
  vUv = vec2( uv.x, uv.y );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,
  /*glsl*/ `
uniform float progression;
uniform sampler2D tex;
uniform sampler2D tex2;
uniform sampler2D tMixTexture;
uniform int useTexture;
uniform float threshold;
varying vec2 vUv;
void main() {
	vec4 texel1 = texture2D( tex2, vUv );
	vec4 texel2 = texture2D( tex, vUv );
	if (useTexture==1) {
		vec4 transitionTexel = texture2D( tMixTexture, vUv );
		float r = progression * (1.0 + threshold * 2.0) - threshold;
		float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);
		gl_FragColor = mix( texel1, texel2, mixf );
	} else {
		gl_FragColor = mix( texel2, texel1, progression );
	}
	// #include <tonemapping_fragment>
	// #include <colorspace_fragment>
}`
);