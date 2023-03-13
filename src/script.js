import './style.css'
import * as THREE from 'three'
import GameWorld from "./Engine/Core/GameWorld";
import * as dat from "lil-gui" 
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import Entity from "./Engine/Core/Entity";
import Utilities from "./Engine/Utilities";
import {gsap} from "gsap/gsap-core";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import LevelManager from "./Core/LevelManager";
 
const loadingManager = new THREE.LoadingManager();


loadingManager.onStart = () => {
    console.log("On Start")
}
loadingManager.onLoad = () => {
    console.log("On load")
}
loadingManager.onProgress = () => {
    console.log("OnProgress")
}


const textureLoader = new THREE.TextureLoader(loadingManager);


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material = new THREE.MeshStandardMaterial()

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const ScreenSize = {
    width: window.innerWidth,
    height: window.innerHeight,
    PixelRatio:window.devicePixelRatio,
    
} 
window.addEventListener('resize', () => {
    // Update sizes
    ScreenSize.width = window.innerWidth
    ScreenSize.height = window.innerHeight

    // Update camera
    camera.aspect = ScreenSize.width / ScreenSize.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(ScreenSize.width, ScreenSize.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
   
}) 
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, ScreenSize.width / ScreenSize.height, 0.1, 100)
//const camera = new THREE.OrthographicCamera(sizes.width/-75,sizes.width/75,sizes.height/75,sizes.height/-75,1,1000)
camera.position.x = 0
camera.position.y = 15
camera.position.z = -17.5

const camRoot = new THREE.Group();
camera.lookAt(camRoot.position)
camRoot.add(camera)
//camRoot.rotateY(-45)
scene.add(camRoot)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(ScreenSize.width, ScreenSize.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()


function setupKeyLogger() {
    document.onkeydown = function (e) {
        console.log(e.keyCode);
    }
}

setupKeyLogger()

const debug = window.location.hash === '#debug';
const gui = new dat.GUI()
if (!debug)
    gui.hide()
const gameworld = new GameWorld();
gameworld.InitWorld(scene,renderer, gui, camera, document, ScreenSize, window, debug)  
 
const levelmanager = Utilities.SpawnWithComponent('Levelmanager',LevelManager,gameworld);
levelmanager.StartLevel();



const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false 

const ambientParameters = {
    color: '#9AFE7A',
    intensity: 1
}  
let then = 0;
let lastframeTime=0;
const tick = (now) => {

 

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastframeTime; 
    lastframeTime = elapsedTime;
    gameworld.UpdateWorld(deltaTime)
    TWEEN.update()


    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)

}

tick(1)


