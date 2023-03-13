import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import PrototypeLoader from "../Prototype/PrototypeLoader";

export default class GameWorld {
    prototypeLoader
    loadingManager
    textureLoader
    SCENE
    dgui
    modelLoader
    Entities = []
    ScreenSize
    window
    debug
    renderer

    InitWorld(_scene, renderer, debugGui, cam, doc, screensize, window, debug) {
        this.debug = debug;
        if (debug)
            this.dgui = debugGui;
        this.renderer = renderer;

        this.SCENE = _scene
        this.camera = cam;
        this.ScreenSize = screensize;
        this.document = doc;
        this.window = window;
        this.loadingManager = new THREE.LoadingManager(this.OnLoad(), (itemUrl, itemsLoaded, itemsTotal) => {
            this.OnLoadProcess(itemUrl, itemsLoaded, itemsTotal)
        });
        this.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.modelLoader = new GLTFLoader(this.loadingManager);
        this.prototypeLoader = new PrototypeLoader();

    }

    OnLoad() {

    }

    OnLoadProcess(itemUrl, itemsLoaded, itemsTotal) {
        const progressRatio = itemsLoaded / itemsTotal
    }

    UpdateWorld(delta) {
        if (!this.document.hasFocus())
            return;
        this.Entities.forEach(x => {
            x.Update(delta)
        });
    }

    loadTexture(path, endAction) {

        return this.textureLoader.load(path, endAction)
    }

    AddDGui(parameter, property) {
        return this.dgui.add(parameter, property)
    }

    LoadGltfModel(path, e) {
        this.modelLoader.load(path, e);
    }

    AddEntityToTheWorld(newEntity) {
        this.SCENE.add(newEntity.transform)
        this.Entities.push(newEntity);
    }

    RemoveEntityFromTheWorld(EntityToRemove) {
        this.Entities.splice(this.Entities.indexOf(EntityToRemove), 1)
    }
}