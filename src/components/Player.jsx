import React from 'react';

export default React.createClass({
    render: function() {
        const {player} = this.props;

        if (!player) {
            return <div></div>;
        }

        const cards = player.cards.map(c => <li>{c.type}</li>);
        const hand = player.hand.map(c => <li>{c.type}</li>);

        return (
            <div>
                <p>Name: {player.name}</p>
                <p>Cards: <ul>{cards}</ul></p>
                <p>Hand: <ul>{hand}</ul></p>
            </div>
        );
    }
});
