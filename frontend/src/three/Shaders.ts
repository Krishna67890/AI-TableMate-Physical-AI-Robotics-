import * as THREE from 'three';

// 1. Table Optical Perception Scan Shader
export const ScanPlaneShader = {
  uniforms: {
    uTime: { value: 0 },
    uScanY: { value: 0 },
    uColor: { value: new THREE.Color(0x00F0FF) },
    uLineWidth: { value: 0.08 },
    uOpacity: { value: 0.6 }
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uScanY;
    uniform vec3 uColor;
    uniform float uLineWidth;
    uniform float uOpacity;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      // Distance from scanning wavefront along Y/Z
      float dist = abs(vWorldPosition.y - uScanY);
      float line = smoothstep(uLineWidth, 0.0, dist);

      // Fine holographic scanline grid pattern
      float scanlines = sin(vWorldPosition.x * 120.0) * 0.5 + 0.5;
      float scanIntensity = line * (0.6 + 0.4 * scanlines);

      // Edge fading
      float edgeAlpha = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x) *
                        smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);

      gl_FragColor = vec4(uColor * 1.5, scanIntensity * uOpacity * edgeAlpha);
    }
  `
};

// 2. Technical Infinite Grid with Distance Fog
export const TechGridShader = {
  uniforms: {
    uGridSize: { value: 1.0 },
    uLineWidth: { value: 0.04 },
    uColor1: { value: new THREE.Color(0x090C10) },
    uColor2: { value: new THREE.Color(0x00F0FF) },
    uFadeDistance: { value: 6.0 }
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uGridSize;
    uniform float uLineWidth;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uFadeDistance;
    varying vec3 vWorldPosition;

    void main() {
      vec2 coord = vWorldPosition.xz / uGridSize;
      vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
      float line = min(grid.x, grid.y);
      float c = 1.0 - min(line, 1.0);

      // Distance fog falloff
      float dist = length(vWorldPosition.xz);
      float fog = clamp((uFadeDistance - dist) / uFadeDistance, 0.0, 1.0);

      vec3 finalColor = mix(uColor1, uColor2, c * 0.4);
      gl_FragColor = vec4(finalColor, fog * 0.35);
    }
  `
};

// 3. Holographic End-Effector Energy Field
export const GripperGlowShader = {
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 1.0 },
    uGlowColor: { value: new THREE.Color(0x00FF88) }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uGlowColor;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = dot(normal, viewDir);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 2.5);

      float pulse = 0.8 + 0.2 * sin(uTime * 8.0);
      gl_FragColor = vec4(uGlowColor, fresnel * pulse * uIntensity);
    }
  `
};
