import { connect } from 'react-redux';
import ConnectionManager from '../utils/ConnectionManager';
import GameplayActions from '../actions/GameplayActions';
import GameplayHandlers from '../mixins/GameplayHandlers';
import React from 'react/addons';
import Router from 'react-router';

const Home = React.createClass({

    mixins: [GameplayHandlers, Router.Navigation],

    getInitialState: function() {
        return {
            createDialog: false,
            joinDialog: false,
            roomName: '',
            name: ''
        }
    },

    createRoom: function() {
        this.setState({
            createDialog: true,
            joinDialog: false
        });
    },

    joinRoom: function() {
        this.setState({
            createDialog: false,
            joinDialog: true
        });
    },

    back: function() {
        this.setState({
            createDialog: false,
            joinDialog: false
        });
    },

    go: function() {
        const connectionType = (this.state.joinDialog) ? 'CLIENT' : 'HOST';

        ConnectionManager.setup(connectionType, this.state.roomName);
        ConnectionManager.on('connectionData', (data, conn, ctype) => {
            this.handleGameplayData(data, ctype);
        });

        this.props.dispatch(GameplayActions.setName(this.state.name));
        this.props.dispatch(GameplayActions.setRoomName(this.state.roomName));

        if (connectionType === 'CLIENT') {
            this.transitionTo('receive');
        }
        else {
            this.transitionTo('send');
        }
    },

    roomNameChange: function(event) {
        this.setState({
            roomName: event.target.value
        });
    },

    nameChange: function(event) {
        this.setState({
            name: event.target.value
        });
    },

    render: function() {
        let dialog, buttons;
        if (this.state.createDialog || this.state.joinDialog) {
            dialog = (
                <div>
                    <button onClick={this.back}>&#8592;</button>
                    <input type="text" onChange={this.nameChange} placeholder="Enter Name" />
                    <input type="text" onChange={this.roomNameChange} placeholder="Enter Room Name" />
                    <button onClick={this.go}>Go</button>
                </div>
            );
        }
        else {
            buttons = (
                <div>
                    <button onClick={this.createRoom}>Create Room</button>
                    <button onClick={this.joinRoom}>Join Room</button>
                </div>
            );
        }

        return (
            <div className="home">
                {buttons}
                {dialog}
            </div>
        );
    }
});

// Look into reselect: https://github.com/faassen/reselect.
export default connect()(Home);
