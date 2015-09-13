export default class Connection {
    constructor(conn=null) {
        this.connection = conn;
        this.queue = [];
        this.label = this.connection.label;

        this.connection.on('open', () => {
            this.queue.forEach(args => {
                this.send.apply(this, args);
            });
        });
    }

    on() {
        return this.connection.on.apply(this.connection, arguments);
    }

    send() {
        if (!this.connection.open) {
            this.queue.push(arguments);
            return;
        }
        return this.connection.send.apply(this.connection, arguments);
    }

    close() {
        return this.connection.close.apply(this.connection, arguments);
    }
}
