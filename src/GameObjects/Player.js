import Card from './Card';

export default class Player {
    constructor(opts={}) {
        this.connectionId = opts.connectionId || null;
        this.name = opts.name || 'Unknown';

        this.cards = opts.cards || [];
        this.hand = opts.hand || [];
    }

    set(data) {
        return new Player({
            name: this.name,
            cards: this.cards,
            hand: this.hand,
            connectionId: this.connectionId,
            ...data
        });
    }

    addSerialData(opts) {
        if (opts.connectionId) {
            this.connectionId = opts.connectionId;
        }
        if (opts.name) {
            this.name = opts.name;
        }
        if (opts.cards) {
            this.cards = opts.cards.map(c => new Card(c));
        }
        if (opts.hand) {
            this.hand = opts.hand.map(c => new Card(c));
        }
    }

    clone() {
        return new Player({
            name: this.name,
            connectionId: this.connectionId,
            cards: Card.cloneMulti(this.cards),
            hand: Card.cloneMulti(this.hand)
        });
    }

    addCard(card) {
        return this.set({
            cards: [...Card.cloneMulti(this.cards), card]
        });
    }

    addToHand(card) {
        return this.set({
            hand: [...Card.cloneMulti(this.hand), card]
        });
    }

    removeFromHand(idx=0) {
        return this.set({
            hand: Card.cloneMutli(this.hand).splice(idx, 1)
        });
    }

    removeCard(idx=0) {
        return this.set({
            cards: Card.cloneMutli(this.cards).splice(idx, 1)
        });
    }

    static cloneMulti(players) {
        return players.map(player => player.clone());
    }

    // Creates a player object from serial data.
    static deserialize(data) {
        return new Player({
            name: data.name,
            connectionId: data.connectionId,
            cards: (data.cards) ? data.cards.map(c => Card.deserialize(c)) : null,
            hand: (data.hand) ? data.hand.map(c => Card.deserialize(c)) : null
        });
    }

    static serialize(player) {
        return {
            name: player.name,
            cards: player.cards.map(c => Card.serialize(c)),
            hand: player.hand.map(c => Card.serialize(c))
        };
    }

    static cloneMap(map) {
        const playerList = Player.cloneMulti(Object.keys(map).map(n => map[n]));
        return playerList.reduce((accum, player) => ({
            ...accum,
            [player.name]: player
        }), {});
    }
}
