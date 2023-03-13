export default class State {
    Name
    OnEnter
    OnExit

    Enter() {
        if (this.OnEnter !== undefined)
            this.OnEnter();
    }

    Exit() {
        if (this.OnExit !== undefined)
            this.OnExit();
    }
}