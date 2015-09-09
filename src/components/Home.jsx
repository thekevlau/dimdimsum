import { connect } from 'react-redux';
import React from 'react/addons';
import Router from 'react-router';

const Home = React.createClass({

    mixins: [Router.Navigation],

    getInitialState: function() {
        return {
            createDialog: false,
            joinDialog: false,
            roomName: ''
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

    go: function(){
        if (this.state.joinDialog) {
            this.transitionTo('join');
        }
        else {
            this.transitionTo('create');
        }

    },

    roomNameChange: function(event) {
        this.setState({
            roomName: event.target.value
        });
    },

    test: async () => {
        return 5;
    },

    render: function() {
        console.log(this.props);
        let dialog, buttons;
        if (this.state.createDialog || this.state.joinDialog) {
            dialog = (
                <div>
                    <button onClick={this.back}>&#8592;</button>
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
export default connect(state => state)(Home);
