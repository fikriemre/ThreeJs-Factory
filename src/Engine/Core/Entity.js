import * as THREE from 'three'
import {Math} from "three";
import Utilities from "../Utilities";

export default class Entity {
    name
    Components = []
    world
    transform
    UID = ""

    constructor(gameWorld, name = "", _Uid = "") {

        this.name = name;
        this.world = gameWorld;
        this.transform = new THREE.Group(); 
        if (_Uid === "")
            this.UID = Utilities.create_UUID();
        else {
            this.UID=_Uid;
        }

        this.transform.position.set(0, 0, 0);
        this.world.AddEntityToTheWorld(this);


    }

    Update(delta) {
        this.Components.forEach(x => {
            if (x.Update !== undefined)
                x.Update(delta)
        });
    }

    AddComponent(component) {
        this.Components.push(component);
        component.entitiy = this;
        component.transform=this.transform
        component.world=this.world;
        
        component.Init()
        component.Awake();
        component.Start();
        /*  if (component.Update !== undefined)
              console.log("CanUpdate")*/
        return component
    }

    GetComponents(clss) {

        let tip = clss;
        let _out = [];
        this.Components.forEach(x => {
                if ((x.constructor.name) === tip)
                    _out.push(x);
            }
        );
        return _out
    }

    GetComponent(clssName) {

        let tip = clssName;
        let _out = undefined;
        this.Components.forEach(x => {
                if ((x.constructor.name) === tip)
                    _out = x;
            }
        );
        return _out;
    }

    Destroy() {
        this.Components.forEach(x => {
                x.OnDestroy();
                x.RemoveComponent();
            }
        );
        this.world.RemoveEntityFromTheWorld(this);

        this.transform.parent.remove(this.transform);
    }
   
}