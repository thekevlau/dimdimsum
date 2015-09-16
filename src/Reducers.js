import ErrorReducers from './reducers/ErrorReducers';
import {Reducers as GameplayReducers} from './actions/GameplayActions';

export default (state = {}, action) => {
    return {
        gameState: GameplayReducers(state.gameState, action),
        errorState: ErrorReducers(state.errorState, action)
    };
};
