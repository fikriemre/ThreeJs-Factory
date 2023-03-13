import State from "./State";

export default class StateMachine {
    states = {}
    CurrentState
    inited = false;

    AddState(nm, Enter, Exit) {
        this.states[nm] = new State();
        this.states[nm].Name = nm;

        if(Enter!==undefined)
        this.states[nm].OnEnter = func => Enter();
        if(Exit!==undefined)
        this.states[nm].OnExit = func => Exit();
        
        if (this.inited === false) {
            this.inited = true;
            this.CurrentState = this.states[nm];
        }
    }

    setState(newState) {
        
        if (this.CurrentState === this.states[newState])
            return;
        if (this.CurrentState !== undefined)
            this.CurrentState.Exit();
        this.states[newState].Enter();
        this.CurrentState = this.states[newState]; 
    }
}