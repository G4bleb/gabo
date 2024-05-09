import { Card } from "./Card";

export class Deck {
  private cards: Card[] = [];

  public generateCards() {
    for (const suit in cardPossibilities.suits) {
      for (const rank in cardPossibilities.ranks) {
        this.cards.push({ value: rank + suit });
      }
    }
  }

  public clear() {
    this.cards = [];
  }

  public shuffle() {
    const length = this.cards.length;
    var tmp, randomIndex, i;
    for (i = 0; i < length; i++) {
      randomIndex = Math.floor(Math.random() * length);
      tmp = this.cards[i];
      this.cards[i] = this.cards[randomIndex];
      this.cards[randomIndex] = tmp;
    }
  }

  //Remove and return the top card of the deck
  public draw(): Card {
    if (this.cards.length < 1) {
      throw Error("The deck is empty");
    }
    return this.cards.pop() as Card;
  }

  public putCardOnTop(card: Card) {
    this.cards.push(card);
  }
}

const cardPossibilities = {
  ranks: {
    "2": "Two",
    "3": "Three",
    "4": "Four",
    "5": "Five",
    "6": "Six",
    "7": "Seven",
    "8": "Eight",
    "9": "Nine",
    "10": "Ten",
    J: "Jack",
    Q: "Queen",
    K: "King",
    A: "Ace",
  },
  suits: {
    S: "Spades",
    D: "Diamonds",
    C: "Clubs",
    H: "Hearts",
  },
};
