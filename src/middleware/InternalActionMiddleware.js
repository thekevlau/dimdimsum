import ConnectionManager from '../utils/ConnectionManager';

export default store => next => action => {
    if (action.internal) {
        switch (action.type) {
            case 'CONNECTION_SEND_STRING_MESSAGE':
                ConnectionManager.send({
                    msg: action.msg,
                    type: action.type
                }, action.to);
        }
    }
    return next(action);
};
