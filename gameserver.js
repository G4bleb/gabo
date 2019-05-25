import cardPossibilities from "js/gamecommon";

class CardHolder{
    constructor(cards) {
        this.cards = cards;
    }
}

class Deck extends CardHolder{
    constructor(cards){
        super(cards);
    }
    shuffle(){
        var l = this.cards.length; 
        var tmp;
        for (j = 0; j < l; j++) {
            r = Math.floor(Math.random() * l);
            tmp = this.cards[j];
            this.cards[j] = this.cards[r];
            this.cards[r] = tmp;
        }
    }
}

class Hand extends CardHolder {
    constructor(cards) {
        super(cards);
    }
}

class Card{
    constructor(rank, suit){
        this.rank = rank;
        this.suit = suit;
    }
    get value(){
        return this.value;
    }
}

function startGame() {
    myGameArea.start();
    var cards = [];

    for (let s in cardPossibilities.suits) {
        for (let r in cardPossibilities.ranks) {
            cards.push() = new Card(r, s);
        }
    }
    drawingDeck = new Deck(cards);
    drawingDeck.shuffle();
    //Créer les mains
}
