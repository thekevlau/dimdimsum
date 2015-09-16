import Card from './Card';

export default class Deck {
    constructor(cards=[]) {
        if (cards.length) {
            this.cards = cards;
            return;
        }

        for (let i = 0; i < 14; i++) {
            cards.push(new Card('TEMPURA'));
        }

        for (let i = 0; i < 14; i++) {
            cards.push(new Card('SHASHIMI'));
        }

        for (let i = 0; i < 14; i++) {
            cards.push(new Card('DUMPLING'));
        }

        for (let i = 0; i < 12; i++) {
            cards.push(new Card('MAKI2'));
        }

        for (let i = 0; i < 8; i++) {
            cards.push(new Card('MAKI3'));
        }

        for (let i = 0; i < 6; i++) {
            cards.push(new Card('MAKI1'));
        }

        for (let i = 0; i < 10; i++) {
            cards.push(new Card('SALMONNIGIRI'));
        }

        for (let i = 0; i < 5; i++) {
            cards.push(new Card('SQUIDNIGIRI'));
        }

        for (let i = 0; i < 5; i++) {
            cards.push(new Card('EGGNIGIRI'));
        }

        for (let i = 0; i < 10; i++) {
            cards.push(new Card('PUDDING'));
        }

        for (let i = 0; i < 6; i++) {
            cards.push(new Card('WASABI'));
        }

        for (let i = 0; i < 4; i++) {
            cards.push(new Card('CHOPSTICKS'));
        }

        this.cards = Deck.shuffleCards(cards);
    }

    getCombo(cards) {
        return null;
    }

    clone() {
        return new Deck(this.cards);
    }

    top() {
        return this.cards.last();
    }

    draw() {
        return new Deck(this.cards.slice(0, this.cards.length - 1));
    }

    static serialize(deck) {
        return deck.cards.map(c => Card.serialize(c));
    }

    static deserialize(data) {
        return new Deck(data.cards.map(c => Card.deserialize(c)));
    }

    static shuffleCards(cards) {
        cards = Card.cloneMulti(cards);

        if (cards.length < 1) return cards;

        for (let i = 0; i < cards.length - 1; i++) {
            // Get random index.
            const idx = Math.floor(Math.random()*(cards.length - i - 2) + i);

            // Swap.
            const holder = cards[idx];
            cards[idx] = cards[i];
            cards[i] = holder;
        }

        return cards;
    }
}
