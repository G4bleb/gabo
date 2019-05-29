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

const STARTING_HAND_SIZE = 4;

class Card {
    constructor(rank, suit) {
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
    //Shuffles the deck
    shuffle(){
        var l = this.cards.length; 
        var tmp, r, j;
        for (j = 0; j < l; j++) {
            r = Math.floor(Math.random() * l);
            tmp = this.cards[j];
            this.cards[j] = this.cards[r];
            this.cards[r] = tmp;
        }
    }
    //Removes and returns the top card of the deck
    draw(){
        return this.cards.pop();
    }
    //Puts the given card on top of the deck
    putOnTop(card){
        this.cards.push(card);
    }
}

class Hand extends CardHolder {
    constructor(cards) {
        super(cards);
    }
    //Adds a card to the hand
    addCard(card){
        // this.cards.unshift(card);
        this.cards.push(card);
    }
    //Removes and returns the card of the deck at the given index
    popCard(cardIndex){
        return this.cards.splice(cardIndex, 1)[0];
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
        this.started = false;
    }
    //Start the game
    start() {
        var cards = [];
        for (let s in cardPossibilities.suits) {
            for (let r in cardPossibilities.ranks) {
                cards.push(new Card(r, s)); //Create the cards
            }
        }
        this.drawingDeck = new Deck(cards);//Create the deck 
        this.drawingDeck.shuffle();//Shuffle the deck
        this.discardDeck = new Deck([]);//Create the discard pile (an empty Deck)
        //Create the hands
        for(let playerId in this.players){//For all players
            for (let i = 0; i < STARTING_HAND_SIZE; i++) {
                this.players[playerId].hand.cards[i] = this.drawingDeck.draw();//Draw a card
            }
        }
        this.started = true;
    }
    //Swaps a card between two players
    swapCard(playerIdSwapping, cardSwappingIndex, playerIdSwapped, cardSwappedIndex){
        //[cardSwapping, cardSwapped] = [cardSwapped, cardSwapping];
        var tmp = this.players[playerIdSwapping].hand[cardSwappingIndex];
        this.players[playerIdSwapping].hand[cardSwappingIndex] = this.players[playerIdSwapped].hand[cardSwappedIndex];;
        this.players[playerIdSwapped].hand[cardSwappedIndex] = tmp;
    }
    //Shows a card to a player
    showCard(playerIdToShowTo, playerIdToBeShown, cardId){
        this.players[playerIdToBeShown].hand[cardId].revealedTo = playerIdToShowTo;
    }
}

module.exports.Deck = Deck;
module.exports.Hand = Hand;
module.exports.Card = Card;
module.exports.Player = Player;
module.exports.Game = Game;
