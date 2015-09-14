import { connect } from 'react-redux';
import ConnectionManager from '../utils/ConnectionManager';
import ErrorActions from '../actions/ErrorActions';
import GameplayActions from '../actions/GameplayActions';
import GameplayHandlers from '../mixins/GameplayHandlers';
import Logger from '../utils/Logger';
import React from 'react';

const Connection = React.createClass({

    mixins: [GameplayHandlers()],

    getInitialState: function() {
        return {
            setupHandlers: false,
            setupConnectionManager: false
        };
    },

    setupHandlers: function(ctype, selfName) {
        if (this.state.setupHandlers) {
            throw new Error('Can only setup handlers once.');
        }

        const handlePlayerCreate = (data, cid) => {
            const {dispatch, players} = this.props;
            const playerList = Object.keys(players).map(name => players[name]);

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
                        playerList.map(player => ({...player.getData(), connectionId: null}))));

                // Add player to local store.
                dispatch(GameplayActions.createPlayer(data));
            }
            else {
                // If a duplicate player appears on a client, ignore it.
                if (players[data.name]) {
                    throw new Error('Tried adding a duplicate player.');
                }

                // Add player to local store.
                dispatch(GameplayActions.createPlayer(data));
            }
        };

        this.registerGameplayHandler('CONNECTION_CREATE_PLAYER', (action, cid) => {
            handlePlayerCreate(action.data, cid);
        });
        this.registerGameplayHandler('CONNECTION_CREATE_PLAYER_MULTI', (action, cid) => {
            action.data.forEach(playerData => {
                handlePlayerCreate(playerData, cid);
            });
        });

        this.registerGameplayHandler('CONNECTION_PLAYER_DATA', (action, cid) => {
            const {dispatch, players} = this.props;
            if (!players[action.playerName]) {
                throw new Error('Recieved player data for unknown player.');
            }

            dispatch(GameplayActions.setPlayer(action.playerName, action.data));
        });

        this.registerGameplayHandler('CONNECTION_HOST_NAME', action => {
            this.props.dispatch(GameplayActions.setHostName(action.name));
        });

        this.registerGameplayHandler('CONNECTION_ERROR', action => {
            const dispatch = this.props.dispatch;
            switch (action.message) {
                case 'ROOM_NAME_UNIQUE':
                    this.props.dispatch(ErrorActions.error(
                            'Name chosen not unique, please try again with a different name'));
                    break;
            }
        });

        this.registerGameplayHandler('CONNECTION_REMOVE_PLAYER', (action, cid) => {
            if (ctype === 'HOST') {
                throw new Error('Only clients should need to remove players');
            }
            const dispatch = this.props.dispatch;
            dispatch(GameplayActions.removePlayer(action.name));
        });

        this.setState({
            setupHandlers: true
        });
    },

    setupConnectionManager: function(ctype, roomName) {
        if (this.state.setupConnectionManager) {
            throw new Error('Can only setup connection manager once.');
        }

        ConnectionManager.setup(ctype, roomName);
        ConnectionManager.on('connectionData', (data, conn) => {
            this.handleGameplayData(data, conn.label);
        });

        // ConnectionManager.on('peerError', (err, peer, ctype) => {
        //     const disatch = this.props.dispatch;
        //     switch (err.type) {
        //         case 'peer-unavailable':
        //             if (ctype === 'CLIENT') {
        //                 dispatch(ErrorActions.error(
        //                         `Could not connect to room`));
        //             }
        //             else {
        //                 dispatch(ErrorActions.error(
        //                         `Could not set up room`));
        //             }
        //             break;
        //     }
        // });

        ConnectionManager.on('peerClose', () => {
            const msg = (ctype === 'HOST') ? 'clients' : 'host';
            this.props.dispatch(ErrorActions.error(`Connection to ${msg} lost`));
        });

        ConnectionManager.on('connectionClose', (conn, cid) => {
            console.log('HANDLING CLOSE');
            if (ctype === 'HOST') {
                const name = Object.keys(this.props.players)
                        .find(n => players[n].connectionId === cid);
                // Tell other clients to remove disconnected client.
                this.props.dispatch(ConnectionActions.sendRemovePlayer('ALL', name));
            }
            else {
                 this.props.dispatch(ErrorActions.error(`Connection to host lost`));
            }
        });

        this.setState({
            setupConnectionManager: true
        });
    },

    componentWillUnmount: function() {
        this.unregisterHandlers();
        ConnectionManager.clear();
    },

    render: function() {
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                setupHandlers: this.setupHandlers,
                setupConnectionManager: this.setupConnectionManager
            });
        });

        return (
            <div>{children}</div>
        );
    }
});

export default connect(state => ({
    players: state.gameState.players
}))(Connection);
