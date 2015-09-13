import Logger from '../utils/Logger';

export default store => next => action => {
    Logger.debugGroup(action.type);
    Logger.debug('Dispatching', action);
    let result = next(action);
    Logger.debug('Next State', store.getState());
    Logger.debugGroupEnd(action.type);
    return result;
};
