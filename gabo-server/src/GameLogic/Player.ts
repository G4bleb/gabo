import { Card } from "@gabo-common/Card";

class Hand {
  private cards: Card[] = [];

  public clear(): Card[] {
    const ret = this.cards;
    this.cards = [];
    return ret;
  }

  public size(): number {
    return this.cards.length;
  }
}

export class Player {
  public hand = new Hand();

  public clearHand() {
    this.hand.clear();
  }
}
