import {Reducers as ConnectionReducers} from '../actions/ConnectionActions';

export default store => next => action => {
    if (action.connectionAction) {
        ConnectionReducers(store, action);
    }
    return next(action);
};
