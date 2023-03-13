export default class ModelDatabase {
    modelsToLoad = [
        /*
        {
            name: 'TugMesh',
            path: "Models/Tug.glb"
        } */
        {
            name: 'ConveyorForward',
            path: "Models/Conveyor/beltforward.glb"
        }
    ]
    database = {}
    world
    loadcounter = 0
    levelmanager
    LoadDatabase() {
        let modelDatabase = this;
        this.modelsToLoad.forEach(model => {
            this.world.LoadGltfModel(model.path, (gltf) => {
                modelDatabase.database[model.name] = gltf;
                gltf.scene.traverse(function (child) {

                    if (child.isMesh) {
                        if (modelDatabase.levelmanager.materialDatabase.Database[child.material.name] === undefined) {
                           /* let color = child.material.color;
                            child.material = modelDatabase.levelmanager.materialDatabase.Database.Undefined;
                            if (color !== undefined)
                                child.material.color = color;
*/
                        } else {
                            child.material = modelDatabase.levelmanager.materialDatabase.Database[child.material.name];

                        }
                    }
                })
                modelDatabase.loadcounter++;
                if (modelDatabase.loadcounter >= modelDatabase.modelsToLoad.length)
                    modelDatabase.OnDatabaseLoadCompleted()
            })
        })
    }

    OnDatabaseLoadCompleted() {
    }


}