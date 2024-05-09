import { Card } from "./Card";

class Hand {
  private cards: Card[] = [];

  public clear() {
    this.cards = [];
  }
}

export class Player {
  public hand = new Hand();

  public clearHand() {
    this.hand.clear();
  }
}
