import Component from "../Engine/Core/Component";
import {BoxGeometry, Color, Mesh, MeshStandardMaterial, Raycaster} from "three";
import BeltManager from "./BeltManager";

export default class PlayerController extends Component {
    levelmanager
    beltmanager

    StartPlayer() {

        /*
                this.entitiy.world.document.getElementById("ForwardButton1").addEventListener('mousedown', () => {
                    tug.moveVector.y = 1
                })*/


        let mouse = {x: 0, y: 0}
        let camera = this.entitiy.world.camera;
        let raycaster = new Raycaster();
        raycaster.far = 30;
        let controller = this;
        this.beltmanager = this.entitiy.AddComponent(new BeltManager());
        this.beltmanager.levelmanager=this.levelmanager;
        this.entitiy.world.document.addEventListener(
            "click",
            event => {
                mouse.x = event.clientX / window.innerWidth * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(this.entitiy.world.SCENE.children)
                if(intersects.length>0)
                if (intersects[0].object.name === 'ground') {
                    controller.beltmanager.AddBelt(this.PosToBeltIndex(intersects[0].point)); 
                }else if(intersects[0].object.belt !==undefined)
                {
                    intersects[0].object.belt.Rotate()
                   
                } 
            },
            false
        );
        
    }
 PosToBeltIndex(pos)
 {
     let Index = {x:0,y:0,z:0}
     Index.x = Math.round(pos.x)
     Index.y = Math.round(pos.y)
     Index.z = Math.round(pos.z)
     return Index;
 }

}