import ConnectionManager from '../utils/ConnectionManager';

export default store => next => action => {
    if (action.connectionAction) {
        switch (action.type) {
            case 'CONNECTION_ERROR':
                ConnectionManager.send(action.to, {
                    message: action.message,
                    type: action.type
                }, action.except);
                break;

            case 'CONNECTION_PLAYER_DATA':
                ConnectionManager.send(action.to, {
                    playerName: action.playerName,
                    data: action.data,
                    type: action.type
                }, action.except);
                break;

            case 'CONNECTION_CREATE_PLAYER':
                ConnectionManager.send(action.to, {
                    data: action.data,
                    type: action.type
                }, action.except);
                break;

            case 'CONNECTION_CREATE_PLAYER_MULTI':
                ConnectionManager.send(action.to, {
                    data: action.data,
                    type: action.type
                }, action.except);
                break;

            case 'CONNECTION_HOST_NAME':
                ConnectionManager.send(action.to, {
                    name: action.name,
                    type: action.type
                }, action.except);
                break;

            case 'CONNECTION_REMOVE_PLAYER':
                ConnectionManager.send(action.to, {
                    name: action.name,
                    type: action.type
                }, action.except);
                break;
        }
    }
    return next(action);
};
