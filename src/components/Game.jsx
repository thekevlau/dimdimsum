import {connect} from 'react-redux';
import Deck from '../GameObjects/Deck';
import ErrorBanner from './ErrorBanner';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionHandlers from '../mixins/ConnectionHandlers';
import GameplayActions from '../actions/GameplayActions';
import Player from '../GameObjects/Player';
import PlayerComponent from './Player';
import React from 'react';
import Router from 'react-router';

const Game = React.createClass({
    mixins: [ConnectionHandlers(), Router.Navigation],

    componentDidMount: function() {
        // set up deck.
        const {ctype, dispatch, playerList} = this.props;

        this.registerConnectionHandler('connectionUpdatePlayers', action => {
            if (ctype === 'HOST') {
                throw new Error('Host is source of truth, clients shouldn\'t edit its game state.');
            }
            dispatch(GameplayActions.updatePlayers(action.data.map(p => Player.deserialize(p))));
        });

        if (ctype === 'HOST'){
            let deck = new Deck();
            let players = playerList;
            // Set up hands for each player.
            for (let i = 0; i < 7; i++) {
                players = players.map(p => {
                    const card = deck.top();
                    deck = deck.draw();
                    return p.addToHand(card);
                });
            }

            dispatch(GameplayActions.setDeck(deck));
            dispatch(GameplayActions.updatePlayers(players));

            dispatch(ConnectionActions.sendSetDeck('ALL', Deck.serialize(deck)));
            dispatch(ConnectionActions.sendUpdatePlayers('ALL', players.map(p =>
                    Player.serialize(p))));
        }
    },

    render: function() {
        const {errors, playerList} = this.props;

        return (
            <div>
                <ErrorBanner errors={errors} />
                <PlayerComponent player={playerList[0]} />
                -
                <PlayerComponent player={playerList[1]} />
                -
                <PlayerComponent player={playerList[2]} />
                -
                <PlayerComponent player={playerList[3]} />
            </div>
        );
    }
});

export default connect(state => ({
    errors: state.errorState.errors,
    players: state.gameState.players,
    hostName: state.gameState.hostName,
    self: state.gameState.self,
    ctype: state.gameState.connectionType,
    deck: state.gameState.deck,
    playerList: [state.gameState.self, ...Object.keys(state.gameState.players).map(n => state.gameState.players[n])]
}))(Game);
