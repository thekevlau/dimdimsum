import ActionUtils from '../utils/ActionUtils';
import Deck from '../GameObjects/Deck';
import Player from '../GameObjects/Player';

const updatePlayers = (players, selfName) => {
    const output = {players: []};
    for (let player of players) {
        if (player.name === selfName) {
            output.self = player;
        }
        else {
            output.players.push(player);
        }
    }
    return output;
};

const actions = {
    createSelf: function(gameState, action) {
        return {
            ...gameState,
            self: action.data
        };
    },

    setSelf: function(gameState, action) {
        if (!gameState.self) {
            throw new Error('Tried to set self before initialized');
        }
        return {...gameState, self: gameState.self.set(action.data)};
    },

    createPlayer: function(gameState, action) {
        if (!action.data.name) {
            throw new Error('Must specify name');
        }
        return {
            ...gameState,
            players: {
                ...gameState.players,
                [action.data.name]: action.data
            }
        };
    },

    setPlayer: function(gameState, action) {
        if (!action.data.name || !gameState[action.data.name]) {
            throw new Error('Tried to set undefined player', action.data.name);
        }
        return {
            ...gameState,
            players: {
                ...gameState.players,
                [action.data.name]: gameState[action.data.name].set(action.data)
            }
        };
    },

    removePlayer: function(gameState, action) {
        if (typeof action.data !== 'string') {
            throw new Error('REMOVE_PLAYER requires a string');
        }
        const players = Player.cloneMap(gameState.players);
        delete players[action.data];
        return {
            ...gameState,
            players
        };
    },

    setRoomName: function(gameState, action) {
        if (typeof action.data !== 'string') {
            throw new Error('SET_ROOM_NAME requires a string');
        }
        return {...gameState, roomName: action.data};
    },

    setConnectionType: function(gameState, action) {
        if (typeof action.data !== 'string') {
            throw new Error('SET_CONNECTION_TYPE requires a string');
        }
        return {...gameState, connectionType: action.data};
    },

    setHostName: function(gameState, action) {
        if (typeof action.data !== 'string') {
            throw new Error('SET_HOST_NAME requires a string');
        }
        return {...gameState, hostName: action.data};
    },

    updatePlayers: function(gameState, action) {
        return {
            ...gameState,
            ...updatePlayers(action.data, gameState.self.name)
        };
    },

    setDeck: function(gameState, action) {
        return {
            ...gameState,
            deck: action.data.deck
        };
    }
};

export default ActionUtils.generateActionCreators(actions);

export const Reducers = (gameState = {}, action) => {
    if (actions[action.type]) {
        return actions[action.type](gameState, action);
    }
    return gameState;
};
