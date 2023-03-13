import Component from "../../Core/Component"
import {AnimationMixer} from "three";
import Animation from "./Animation";
import * as THREE from "three";

export default class AnimationController extends Component {
    animation
    modelRoot
    constructor() {
        super();
    }

    Update(delta) {
        if (this.animation !== undefined)
            this.animation.mixer.update(delta)
    }

    Build(AnimationModel) {
        this.modelRoot = AnimationModel.scene;
                
        this.animation = new Animation();
        this.animation.mixer = new AnimationMixer(this.modelRoot)
        this.animation.actions = {}
        for (let i = 0; i < AnimationModel.animations.length; i++) {
            this.animation.actions[AnimationModel.animations[i].name] = this.animation.mixer.clipAction(AnimationModel.animations[i])
        } 
        this.animation.actions.current = this.animation.actions[AnimationModel.animations[0].name]
        this.animation.actions.current.play()
    }
    DisableAnimationLoop(name)
    {
        this.animation.actions[name].clampWhenFinished=true 
        this.animation.actions[name].loop=THREE.LoopOnce 
    }
        

}