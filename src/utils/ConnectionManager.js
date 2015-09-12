import Connection from './Connection';
import EventEmittor from 'events';
import Peer from 'peerjs';

class ConnectionManager extends EventEmittor {
    constructor() {
        super();

        this.connectionType = null;
        this.clients = {};
        this.host = null;
        this.peerObject = null;
    }

    setup(ctype, roomName) {
        if (this.peerObject) {
            this.peerObject.destroy();
        }

        this.connectionType = ctype;

        if (ctype === 'HOST') {
            if (!roomName) {
                throw new Error('If HOST, must provide room name.');
            }
            this.peerObject = new Peer(roomName, {key: '7xab2qyfqwz2rzfr'});
        }
        else if (ctype === 'CLIENT') {
            this.peerObject = new Peer({key: '7xab2qyfqwz2rzfr'});
        }

        // Set up handlers for peer object.
        this.setupPeerHandlers(this.peerObject);

        // If a client, connect to host.
        if (ctype === 'CLIENT') {
            const conn = new Connection(this.peerObject.connect(roomName));
            // Setup handlers.
            this.setupConnectionHandlers(conn, ctype);
            // Add host.
            this.host = conn;
        }
    }

    setupPeerHandlers(peer) {
        const ctype = this.connectionType;

        if (!peer) {
            throw new Error('Peer object is null.');
        }

        peer.on('connection', conn => {
            if (ctype === 'HOST') {
                // Setup handlers for connection.
                this.setupConnectionHandlers(conn, ctype);
                // Add client.
                this.clients[conn.label] = conn;
            }

            this.emit('peerNewConnection', conn, peer, ctype);
        });

        peer.on('close', () => this.emit('peerClose', peer, ctype));

        peer.on('disconnected', () => {
            if (!peer.destroyed) {
                peer.reconnect();
            }
            this.emit('peerDisconnected', peer, ctype);
        });

        peer.on('error', err => this.emit('peerError', err, peer, ctype));
    }

    setupConnectionHandlers(conn) {
        const ctype = this.connectionType;

        if (!conn) {
            throw new Error('Connection object is null.');
        }

        conn.on('data', data => this.emit('connectionData', data, conn, ctype));

        conn.on('close', () => this.emit('connectionClose', conn, ctype));

        conn.on('error', () => this.emit('connectionError', conn, ctype));
    }

    send(data, to) {
        if (to === 'ALL') {
            for (let id in this.clients) {
                this.clients[id].send(data);
            }
        }
        else if (to === 'HOST') {
            this.host.send(data);
        }
        else {
            this.clients[to].send(data);
        }
    }
};

const singletonInstance = new ConnectionManager();

export default singletonInstance;
