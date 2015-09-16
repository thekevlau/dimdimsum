export default class Card {
    static types = [
        'MAKI1',
        'MAKI2',
        'MAKI3',
        'CHOPSTICKS',
        'WASABI',
        'SQUIDNIGIRI',
        'SALMONNIGIRI',
        'EGGNIGIRI',
        'PUDDING',
        'DUMPLING',
        'TEMPURA',
        'SHASHIMI'
    ];

    constructor(type) {
        if (typeof type !== 'string') {
            throw new Error('Card type must be a string');
        }
        this.type = type;
    }

    getCombo(cards) {
        return null;
    }

    clone() {
        return new Card(this.type);
    }

    static randomCard() {
        return new Card(Card.randomType());
    }

    static randomType() {
        return Card.types[Math.floor(Math.random()*Card.types.length)];
    }

    static cloneMulti(cards) {
        return cards.map(c => c.clone());
    }

    static serialize(card) {
        return card.type;
    }

    static deserialize(type) {
        return new Card(type);
    }
}
