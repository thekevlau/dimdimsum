import { connect } from 'react-redux';
import ConnectionActions from '../actions/ConnectionActions';
import GameplayActions from '../actions/GameplayActions';
import Player from '../GameObjects/Player';
import React from 'react/addons';
import Router from 'react-router';

const Home = React.createClass({

    mixins: [Router.Navigation],

    getInitialState: function() {
        return {
            createDialog: false,
            joinDialog: false,
            roomName: '',
            name: ''
        }
    },

    componentDidMount: function() {
        this.props.clear();
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

        this.props.setupConnectionManager(connectionType, this.state.roomName);

        const dispatch = this.props.dispatch;

        // Set up self player object.
        dispatch(GameplayActions.createSelf(new Player({
            name: this.state.name
        })));
        // Set room name.
        dispatch(GameplayActions.setRoomName(this.state.roomName));
        // Set connection type.
        dispatch(GameplayActions.setConnectionType(connectionType));

        // Setup general gameplay handlers.
        this.props.setupHandlers(connectionType, this.state.name);

        // If a client, tell host about yourself.
        if (connectionType === 'CLIENT') {
            dispatch(ConnectionActions.sendCreatePlayer('HOST', {
                name: this.state.name
            }));
        }
        // Otherwise, set up host name.
        else {
            dispatch(GameplayActions.setHostName(this.state.name));
        }

        this.transitionTo('wait');
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
