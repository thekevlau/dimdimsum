import Connection from './Connection';
import EventEmittor from 'events';
import Logger from '../utils/Logger';
import Peer from '../lib/peerjs';

class ConnectionManager extends EventEmittor {
    constructor() {
        super();

        this.connectionType = null;
        this.clients = {};
        this.host = null;
        this.peerObject = null;
        this.initialized = false;
    }

    setup(ctype, roomName) {
        this.initialized = true;
        if (this.peerObject) {
            this.peerObject.destroy();
        }

        this.connectionType = ctype;

        if (ctype === 'HOST') {
            if (!roomName) {
                throw new Error('If HOST, must provide room name.');
            }
            this.peerObject = new Peer(roomName, {
                host: 'young-spire-7644.herokuapp.com',
                debug: 3,
                secure: true
            });
        }

        else if (ctype === 'CLIENT') {
            this.peerObject = new Peer({
                host: 'young-spire-7644.herokuapp.com',
                debug: 3,
                secure: true
            });
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

    clear() {
        if (!this.initialized) {
            return;
        }

        Object.keys(this.clients).forEach(id => {
            this.clients[id].close();
        });
        this.peerObject.destroy();

        this.connectionType = null;
        this.clients = {};
        this.host = null;
        this.peerObject = null;
        this.initialized = false;
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

        peer.on('close', () => {
            Logger.debug(`Peer close`);
            this.emit('peerClose', peer, ctype);
        });

        peer.on('disconnected', () => {
            peer.destroy();
        });

        peer.on('error', err => {
            Logger.debug(`Peer error:`, err.type, err);
            this.emit('peerError', err, peer, ctype);
        });
    }

    setupConnectionHandlers(conn) {
        const ctype = this.connectionType;

        if (!conn) {
            throw new Error('Connection object is null.');
        }

        conn.on('data', data => {
            Logger.debug(`Recieving data from connection ${conn.label}:`, data);
            this.emit('connectionData', data, conn, ctype);
        });

        conn.on('close', () => {
            Logger.debug(`Connection ${conn.label} closing`);
            delete this.clients[conn.label];
            this.emit('connectionClose', conn, ctype);
        });

        conn.on('error', err => {
            Logger.debug(`Connection ${conn.label} error:`, err.type, err);
            this.emit('connectionError', err, conn, ctype)
        });
    }

    send(to, data, exclude) {
        Logger.debug('Sending to', to, data, exclude);
        if (to === 'ALL') {
            for (let id in this.clients) {
                if (id === exclude) {
                    continue;
                }
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

    close(id) {
        clients[id].close();
        delete clients[id];
    }
};

const singletonInstance = new ConnectionManager();

export default singletonInstance;
