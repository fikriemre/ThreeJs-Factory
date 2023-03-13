export default class Animation {
    mixer
    actions
    previousAction
    activeAction

    PlayFade(name, fadeTime = 0.5) {
        let newAction = this.actions[name]
        let oldAction = this.actions.current
        if (newAction === oldAction)
            return
        newAction.reset()
        newAction.play()
        newAction.crossFadeFrom(oldAction, fadeTime)
        this.actions.current = newAction
    }

    BlendAnims(AnimA, AnimB, t) {
        if (!this.actions[AnimA]._isPlaying)
            this.actions[AnimA].play()
        if (!this.actions[AnimB]._isPlaying)
            this.actions[AnimB].play()

        this.actions[AnimA].setEffectiveWeight(t);
        this.actions[AnimB].setEffectiveWeight(1 - t);
    }
 
    FadeToAction(name, duration) {

        this.previousAction = this.actions.current;
        this.activeAction = this.actions[name];

        if (this.previousAction !== this.activeAction) {

            this.previousAction.fadeOut(duration);

        }
        this.activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
    }

    StopAnimation(AnimName)
    {
        this.actions[AnimName].stop()
    }
    
}