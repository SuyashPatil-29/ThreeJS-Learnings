import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import CANNON from "cannon"

/**
 * Debug
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

//Physics World 

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const objectsToUpdate = []

//Contct Material

const defaultMaterial = new CANNON.Material("default")

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
    })
    
    world.addContactMaterial(defaultContactMaterial)
    world.defaultContactMaterial = defaultContactMaterial

  //Body in cannonJS (Sphere)

  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const sphereMaterial = new THREE.MeshStandardMaterial({
                            metalness : 0.3,
                            roughness: 0.4,
                            envMap: environmentMapTexture,
                        }
)

  const createSphere = (radius, position)=>{
      
      //Spheres 
      
      const mesh = new THREE.Mesh( sphereGeometry, sphereMaterial)

        mesh.castShadow = true;
        mesh.scale.set(radius, radius, radius)
        mesh.position.copy(position)
        scene.add(mesh)
        
        //Cannon Sphere
        
      const sphereShape = new CANNON.Sphere(radius)

      const sphereBody = new CANNON.Body({
          mass: 1,
          position: new CANNON.Vec3(0,3,0),
          shape : sphereShape
        })
      sphereBody.position.copy(position)
      world.addBody(sphereBody)

      objectsToUpdate.push({
        mesh,
        body : sphereBody
      })
    } 
    
    
    scene.background = environmentMapTexture
    
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
  })

  const boxGeometry = new THREE.BoxGeometry(1,1,1)
  const createBoxes = (position)=>{

    const boxMesh = new THREE.Mesh(boxGeometry, sphereMaterial)
    boxMesh.position.copy(position)
    boxMesh.material.roughness = 0.3
    boxMesh.material.metalness = 0.4
    boxMesh.castShadow = true;
    scene.add(boxMesh)

    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5))
    const boxBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0,3,3),
        shape: boxShape
  })
  boxBody.position.copy(position)
  world.addBody(boxBody)

  objectsToUpdate.push({
    mesh: boxMesh,
    body: boxBody
  })

}
  
  //floor
  
  floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1,0,0),
      Math.PI * 0.5
  ) 
   
  world.addBody(floorBody)  
 

  /**
   * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.material.side = THREE.DoubleSide
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Debug Params
const debugObjects = {
    createSpheres : ()=>{
        createSphere(0.5 , {x: (Math.random()-0.5)*3, y:3, z:(Math.random()-0.5)*3})
    },
    createBox: ()=>{
        createBoxes({x: (Math.random()-0.5)*3, y:3, z:(Math.random()-0.5)*3})
    }
}

gui.add(debugObjects, "createSpheres").name("Create Sphere")
gui.add(debugObjects, "createBox").name("Create Box")

console.log(objectsToUpdate);

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update controls
    controls.update()

    //Adding wind force 

    //Update Physics World
    world.step(1/60, deltaTime, 3)

    //Update Objects
    objectsToUpdate.map(object=>{
        object.mesh.position.copy(object.body.position)
    })

    // objectsToUpdate.map(object=>{
    //     object.body.applyForce(new CANNON.Vec3(0.5, 0, 0), object.body.position)
    // })
 
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()