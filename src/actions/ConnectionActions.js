// Actions ment to be sent over webRTC.
export default {
    sendError: function(to, message, except) {
        return {
            connectionAction: true,
            type: 'CONNECTION_ERROR',
            message,
            to,
            except
        };
    },

    sendStringMessage: function(to, msg, except) {
        return {
            connectioAction: true,
            type: 'CONNECTION_SEND_STRING_MESSAGE',
            msg,
            to,
            except
        };
    },

    sendCreatePlayer: function(to, data, except) {
        if (!data.name) {
            throw new Error('Name must be given when creating a player');
        }
        return {
            connectionAction: true,
            type: 'CONNECTION_CREATE_PLAYER',
            data,
            to,
            except
        };
    },

    sendCreatePlayerMulti: function(to, playerDatas, except) {
        playerDatas.forEach(data => {
            if (!data.name) {
                throw new Error('Name must be given when creating a player');
            }
        });

        return {
            connectionAction: true,
            type: 'CONNECTION_CREATE_PLAYER_MULTI',
            data: playerDatas,
            to,
            except
        };

    },

    sendPlayerData: function(to, opts, except) {
        return {
            connectionAction: true,
            type: 'CONNECTION_PLAYER_DATA',
            data: opts.data,
            playerName: opts.playerName,
            to,
            except
        };
    },

    sendHostName: function(to, name, except) {
        return {
            connectionAction: true,
            type: 'CONNECTION_HOST_NAME',
            name,
            to,
            except
        };
    },

    sendRemovePlayer: function(to, name, except) {
        return {
            connectionAction: true,
            type: 'CONNECTION_REMOVE_PLAYER',
            name,
            to,
            except
        };
    }
};
