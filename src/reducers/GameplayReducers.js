import Player from '../GameObjects/Player';

export default (gameState = {}, action) => {
    switch (action.type) {
        case 'CREATE_SELF':
            return {...gameState, self: new Player(action.data)};

        case 'SET_SELF':
            if (!gameState.self) {
                throw new Error('Tried to set self before initialized');
            }
            return {...gameState, self: gameState.self.set(action.props)};

        case 'CREATE_PLAYER':
            return {
                ...gameState,
                players: {
                    ...gameState.players,
                    [action.data.name]: new Player(action.data)
                }
            };

        case 'SET_PLAYER':
            if (!gameState[action.playerName]) {
                throw new Error('Tried to set undefined player', action.playerName);
            }
            return {
                ...gameState,
                players: {
                    ...gameState.players,
                    [action.playerName]: gameState[action.playerName].set(action.data)
                }
            };

        case 'SET_HOST_NAME':
            return {...gameState, hostName: action.name};

        case 'SET_ROOM_NAME':
            return {...gameState, roomName: action.roomName};

        default:
            return gameState;
    }
};
