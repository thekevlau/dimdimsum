import Peer from 'peerjs';
import React from 'react/addons';
import Router from 'react-router';

export default React.createClass({
    getInitialState: function() {
        return {
            peer: null,
            conn: null,
            opened: false,
            messageInput: ''
        };
    },

    componentDidMount: function() {
        const peer = new Peer({ key: '7xab2qyfqwz2rzfr' });
        const conn = peer.connect('test');

        conn.on('open', () => {
            this.setState({ opened: true });
        });

        this.setState({ peer, conn});
    },

    sendMessage: function() {
        if (this.state.opened) {
            this.state.conn.send(this.state.messageInput);
        }
        else {
            console.log('Not opened yet!');
        }
    },

    messageChange: function(evt) {
        this.setState({
            messageInput: evt.target.value
        });
    },

    render: function() {
        return (
            <div>
                <input type="text" onChange={this.messageChange} placeholder="Enter Message" />
                <button onClick={this.sendMessage}>Send</button>
            </div>
        );
    }
});
