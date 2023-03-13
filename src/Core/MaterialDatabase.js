import {
    MeshBasicMaterial,
    MeshMatcapMaterial,
    ShaderMaterial,
    Color,
    AdditiveBlending,
    RepeatWrapping,
    UniformsUtils, UniformsLib, Vector3
} from "three"; 
import LevelManager from "./LevelManager";
import Utilities from "../Engine/Utilities";

import conveyorbeltVertex from '../Shaders/ConveyorBelt/vertex.glsl'
import conveyorbeltfragment from '../Shaders/ConveyorBelt/fragment.glsl'

export default class MaterialDatabase {
    levelmanager
    timer = 0
    MaterialsToUpdateTime = []
    MaterialsToUpdateCamPos = []
    MaterialsToUpdateCamDir = []
    materialsToLoad = [
        {
            name: 'Undefined',
            shader: 'Unlit',
            color: 0x7ffff
        },
        {
            name: 'CoveyorBase',
            shader: 'conveyorbelt',
            color: 0x7ffff
        }
    ]

    Database = {
        Undefined: undefined
    }

    world

    LoadMaterials() {
        this.materialsToLoad.forEach(mat => {
            if (mat.shader === 'Unlit') {
                let texture = null;
                if (mat.texture !== undefined) {
                    texture = this.world.loadTexture(mat.texture);
                    texture.flipY = false;
                }
                let color = 0xffffff
                if (mat.color !== undefined)
                    color = mat.color;


                this.Database[mat.name] = new MeshBasicMaterial({
                    name: mat.name,
                    color: color,
                    map: texture
                });
                if (mat.transparent !== undefined)
                    this.Database[mat.name].transparent = mat.transparent;

            } else if (mat.shader === 'Matcap') {
                let texture = this.world.loadTexture(mat.texture);
                this.Database[mat.name] = new MeshMatcapMaterial({name: mat.name, matcap: texture});
            } else if (mat.shader === 'conveyorbelt') { 
                let uniforms = {};
                uniforms.u_time = {value: 0}
                this.Database[mat.name] = new ShaderMaterial(
                    {
                        uniforms: uniforms,
                        vertexShader: conveyorbeltVertex,
                        fragmentShader: conveyorbeltfragment
                    }
                ); 
                this.MaterialsToUpdateTime.push(this.Database[mat.name]) 
            }
        })
        this.timer=0;
    }

    Update(delta) {
        this.timer += delta
        if (this.timer >= 1000)
            this.timer = 0
        this.MaterialsToUpdateTime.forEach(m => {
            m.uniforms.u_time.value = this.timer;
        }) 
        return
        let campos = new Vector3(0, 0, 0);
        this.levelmanager.camera.getWorldPosition(campos)
        this.MaterialsToUpdateCamPos.forEach(m => {
            m.uniforms.campos.value = campos;
        })
        let camdir = Utilities.GetDirVector(new Vector3(0, 0, 1), this.levelmanager.camera)

        this.MaterialsToUpdateCamPos.forEach(m => {

            m.uniforms.camdir.value = camdir;
        })
    }
}

