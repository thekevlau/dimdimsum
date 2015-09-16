export default {
    error: function(message, fatal) {
        return {
            type: 'APP_ERROR',
            message,
            fatal: fatal === 'FATAL'
        };
    }
};
