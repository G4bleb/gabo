import { Card } from "@gabo-common/Card";
import { ClientPlayer } from "@gabo-common/ClientPlayer";

class Hand {
  public cards: Card[] = [];

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
  public readonly name: string;
  public hand = new Hand();

  constructor(playerName: string){
    this.name = playerName;
  }

  public clearHand() {
    this.hand.clear();
  }

  toClientPlayer(): ClientPlayer {
    return { handSize: this.hand.size() };
  }
}
