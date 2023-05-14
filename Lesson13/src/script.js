import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')


 const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',

    (font) =>
    {

        const textGeometry = new TextGeometry( 'RCB LUND BHI NAHI HOGA', {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
        }
        );
        textGeometry.center();

        const textMaterial = new THREE.MeshMatcapMaterial();
        const text = new THREE.Mesh( textGeometry, textMaterial );
        // text.position.set(-2,0,-0.125);
        textMaterial.matcap = matcapTexture;
        scene.add( text );

    }
    )
     
//Axes Helper

// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

/**
 * Object
 */
const donutGeometry = new THREE.TorusGeometry(0.3,0.2,32,64)
const donutMaterial = new THREE.MeshMatcapMaterial()  
donutMaterial.matcap = matcapTexture 


console.time("donuts");
for(let i=0; i<200; i++){
    const donut = new THREE.Mesh(
        donutGeometry,
        donutMaterial
    )
    
    donut.material.matcap = matcapTexture
    scene.add(donut)
    donut.position.x = (Math.random() - 0.5) * 15
    donut.position.y = (Math.random() - 0.5) * 15
    donut.position.z = (Math.random() - 0.5) * 15
    
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
}

console.timeEnd("donuts");

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()