import { GaboError } from "src/GaboError";
import { Deck } from "./Deck";
import { Player } from "./Player";
import { ErrorCode } from "@gabo-common/SocketEvents";

export const MAX_PLAYERS = 8;

export class Game {
  private drawDeck: Deck = new Deck();
  private discardDeck: Deck = new Deck();
  private players: Map<string, Player> = new Map();

  public start() {
    this.clear();
    this.drawDeck.generateCards();
    for (const player of this.players.values()) {
      //distributecards
    }
  }

  public clear() {
    this.drawDeck.clear();
    this.discardDeck.clear();
    for (const player of this.players.values()) {
      player.clearHand();
    }
  }

  addPlayer(playerName: string) {
    if (this.players.has(playerName)) {
      throw new GaboError(
        ErrorCode.ErrorNameUnavailable,
        "A player with that name is already in the game."
      );
    }
    this.players.set(playerName, new Player());
    //Take four cards from deck and assign them to the new player
    //set player id
  }
  removePlayer() {}
}
