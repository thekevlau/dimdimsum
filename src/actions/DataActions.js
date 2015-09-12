// Not intended to mutate state, responded to by send data middleware.
// Types prefixed with _ to prevent conflicts.
export default {
    error: function(msg, to, ...info) {
        return {
            internal: true,
            type: 'CONNECTION_ERROR',
            msg,
            info
        };
    },

    sendStringMessage: function(msg, to) {
        return {
            internal: true,
            type: 'CONNECTION_SEND_STRING_MESSAGE',
            msg,
            to
        };
    },

    playerData: function(to, opts) {
        if (opts.connectionId) {
            return {
                internal: true,
                type: 'CONNECTION_PLAYER_DATA_BY_CONNECTION_ID',
                data: opts.data,
                connectionId: opts.connectionId
            };
        }
        else if (opts.playerName) {
            return {
                internal: true,
                type: 'CONNECTION_PLAYER_DATA_BY_NAME',
                data: opts.data,
                playerName: opts.playerName
            };
        }

        throw new Error('Must identify player when sending data.');
    }
};
