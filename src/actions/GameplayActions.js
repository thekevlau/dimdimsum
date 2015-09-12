export default {
    setName: function(name) {
        return {
            type: 'SET_NAME',
            name
        };
    },

    setRoomName: function(roomName) {
        return {
            type: 'SET_ROOM_NAME',
            roomName
        };
    }
};
