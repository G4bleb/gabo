import { Card } from "./Card";

class Hand {
  private cards: Card[] = [];

  public clear(): Card[]{
    const ret = this.cards
    this.cards = [];
    return ret;
  }
}

export class Player {
  public hand = new Hand();

  public clearHand() {
    this.hand.clear();
  }
}
