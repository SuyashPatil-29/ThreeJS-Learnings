import * as THREE from 'three'
import './style.css'

const scene = new THREE.Scene(); 

//Red Cube 

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000})
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh)
//Camera 

const {width, height} = {
    width : 800,
    height: 600,
}

const camera = new THREE.PerspectiveCamera(75, width/height);
camera.position.z = 3;
camera.position.x = 1;
camera.position.y = 1;
scene.add(camera); 

// Renderer


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas")
});

renderer.setSize(width, height);
renderer.render(scene, camera);

// // //animate


// function animate(){
//     requestAnimationFrame(animate);
//     mesh.rotation.x += 0.01;
//     mesh.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }

// animate();

// //resize

// window.addEventListener("resize", ()=>{
//     const {width, height} = {
//         width : window.innerWidth,
//         height: window.innerHeight,
//     }
//     renderer.setSize(width, height);
//     camera.aspect = width/height;
//     camera.updateProjectionMatrix();
// }

// );