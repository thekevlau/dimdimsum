import { connect } from 'react-redux';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionManager from '../utils/ConnectionManager';
import ErrorActions from '../actions/ErrorActions';
import GameplayActions from '../actions/GameplayActions';
import ConnectionHandlers from '../mixins/ConnectionHandlers';
import Logger from '../utils/Logger';
import Player from '../GameObjects/Player';
import React from 'react';

const Connection = React.createClass({

    mixins: [ConnectionHandlers()],

    setupHandlers: function(ctype, selfName) {
        const handlePlayerCreate = (data, cid) => {
            const {dispatch, players} = this.props;
            const playerList = Object.keys(players).map(name => players[name]);
            const player = Player.deserialize(data);

            // If you are a host you need to tell the new client about yourself
            // and tell all other clients about the new client.
            if (ctype === 'HOST') {
                if (players[data.name] || data.name === selfName) {
                    dispatch(ConnectionActions.sendError(cid, 'ROOM_NAME_UNIQUE'));
                    dispatch(ConnectionActions.close(cid));
                    Logger.debug('Someone with non unique name tried to join room');
                    return;
                }

                // Tell new client about yourself.
                dispatch(ConnectionActions.sendCreatePlayer(cid, {
                    name: selfName
                }));
                // Tell new client the room host name.
                dispatch(ConnectionActions.sendHostName(cid, selfName));
                // Tell all other clients about new client.
                dispatch(ConnectionActions.sendCreatePlayer('ALL', data, cid));
                // Tell new client about other players.
                dispatch(ConnectionActions.sendCreatePlayerMulti(cid,
                        playerList.map(player => Player.serialize(player))));

                // Add player to local store.
                // Only host should know about connectionId.
                dispatch(GameplayActions.createPlayer(player.set({
                    connectionId: cid
                })));
            }
            else {
                // If a duplicate player appears on a client, error.
                if (players[data.name]) {
                    throw new Error('Tried adding a duplicate player.');
                }

                // Add player to local store.
                dispatch(GameplayActions.createPlayer(player));
            }
        };

        this.registerConnectionHandler('connectionCreatePlayer', (action, cid) => {
            handlePlayerCreate(action.data, cid);
        });
        this.registerConnectionHandler('connectionCreatePlayerMulti', (action, cid) => {
            action.data.forEach(playerData => {
                handlePlayerCreate(playerData, cid);
            });
        });

        this.registerConnectionHandler('connectionSetPlayer', (action, cid) => {
            const {dispatch, players, self} = this.props;
            if (self.name === action.playerName) {
                dispatch(GameplayActions.setSelf(action.data));
            }
            else if (players[action.playerName]) {
                dispatch(GameplayActions.setPlayer(action.playerName, action.data));
            }
            else {
                throw new Error('Recieved player data for unknown player.');
            }
        });

        this.registerConnectionHandler('connectionHostName', action => {
            this.props.dispatch(GameplayActions.setHostName(action.data));
        });

        this.registerConnectionHandler('connectionError', action => {
            const dispatch = this.props.dispatch;
            switch (action.data) {
                case 'ROOM_NAME_UNIQUE':
                    this.props.dispatch(ErrorActions.error(
                            'Name chosen not unique, please try again with a different name'));
                    break;
            }
        });

        this.registerConnectionHandler('connectionRemovePlayer', (action, cid) => {
            if (ctype === 'HOST') {
                throw new Error('Only clients should need to remove players');
            }
            const dispatch = this.props.dispatch;
            dispatch(GameplayActions.removePlayer(action.data));
        });
    },

    setupConnectionManager: function(ctype, roomName) {
        ConnectionManager.setup(ctype, roomName);
        ConnectionManager.on('connectionData', (data, conn) => {
            this.handleConnectionData(data, conn.label);
        });

        ConnectionManager.on('peerError', (err, peer, ctype) => {
            const dispatch = this.props.dispatch;
            switch (err.type) {
                case 'peer-unavailable':
                    if (ctype === 'CLIENT') {
                        dispatch(ErrorActions.error(
                                `Could not connect to room`));
                    }
                    else {
                        dispatch(ErrorActions.error(
                                `Could not set up room`));
                    }
                    break;
            }
        });

        ConnectionManager.on('peerClose', () => {
            const msg = (ctype === 'HOST') ? 'clients' : 'host';
            this.props.dispatch(ErrorActions.error(`Connection to ${msg} lost`, 'FATAL'));
        });

        ConnectionManager.on('connectionClose', conn => {
            if (ctype === 'HOST') {
                const name = Object.keys(this.props.players)
                        .find(n => this.props.players[n].connectionId === conn.label);
                // Someone who wasn't a player tried to connect.
                if (!name) {
                    return;
                }
                // Tell other clients to remove disconnected client.
                this.props.dispatch(ConnectionActions.sendRemovePlayer('ALL', name));
                this.props.dispatch(GameplayActions.removePlayer(name));
            }
            else {
                this.props.dispatch(ErrorActions.error(`Connection to host lost`, 'FATAL'));
            }
        });
    },

    clear: function() {
        ConnectionManager.clear();
    },

    componentWillUnmount: function() {
        this.unregisterHandlers();
        this.clear();
    },

    render: function() {
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                setupHandlers: this.setupHandlers,
                setupConnectionManager: this.setupConnectionManager,
                clear: this.clear
            });
        });

        return (
            <div>{children}</div>
        );
    }
});

export default connect(state => ({
    players: state.gameState.players,
    self: state.gameState.self
}))(Connection);
