import ActionUtils from '../utils/ActionUtils';
import ConnectionManager from '../utils/ConnectionManager';
import Logger from '../utils/Logger';
// Actions ment to be sent over webRTC.

const handler = action => {
    Logger.debug('Sending action', action);
    ConnectionManager.send(action.to, {
        type: action.type,
        data: action.data
    }, action.except);
};

const actions = {
    sendError: handler,
    sendCreatePlayer: handler,
    sendCreatePlayerMulti: handler,
    sendPlayerData: handler,
    sendHostName: handler,
    sendRemovePlayer: handler,
    sendStart: handler,
    sendUpdatePlayers: handler,
    sendSetDeck: handler,
    close: action => {
        ConnectionManager.close(action.data)
    }
};

export default ActionUtils.generateConnectionActionCreators(actions);

export const Reducers = (store, action) => {
    const type = action.type.replace('connection', 'send');
    if (actions[type]) {
        return actions[type](action);
    }
};

