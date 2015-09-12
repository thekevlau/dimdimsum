import { connect } from 'react-redux';
import DataActions from '../actions/DataActions';
import React from 'react';

const Send = React.createClass({
    getInitialState: function() {
        return {
            messageInput: null
        };
    },

    messageInputChange: function(evt) {
        this.setState({
            messageInput: evt.target.value
        });
    },

    send: function() {
        this.props.dispatch(DataActions.sendStringMessage(this.state.messageInput, 'ALL'));
    },

    render: function() {


        return (
            <div>
                <input onChange={this.messageInputChange} placeholder="Enter message to send." />
                <button onClick={this.send} />
            </div>
        );
    }
});

export default connect()(Send);
