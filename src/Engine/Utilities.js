import {Euler, MathUtils, Matrix4, Quaternion, Vector3} from "three";
import Entity from "./Core/Entity"; 
 
export default class Utilities {
    static EaseOutElastic(x) {
        const c4 = (2 * Math.PI) / 3;

        return x === 0
            ? 0
            : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }

    static create_UUID() {
        var dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    static LerpV3WithReturn(v1, v2, t) {
        let out = new Vector3(v1.x, v1.y, v1.z);
        this.LerpV3(out, v2, t);
        return out;
    }


    static LerpV3(v1, v2, t) {
        v1.x = MathUtils.lerp(v1.x, v2.x, t);
        v1.y = MathUtils.lerp(v1.y, v2.y, t);
        v1.z = MathUtils.lerp(v1.z, v2.z, t);
    }

    static SpawnWithComponent(name, component, world) {
        let newEntity = new Entity(world, name);
        return newEntity.AddComponent(new component)
    }

    static GetDirVector(dir, transform) {
        let rotationMatrix = new Matrix4().extractRotation(transform.matrixWorld);
        return dir.applyMatrix4(rotationMatrix).normalize();
    }

    static DataToTransform(data) {
        let v3 = new Vector3(data[0], data[1], data[2])        
        let rot = new Euler(data[3], data[4], data[5]) 
        let sl = new Vector3(data[6], data[7], data[8])
        return {v3, rot, sl}
    }

    static DataToTransformApply(transform, data) {         
        let c= this.DataToTransform(data);
        transform.position.set(c.v3.x,c.v3.y,c.v3.z)
        transform.rotation.set(c.rot.x,c.rot.y,c.rot.z)         
        transform.scale.set(c.sl.x,c.sl.y,c.sl.z)

    }
    static lerp( a, b, alpha ) {
        return (1-alpha)*a+alpha*b
    }
    static AddOffsetToPathPoints(pathpoints,offsetx,offsety,offsetz)
    {
        for(let i =0;i<pathpoints.length;i+=3)
        {
            pathpoints[i]+=offsetx;
            pathpoints[i+1]+=offsety;
            pathpoints[i+2]+=offsetz;
        }
        return pathpoints;
    }
    static GetMeshData(path,world)
    {
      
         
        world.LoadGltfModel(path,(e)=>{
            e.scene.traverse((child)=>{
                if(child.isMesh)
                {
                    let normal ='let normal = ['         
                    let position ='let position = ['
                    let index ='let index = ['
                    
                    let normalArray= child.geometry.attributes.normal.array;
                    normalArray.forEach(e=>normal+=(e+','))
                    normal = normal.substring(0, normal.length - 1);
                    normal+=']'
                    let vertexArray = child.geometry.attributes.position.array;
                    vertexArray.forEach(e=>position+=(e+','))
                    position = position.substring(0, position.length - 1);
                    position+=']'
                    
                    let indexArray =child.geometry.index.array;
                    indexArray.forEach(e=>index+=(e+','))
                    index = index.substring(0, index.length - 1);
                    index+=']'
                     
                    console.log(normal+'\n'+ position +'\n'+ index );
                    console.log(child.geometry);
                    
                }
            })
        });
        
    }
    static  GetClientPos(elem) {
        let top=0, left=0;
        while(elem) {
            top = top + parseInt(elem.offsetTop);
            left = left + parseInt(elem.offsetLeft);
            elem = elem.offsetParent;
        }
        return {y: top, x: left};
    }
}

