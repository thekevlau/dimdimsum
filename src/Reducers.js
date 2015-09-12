import GameplayReducers from './reducers/GameplayReducers';

export default (state = {}, action) => {
    return {
        gameState: GameplayReducers(state.gameState, action)
    };
};
