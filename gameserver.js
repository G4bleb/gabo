const cardPossibilities = {
    "ranks": {
        "2": "Two",
        "3": "Three",
        "4": "Four",
        "5": "Five",
        "6": "Six",
        "7": "Seven",
        "8": "Eight",
        "9": "Nine",
        "10": "Ten",
        "J": "Jack",
        "Q": "Queen",
        "K": "King",
        "A": "Ace"
    },
    "suits": {
        "S": "Spades",
        "D": "Diamonds",
        "C": "Clubs",
        "H": "Hearts"
    }
}

class Card {
    constructor(rank, suit) {
        this.revealedTo = -1;
        this.rank = rank;
        this.suit = suit;
    }
}

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
    draw(){
        return this.cards.pop();
    }
    putOnTop(card){
        this.cards.push(card);
    }
}

class Hand extends CardHolder {
    constructor(cards) {
        super(cards);
    }
    addCard(card){
        cards.unshift(card);
    }
    popCard(cardIndex){
        return cards.splice(cardIndex, 1)[0];
    }
}

class Player{
    constructor(nickname, hand){
        this.nickname = nickname;
        this.hand = hand;
    }
    
}

class Game{
    constructor(players){
        this.players = players;
    }
    start() {
        var cards = [];
        for (let s in cardPossibilities.suits) {
            for (let r in cardPossibilities.ranks) {
                cards.push() = new Card(r, s); //Créer les cartes
            }
        }
        this.drawingDeck = new Deck(cards);//Créer la pioche
        this.drawingDeck.shuffle();//Mélanger la pioche
        this.discardDeck = new Deck([]);//Créer la défausse
        //Créer les mains
        
        
    }
    swapCard(playerIdSwapping, cardSwappingIndex, playerIdSwapped, cardSwappedIndex){
        //[cardSwapping, cardSwapped] = [cardSwapped, cardSwapping];
        var tmp = this.players[playerIdSwapping].hand[cardSwappingIndex];
        this.players[playerIdSwapping].hand[cardSwappingIndex] = this.players[playerIdSwapped].hand[cardSwappedIndex];;
        this.players[playerIdSwapped].hand[cardSwappedIndex] = tmp;
    }
    showCard(playerIdToShowTo, playerIdToBeShown, cardId){
        this.players[playerIdToBeShown].hand[cardId].revealedTo = playerIdToShowTo;
    }
}

module.exports.Deck = Deck;
module.exports.Hand = Hand;
module.exports.Card = Card;
module.exports.Player = Player;
module.exports.Game = Game;
