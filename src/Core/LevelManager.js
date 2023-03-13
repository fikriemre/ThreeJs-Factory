import Component from "../Engine/Core/Component";
import {
    BoxGeometry,
    Mesh,
    MeshStandardMaterial,
    Color,
    DirectionalLight,
    PlaneGeometry,
    MeshLambertMaterial,
    DirectionalLightHelper,
    BackSide,
    SphereGeometry,
    ShaderMaterial,
    sRGBEncoding,
    HemisphereLight,
    HemisphereLightHelper, Fog, PCFSoftShadowMap
} from "three";
import SkySphereVertex from '../Shaders/SkySphere/vertex.glsl'
import SkySphereFragment from '../Shaders/SkySphere/fragment.glsl'
import Utilities from "../Engine/Utilities";
import PlayerController from "../Player/PlayerController";
import MaterialDatabase from "./MaterialDatabase";
import ModelDatabase from "./ModelDatabase";

export default class LevelManager extends Component {
    camera
    playercontroller
    StartLevel() {
        
        let renderer = this.world.renderer;
        renderer.antialias=true;
        //renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMapType = PCFSoftShadowMap
        renderer.outputEncoding = sRGBEncoding;
        renderer.shadowMap.enabled = true;
        
        
        
        this.materialDatabase = new MaterialDatabase();
        this.world.materialDatabase = this.materialDatabase;
        this.materialDatabase.world = this.world;
        this.materialDatabase.levelmanager = this;
     
        this.materialDatabase.LoadMaterials();
        this.modelDatabase = new ModelDatabase();
        this.world.modelDatabase = this.modelDatabase;
        this.modelDatabase.world = this.world;
        this.modelDatabase.levelmanager = this;
        this.modelDatabase.LoadDatabase(); 
        
        

        const hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 50, 0 );
        this.transform.add( hemiLight );

        const hemiLightHelper = new HemisphereLightHelper( hemiLight, 10 );
        this.transform.add( hemiLightHelper );
        
        const dirLight = new DirectionalLight( 0xffffff, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( - 1, 1.75, 1 );
        dirLight.position.multiplyScalar( 30 );
        this.transform.add( dirLight );

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        const d = 50;

        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;

        dirLight.shadow.camera.far = 3500;
        //dirLight.shadow.bias = - 0.00001;
        dirLight.shadow.bias = - 0.00005;

        const dirLightHelper = new DirectionalLightHelper( dirLight, 10 );
        this.transform.add( dirLightHelper );

        // GROUND

        const groundGeo = new PlaneGeometry( 100, 100 );
        const groundMat = new MeshLambertMaterial( { color: 0xffffff } );
        groundMat.color.setHSL( 0.095, 1, 0.75 );

        const ground = new Mesh( groundGeo, groundMat );
        ground.position.y = 0;
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        ground.name='ground'
        this.transform.add( ground );

        // SKYDOME 
        this.entitiy.world.SCENE.background = new Color().setHSL( 0.6, 0, 1 );
        this.entitiy.world.SCENE.fog = new Fog( this.entitiy.world.SCENE.background, 1, 5000 );
        const uniforms = {
            'topColor': { value: new Color( 0x0077ff ) },
            'bottomColor': { value: new Color( 0xffffff ) },
            'offset': { value: 33 },
            'exponent': { value: 0.6 }
        };
        uniforms[ 'topColor' ].value.copy( hemiLight.color );

        this.entitiy.world.SCENE.fog.color.copy( uniforms[ 'bottomColor' ].value );

        const skyGeo = new SphereGeometry( 4000, 32, 15 );
        const skyMat = new ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: SkySphereVertex,
            fragmentShader: SkySphereFragment,
            side: BackSide
        } );

        const sky = new Mesh( skyGeo, skyMat );
        this.transform.add( sky );

      

        // STATS
/*
        stats = new Stats();
        container.appendChild( stats.dom );*/

        const geo = new BoxGeometry(1, 1, 1);
        const mat = new MeshStandardMaterial({
                color: new Color(1, 1, 1)
            }
        );
        const CubeMesh = new Mesh(geo, mat);
        CubeMesh.castShadow = true;
        CubeMesh.receiveShadow = true;
        CubeMesh.position.y=.5;
        this.transform.add(CubeMesh);
        
        this.playercontroller=Utilities.SpawnWithComponent('PlayerController',PlayerController,this.entitiy.world)
        this.playercontroller.levelmanager=this;
        this.playercontroller.StartPlayer();
    }
    Update(delta)
    { 
        this.materialDatabase.Update(delta);
    }
}