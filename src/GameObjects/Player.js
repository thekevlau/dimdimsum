import Connection from '../utils/Connection';

export default class Player extends Connection {
    constructor(opts={}) {
        super(opts.connection || null);
        this.name = opts.name || 'Unknown';
    }
}
