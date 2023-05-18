import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded',
    quantity : 1000,
}

const cursor = {
    x : 0,
    y: 0
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Textures
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg")

gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
//Objects 



//Material
const objMaterial = new THREE.MeshToonMaterial({color: parameters.materialColor})
objMaterial.gradientMap = gradientTexture



//Meshes
const objectsDistance = 4

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16 , 60),
    objMaterial
)
mesh1.position.y = -objectsDistance*0
mesh1.position.x = 2
scene.add(mesh1)


const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    objMaterial
)
mesh2.position.y = -objectsDistance*1
mesh2.position.x = -2
scene.add(mesh2)


const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    objMaterial
)
mesh3.position.y = -objectsDistance*2
mesh3.position.x = 2
scene.add(mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

const positions = new Float32Array(parameters.quantity * 3)

for(let i=0; i<=parameters.quantity; i++){
    positions[i*3    ] = (Math.random() -0.5) * 10
    positions[i*3 + 1] = objectsDistance * 0.5 - Math.random() *objectsDistance * sectionMeshes.length
    positions[i*3 + 2] = (Math.random() -0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const particleMaterial = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    color: parameters.materialColor
})

//Material
const particle = new THREE.Points(
    particleGeometry,
    particleMaterial
)

scene.add(particle)

//Lights

const directionalLight = new THREE.DirectionalLight("#ffffff" , 1)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)


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


//Camera Group 
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)


/**
 * Camera
*/
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

//Making objects rotate

let currentSection = 0

/**
 * Debug
 */


gui
    .addColor(parameters, 'materialColor')
    .onChange(()=>{
        objMaterial.color.set(parameters.materialColor)
        particleMaterial.color.set(parameters.materialColor)
    })


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Scroll 

let scrollY = window.scrollY

window.addEventListener("scroll", ()=>{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY/sizes.height)

    if (newSection != currentSection){
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation, {
                duration: 1.5,
                ease : "power2.inOut",
                x : "+=6",
                y : "+=3",
                z: "+=1.5"
            }
        )
    }
})

window.addEventListener("mousemove", (event)=>{
    cursor.x = (event.clientX / sizes.width - 0.5)
    cursor.y = -(event.clientY / sizes.height - 0.5)
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    if(currentSection == 0){
        mesh1.rotation.x = elapsedTime*0.2
        mesh1.rotation.y = elapsedTime*0.22
    }
    else if(currentSection == 1){
        mesh2.rotation.x = elapsedTime*0.2
        mesh2.rotation.y = elapsedTime*0.22
    }
    else if(currentSection == 2){
        mesh3.rotation.x = elapsedTime*0.2
        mesh3.rotation.y = elapsedTime*0.22
    }

    

    //Animate camera 
    camera.position.y = -(scrollY / sizes.height * objectsDistance)+ 0.1

    const parallaxX = cursor.x;
    const parallaxY = cursor.y;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime *0.8
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime *0.8

    // camera.position.set(cursor.x, cursor.y, 0)

    //Animate Meshes

    sectionMeshes.map((mesh)=>{
        mesh.rotation.x += deltaTime*0.2
        mesh.rotation.y += deltaTime*0.22
    })

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()