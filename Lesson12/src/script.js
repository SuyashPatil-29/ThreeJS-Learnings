import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from "lil-gui"

const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const environmentMapTexture =new THREE.CubeTextureLoader()
.setPath( 'textures/environmentMaps/0/' )
.load( [
    'px.jpg',
    'nx.jpg',
    'py.jpg',
    'ny.jpg',
    'pz.jpg',
    'nz.jpg',
] );

scene.background = environmentMapTexture
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//Textures 
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter

const matcapTexture = textureLoader.load('/textures/matcaps/8.png')

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

//Materials

doorColorTexture.minFilter = THREE.NearestFilter

//Materials
// const material = new THREE.MeshPhysicalMaterial()
// material.roughness = 0.7
// material.metalness = 0.2
// material.gradientMap = gradientTexture
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture

const material = new THREE.MeshStandardMaterial()
material.roughness = -1
material.metalness = 1
material.envMap = environmentMapTexture

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64), material
)
sphere.position.x = - 1.5
sphere.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(sphere.geometry.attributes.uv.array, 2))
scene.add(sphere)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1 ,100, 100), material
)

plane.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2))
console.log(plane.geometry.attributes.uv.array);

scene.add(plane)
//i want to see both the sides of the plane
material.side = THREE.DoubleSide

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128), material
)
torus.position.x = 1.5
torus.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(torus.geometry.attributes.uv.array, 2))
scene.add(torus)

//Debug panel
gui.add(material, "metalness").min(0).max(2).step(0.001)
gui.add(material, "roughness").min(-1).max(1).step(0.001)
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.001)
gui.add(material, "displacementScale").min(0).max(1).step(0.001)

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
camera.position.x = 1
camera.position.y = 1
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //rotate objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.2 * elapsedTime
    torus.rotation.y = 0.4 * elapsedTime

    sphere.rotation.x = 0.1 * elapsedTime
    plane.rotation.x = 0.2 * elapsedTime
    torus.rotation.x = 0.4 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()