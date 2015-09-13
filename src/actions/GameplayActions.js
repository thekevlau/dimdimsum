export default {
    createSelf: function(data) {
        return {
            type: 'CREATE_SELF',
            data
        };
    },

    setSelf: function(data) {
        return {
            type: 'SELF_DATA',
            data
        };
    },

    createPlayer: function(data) {
        return {
            type: 'CREATE_PLAYER',
            data
        };
    },

    setPlayer: function(playerName, data) {
        return {
            type: 'PLAYER_DATA',
            playerName,
            data
        };
    },

    setRoomName: function(roomName) {
        return {
            type: 'SET_ROOM_NAME',
            roomName
        };
    },

    setHostName: function(name) {
        return {
            type: 'SET_HOST_NAME',
            name
        };
    },

    sync: function(data) {
        return {
            type: 'SYNC',
            data
        };
    }
};
