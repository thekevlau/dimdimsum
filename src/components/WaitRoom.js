import { connect } from 'react-redux';
import React from 'react';

const WaitRoom = React.createClass({
    componentDidMount: function() {

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

        return (
            <div>
                <ul>
                    {list}
                </ul>
            </div>
        );
    }
});

export default connect(state => ({
    errors: state.errorState.errors,
    players: state.gameState.players,
    hostName: state.gameState.hostName,
    self: state.gameState.self
}))(WaitRoom);
