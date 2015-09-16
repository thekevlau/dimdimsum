import { connect } from 'react-redux';
import ErrorBanner from './ErrorBanner';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionHandlers from '../mixins/ConnectionHandlers';
import React from 'react';
import Router from 'react-router';

const WaitRoom = React.createClass({
    mixins: [ConnectionHandlers(), Router.Navigation],

    componentDidMount: function() {
        this.registerConnectionHandler('connectionStart', () => {
            if (this.props.ctype === 'HOST') {
                throw new Error('Host shouldn\'t be told to start the game');
            }
            else {
                this.transitionTo('game');
            }
        });
    },

    componentWillUnmount: function() {
        this.unregisterHandlers();
    },

    startGame: function() {
        this.props.dispatch(ConnectionActions.sendStart('ALL'));
        this.transitionTo('game');
    },

    leave: function() {
        this.transitionTo('home');
    },

    render: function() {
        const {errors, players, hostName, self} = this.props;
        const playerList = [self, ...Object.keys(players).map(name => players[name])];

        if (errors.length) {
            return (
                <div>
                    {errors[0]}
                </div>
            );
        }

        else if (Object.keys(players) === 0 && hostName !== self.name) {
            return (
                <div>
                    Loading...
                </div>
            );
        }

        const list = playerList.map(player => {
            if (player.name === hostName) {
                return <li>*{player.name}</li>;
            }
            return <li>{player.name}</li>;
        });

        let start;
        if (self.name === hostName) {
            start = <button onClick={this.startGame}>Start Game</button>
        }

        return (
            <div>
                <ErrorBanner errors={errors} />
                <div>
                    <ul>
                        {list}
                    </ul>
                    {start}
                    <button onClick={this.leave}>Leave</button>
                </div>
            </div>
        );
    }
});

export default connect(state => ({
    errors: state.errorState.errors,
    players: state.gameState.players,
    hostName: state.gameState.hostName,
    self: state.gameState.self,
    ctype: state.gameState.connectionType
}))(WaitRoom);
