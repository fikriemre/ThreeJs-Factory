import Component from "../../Core/Component";
import {Mesh, SphereGeometry, Vector2, Vector3} from "three";
import {randFloat} from "three/src/math/MathUtils";

export default class CPUParticleEmitter extends Component {
    poolsize = 100
    particles = []
    lifeTimeRange = new Vector2(1, 2)
    Speedrange = new Vector2(0.5, 1)
    sizeRange = new Vector2(0.1, 0.25)
    dirRange = new Vector2(-1, 1);

    spawntimer = 0
    spawnIndex = 0
    emitPeriod=0.25
    inited=false
    OnParticleUpdate(pObj) {
        let lifePercent = pObj.life / pObj.lifetime;
        if (lifePercent < 0.1) {
            let size = pObj.size * (lifePercent / 0.1);
            pObj.mesh.scale.set(size, size, size)
        } else if (lifePercent > 0.9) {
            let size = pObj.size * ((1 - lifePercent) / 0.1);
            pObj.mesh.scale.set(size, size, size)
        }
    }

    InitEmitter(geometry, material) {
        this.inited=true;
        for (let i = 0; i < this.poolsize; i++) {
            //let geo = new SphereGeometry(1, 12, 12);
            let mesh = new Mesh(geometry, material);
            mesh.scale.set(0.1, 0.1, 0.1)
            mesh.visible = false;
            this.world.SCENE.add(mesh)
            //this.transform.add(mesh);
            let particleObj = {
                enabled: false,
                mesh: mesh,
                life: 0.0,
                lifetime: 0.0,
                speed: 0.0,
                size: 1.0,
                drag: 0.3,

                Init: (pos) => {
                    mesh.position.copy(pos)
                    particleObj.enabled = true;
                    particleObj.lifetime = randFloat(this.lifeTimeRange.x, this.lifeTimeRange.y);
                    particleObj.life = 0;
                    particleObj.speed = randFloat(this.Speedrange.x, this.Speedrange.y);
                    particleObj.size = randFloat(this.sizeRange.x, this.sizeRange.y);
                    mesh.visible = true;
                    let movetarget = particleObj.mesh.position.clone()
                    movetarget.x += randFloat(this.dirRange.x, this.dirRange.y)
                    movetarget.z += randFloat(this.dirRange.x, this.dirRange.y)
                    movetarget.y += 10;
                    particleObj.mesh.lookAt(movetarget)

                },
                Kill() {
                    particleObj.enabled = false;
                    mesh.visible = false;
                },
                CustomUpdate: () => {
                },
                Update: (delta) => {
                    particleObj.life += delta;
                    particleObj.mesh.translateZ(delta * particleObj.speed);
                    particleObj.speed -= delta * particleObj.drag;
                    if (particleObj.speed < 0.2)
                        particleObj.speed = 0.2;

                    particleObj.CustomUpdate(particleObj)
                    if (particleObj.life >= particleObj.lifetime)
                        particleObj.Kill()
                }
            }
            let emmiter = this;
            particleObj.CustomUpdate = (particleObj) => {
                emmiter.OnParticleUpdate(particleObj);
            }
            this.particles.push(particleObj);
        }
    }


    Update(delta) {
        if(!this.inited)
            return
        this.spawntimer += delta;
        if (this.spawntimer > this.emitPeriod) {
            this.spawntimer = 0;
            let pos = new Vector3(0, 0, 0,)
            this.transform.getWorldPosition(pos)
            this.particles[this.spawnIndex].Init(pos)
            this.spawnIndex++
            if (this.spawnIndex >= this.particles.length)
                this.spawnIndex = 0;
        }
        this.particles.forEach((e) => {
            if (e.enabled)
                e.Update(delta);
        })
    }
    OnDestroy() {
        this.particles.forEach((e) => {
            e.mesh.parent.remove(e.mesh)
        })
        super.OnDestroy();        
    }
}