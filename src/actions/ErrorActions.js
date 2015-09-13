export default {
    error: function(message) {
        return {
            type: 'APP_ERROR',
            message
        };
    }
};
