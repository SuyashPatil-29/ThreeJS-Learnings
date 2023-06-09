import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load("/textures/particles/9.png")
const numVertices = 20000; // Number of vertices
const radius = 10; // Maximum distance from the origin
const particlesGeometry = new THREE.BufferGeometry();

// Generate random positions
const positions = new Float32Array(numVertices*3);
const colors = new Float32Array(numVertices*3);


for (let i = 0; i < numVertices; i++) {
  positions[i] = (Math.random()-0.5) * radius
  colors[i] = Math.random()
}

particlesGeometry.setAttribute(  
    "position", 
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(  
    "color",  
    new THREE.BufferAttribute(colors, 3)
)

// Create a material
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture
particlesMaterial.size = 0.05
particlesMaterial.sizeAttenuation = true;
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

// Create a points object and add it to the scene
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

console.log(particlesGeometry.attributes.position.array)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update Particles

    for (let i = 0; i < numVertices; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        const y = particlesGeometry.attributes.position.array[i3+1];
        const z = particlesGeometry.attributes.position.array[i3+2];
        // particlesGeometry.attributes.position.array[i3+1] = y + Math.sin(elapsedTime + x + z)
    }
    
    particlesGeometry.attributes.position.needsUpdate = true;

    // particlesGeometry.attributes.position.array
    // particles.rotation.x = elapsedTime * 0.2
    // particles.rotation.y = elapsedTime * 0.5
     

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()