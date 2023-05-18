import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 300})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//Galaxy
const parameters = {
    count : 100000,
    radius: 5,
    size: 0.01,
    branches: 3,
    spin: 1,
    randomness : 0.02,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
}

let galaxyGeometry = null
let galaxyMaterial = null
let particles = null
//Galaxy Function
const generateGalaxy = ()=>{

    if(particles !== null){
        galaxyGeometry.dispose()
        galaxyMaterial.dispose()
        scene.remove(particles)
    }

    galaxyGeometry = new THREE.BufferGeometry();
    galaxyMaterial = new THREE.PointsMaterial();
    particles = new THREE.Points(galaxyGeometry, galaxyMaterial)
    
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)

    
    for(let i = 0; i < parameters.count; i++){
        
        //position
        const i3 = i*3;

        const lineRadius = Math.random()*parameters.radius
        const branchAngle = (i % parameters.branches) / parameters.branches *Math.PI*2
        const spinAngle = lineRadius*parameters.spin

        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) 
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) 
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) 

        positions[i3+ 0] = Math.cos(branchAngle + spinAngle)*lineRadius + randomX
        positions[i3+ 1] = randomY
        positions[i3+ 2] = Math.sin(branchAngle + spinAngle)*lineRadius+ randomZ

        //colors
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor , lineRadius / parameters.radius)

        colors[i3  ] = mixedColor.r
        colors[i3+1] = mixedColor.g
        colors[i3+2] = mixedColor.b

    }
    
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    galaxyMaterial.size = parameters.size
    galaxyMaterial.sizeAttenuation = true
    galaxyMaterial.depthWrite= true
    galaxyMaterial.blending = THREE.AdditiveBlending
    galaxyMaterial.vertexColors = true
    
    scene.add(particles);

}

generateGalaxy()


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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Debug Panel

gui.add(parameters, "count").min(1000).max(150000).name("No of stars").step(100).onFinishChange(generateGalaxy)
gui.add(parameters, "radius").min(0.1).max(20).name("Radius").step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, "size").min(0.01).max(0.1).name("Size of stars").step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, "branches").min(2).max(20).name("No of branches").step(1).onFinishChange(generateGalaxy)
gui.add(parameters, "spin").min(-5).max(5).name("Spin").step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, "randomness").min(0).max(2).name("Randomness").step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, "randomnessPower").min(1).max(10).name("RandomnessPower").step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, "insideColor").name("Inside Color").onFinishChange(generateGalaxy)
gui.addColor(parameters, "outsideColor").name("Outside Color").onFinishChange(generateGalaxy)

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

    particles.rotation.y = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()