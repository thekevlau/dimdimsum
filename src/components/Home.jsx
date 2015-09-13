import { connect } from 'react-redux';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionManager from '../utils/ConnectionManager';
import ErrorActions from '../actions/ErrorActions';
import GameplayActions from '../actions/GameplayActions';
import GameplayHandlers from '../mixins/GameplayHandlers';
import Logger from '../utils/Logger';
import React from 'react/addons';
import Router from 'react-router';

const Home = React.createClass({

    mixins: [GameplayHandlers(), Router.Navigation],

    getInitialState: function() {
        return {
            createDialog: false,
            joinDialog: false,
            roomName: '',
            name: ''
        }
    },

    createRoom: function() {
        this.setState({
            createDialog: true,
            joinDialog: false
        });
    },

    joinRoom: function() {
        this.setState({
            createDialog: false,
            joinDialog: true
        });
    },

    back: function() {
        this.setState({
            createDialog: false,
            joinDialog: false
        });
    },

    setupConnectionManager: function(connectionType) {
        ConnectionManager.setup(connectionType, this.state.roomName);
        ConnectionManager.on('connectionData', (data, conn) => {
            this.handleGameplayData(data, conn.label);
        });

        ConnectionManager.on('peerError', (err, peer, ctype) => {
            switch (err.type) {
                case 'peer-unavailable':
                    if (ctype === 'CLIENT') {
                        this.props.dispatch(ErrorActions.error(
                                `Could not connect to room`));
                    }
                    else {
                        this.props.dispatch(ErrorActions.error(
                                `Could not set up room`));
                    }
            }
        });
    },

    setupHandlers: function(ctype, selfName) {
        const handlePlayerCreate = (data, cid) => {
            const dispatch = this.props.dispatch;
            const players = this.props.store.getState().gameState.players;
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
            const players = this.props.store.getState().gameState.players;
            if (!players[action.playerName]) {
                throw new Error('Recieved player data for unknown player.');
            }

            this.props.dispatch(GameplayActions.setPlayer(action.playerName, action.data));
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
    },

    go: function() {
        const connectionType = (this.state.joinDialog) ? 'CLIENT' : 'HOST';

        this.setupConnectionManager(connectionType);

        const dispatch = this.props.dispatch;

        // Set up self player object.
        dispatch(GameplayActions.createSelf({
            name: this.state.name
        }));
        // Set room name.
        dispatch(GameplayActions.setRoomName(this.state.roomName));

        // Setup general gameplay handlers.
        this.setupHandlers(connectionType, this.state.name);

        // If a client, tell host about yourself.
        if (connectionType === 'CLIENT') {
            dispatch(ConnectionActions.sendCreatePlayer('HOST', {
                name: this.state.name
            }));
        }
        // Otherwise, set up host name.
        else {
            dispatch(GameplayActions.setHostName(this.state.name));
        }

        this.transitionTo('wait');
    },

    roomNameChange: function(event) {
        this.setState({
            roomName: event.target.value
        });
    },

    nameChange: function(event) {
        this.setState({
            name: event.target.value
        });
    },

    render: function() {
        let dialog, buttons;
        if (this.state.createDialog || this.state.joinDialog) {
            dialog = (
                <div>
                    <button onClick={this.back}>&#8592;</button>
                    <input type="text" onChange={this.nameChange} placeholder="Enter Name" />
                    <input type="text" onChange={this.roomNameChange} placeholder="Enter Room Name" />
                    <button onClick={this.go}>Go</button>
                </div>
            );
        }
        else {
            buttons = (
                <div>
                    <button onClick={this.createRoom}>Create Room</button>
                    <button onClick={this.joinRoom}>Join Room</button>
                </div>
            );
        }

        return (
            <div className="home">
                {buttons}
                {dialog}
            </div>
        );
    }
});

// Look into reselect: https://github.com/faassen/reselect.
export default connect()(Home);
