export default class Player {
    constructor(opts={}) {
        this.name = opts.name || 'Unknown';
    }

    getData() {
        return {
            name: this.name
        };
    }

    set(data) {
        return new Player({...this.getData(), ...data});
    }

    clone() {
        return this.set({});
    }
}
