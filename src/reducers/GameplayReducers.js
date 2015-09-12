export default (gameState = {}, action) => {
    switch (action.type) {
        case 'SET_NAME':
            return {...gameState, name: action.name};

        case 'ADD_PLAYER':
            return {
                ...gameState,
                players: {
                    ...gameState.players,
                    [action.player.name]: action.player
                }
            };

        case 'ADD_HOST_PLAYER':
            return {...gameState, hostPlayer: action.hostPlayer};

        case 'SET_ROOM_NAME':
            return {...gameState, roomName: action.roomName};

        default:
            return gameState;
    }
};
