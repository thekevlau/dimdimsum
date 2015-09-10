import Peer from 'peerjs';
import React from 'react/addons';
import Router from 'react-router';

export default React.createClass({
    getInitialState: function() {
        return {
            messages: [],
            peer: null
        };
    },

    addMessage: function(msg) {
        this.setState({
            messages: [...this.state.messages, msg]
        });
    },

    componentDidMount: function() {
        const peer = new Peer('test', { key: '7xab2qyfqwz2rzfr' });
        this.setState({ peer });

        peer.on('connection', conn => {
            conn.on('data', data => {
                this.addMessage(data);
            });
        });
    },

    render: function() {
        const msgs = this.state.messages.map(msg => <div>{msg} </div>);

        return (
            <div>
                {msgs}
            </div>
        );
    }
});
