import { connect } from 'react-redux';
import GameplayHandlers from '../mixins/GameplayHandlers';
import React from 'react';

const Receive = React.createClass({
    mixins: [GameplayHandlers],

    getInitialState: function() {
        return {
            messages: []
        };
    },

    componentDidMount: function() {
        this.registerGameplayHandler('CONNECTION_SEND_STRING_MESSAGE', action => {
            this.setState({
                messages: [...this.state.messages, action.msg]
            });
        });
    },

    render: function() {
        const msg = this.state.messages.map(msg => <div>{msg} </div>)

        return (
            <div>
                {msg}
            </div>
        );
    }
});

export default Receive;
