import {Euler} from "three";

export default class ConveyorBelt {
    mesh
    beltmanager
    key = {x: 0, y: 0, z: 0}
    dir = {x: 0, y: 0, z: 1}
    directions=[
        {x: 0, y: 0, z: 1},
        {x: 1, y: 0, z: 0},
        {x: 0, y: 0, z: -1},
        {x: 1, y: 0, z: 0}
    ] 
    DirectionIndex =0;
    Rotate()
    {
        this.DirectionIndex++;
        if(this.DirectionIndex>=4)
            this.DirectionIndex=0;
        this.mesh.rotation.copy(new Euler(0,(-(this.DirectionIndex+1)/4)*3.1415*2,0)); 
    }
    CreatMesh(conveyormeshRoot)
    {

        this.mesh=conveyormeshRoot;
        this.beltmanager.transform.add(conveyormeshRoot);
        conveyormeshRoot.position.copy(this.key)
        conveyormeshRoot.traverse(m => {
            if (m.isMesh) {
                m.castShadow = true;
                m.receiveShadow = true;
                m.name='belt'
                m.belt=this;
            }
        }) 
        this.Rotate()
    }
    
    
    
    
    
}