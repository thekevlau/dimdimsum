export default {
    handlers: {},

    handleGameplayData: function(action, connectionType) {
        for (let event in this.handlers) {
            this.handlers[event].forEach(handler => handler.call(this, action, connectionType));
        }
    },

    registerGameplayHandler: function(event, handler) {
        this.handlers[event] = [...(this.handlers[event] || []), handler];
    }
};
