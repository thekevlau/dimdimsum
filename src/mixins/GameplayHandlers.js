// Map of componentIds to eventIds to handler.
const handlers = {};
let idCounter = 0;

export default () => {
    // id uniqie to each component.
    const id = idCounter++;
    handlers[id] = {};

    return {
        handleGameplayData: function(action, connectionId) {
            for (let component in handlers) {
                if (!handlers[component][action.type]) {
                    continue;
                }
                handlers[component][action.type].call(this, action, connectionId);
            }
        },

        registerGameplayHandler: function(actionType, handler) {
            handlers[id][actionType] = handler;
        },

        unregisterGameplayHandler: function(actionType) {
            delete handlers[id][actionType];
        }
    };
};
