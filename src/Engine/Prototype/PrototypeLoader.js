export default class PrototypeLoader {

    world

    LoadPrototypes(path) {
return
        let request = new XMLHttpRequest()
        request.open("GET", path, false)
        request.send(null)
        var data = JSON.parse(request.responseText);

        let obj = {
            name: "",

            deneme: "MM",
            position: {
                x: 10,
                y: 10,
                z: 10
            },
            scale: {
                x: 10,
                y: 10,
                z: 10
            }
        }
        data.forEach(type => {
            let parameters = type.Parameters;
            parameters.forEach(param => {
                Object.keys(param).forEach(key => {
                    obj[key] = param[key]
                })
            })
        }) 
    }
}