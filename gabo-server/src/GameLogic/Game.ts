import { Deck } from "./Deck";
import { Player } from "./Player";

export class Game {
  private drawDeck: Deck = new Deck();
  private discardDeck: Deck = new Deck();
  private players: Player[] = [];

  public start() {
    this.clear();
    this.drawDeck.generateCards();
    for (const player of this.players) {
      //distributecards
    }
  }

  public clear() {
    this.drawDeck.clear();
    this.discardDeck.clear();
    for (const player of this.players) {
      player.clearHand();
    }
  }

  addPlayer() {
    //Take four cards from deck and assign them to the new player
    //set player id
  }
  removePlayer() {}
}
