<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  mouseX: { type: Number, default: 0 },
  mouseY: { type: Number, default: 0 },
})

const canvasRef = ref(null)
let renderer, scene, camera, mesh, material, clock, animId
const targetMouse = new THREE.Vector2(0.5, 0.5)
const smoothMouse = new THREE.Vector2(0.5, 0.5)

watch(() => [props.mouseX, props.mouseY], ([x, y]) => {
  targetMouse.set((x + 1) / 2, (1 - y) / 2)
})

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vDisplacement;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normal;
    float t = uTime * 0.3;
    float noise1 = snoise(position * 0.8 + t * 0.5) * 0.35;
    float noise2 = snoise(position * 1.6 + t * 0.3 + 10.0) * 0.15;
    float noise3 = snoise(position * 3.2 + t * 0.7 + 20.0) * 0.05;
    float displacement = noise1 + noise2 + noise3;
    float mouseInfluence = smoothstep(1.5, 0.0, length(position.xy - (uMouse * 2.0 - 1.0) * 1.5));
    displacement += mouseInfluence * 0.15 * sin(t * 2.0);
    vDisplacement = displacement;
    vec3 newPosition = position + normal * displacement;
    vPosition = newPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    float t = uTime * 0.15;
    vec3 color1 = vec3(0.18, 0.02, 0.42);   // deep violet
    vec3 color2 = vec3(0.0, 0.65, 0.72);     // electric teal
    vec3 color3 = vec3(0.95, 0.45, 0.1);     // warm amber
    vec3 color4 = vec3(0.77, 0.96, 0.25);    // neon lime
    vec3 color5 = vec3(0.55, 0.0, 0.85);     // bright purple

    float mixer1 = smoothstep(-0.3, 0.3, vDisplacement + sin(t + vPosition.x * 2.0) * 0.3);
    float mixer2 = smoothstep(-0.5, 0.5, sin(vPosition.y * 1.5 + t * 1.3) + vDisplacement);
    float mixer3 = smoothstep(-0.4, 0.4, cos(vPosition.z * 2.0 + t * 0.8));

    vec3 color = mix(color5, color1, mixer1);
    color = mix(color, color2, mixer2 * 0.5);
    color = mix(color, color3, mixer3 * 0.25);
    color = mix(color, color4, (1.0 - mixer1) * mixer3 * 0.3);

    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 3.0);
    color += fresnel * vec3(0.77, 0.96, 0.25) * 0.4;

    float depth = smoothstep(3.5, 1.5, length(vPosition));
    color *= depth;

    gl_FragColor = vec4(color, 0.75);
  }
`

function init() {
  const canvas = canvasRef.value
  if (!canvas) return

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, canvas.parentElement.clientWidth / canvas.parentElement.clientHeight, 0.1, 100)
  camera.position.z = 3.5

  const isMobile = window.innerWidth < 768
  const detail = isMobile ? 32 : 64
  const geometry = new THREE.IcosahedronGeometry(2.2, detail)

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  clock = new THREE.Clock()

  animate()
}

function animate() {
  animId = requestAnimationFrame(animate)
  const elapsed = clock.getElapsedTime()

  smoothMouse.lerp(targetMouse, 0.04)
  material.uniforms.uTime.value = elapsed
  material.uniforms.uMouse.value.copy(smoothMouse)
  mesh.rotation.x = Math.sin(elapsed * 0.15) * 0.2 + 0.3
  mesh.rotation.y = elapsed * 0.08

  renderer.render(scene, camera)
}

function handleResize() {
  if (!canvasRef.value || !renderer) return
  const w = canvasRef.value.parentElement.clientWidth
  const h = canvasRef.value.parentElement.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

function handleVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(animId)
  } else if (clock) {
    animate()
  }
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
  document.addEventListener('visibilitychange', handleVisibility)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('visibilitychange', handleVisibility)
  if (renderer) {
    renderer.dispose()
    material?.dispose()
    mesh?.geometry?.dispose()
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="three-bg-canvas" />
</template>

<style scoped>
.three-bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
