import Component from "../Engine/Core/Component";
import {BoxGeometry, Color, Mesh, MeshStandardMaterial} from "three";
import ConveyorBelt from "./ConveyorBelt";

export default class BeltManager extends Component
{
    levelmanager
    belts={}
    AddBelt(beltKey)
    {

        let belt = new ConveyorBelt();
        belt.key=beltKey;
        belt.beltmanager=this;
        this.belts[this.Vec3ToKeyStr(beltKey)]=belt;
        
        //belt.CreatMesh(this.levelmanager.modelDatabase.database.ConveyorForward.scene.clone())
        belt.CreatMesh(this.levelmanager.modelDatabase.database.testcube.scene.clone())
 
       
        

       
     
    } 
    GetBelt(key)
    {
        
    }
    Vec3ToKeyStr(pos)
    {
        return`${pos.x}${pos.z}`;
    }
}