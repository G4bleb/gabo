import { GaboError } from "../GaboError";
import { Deck } from "./Deck";
import { Player } from "./Player";
import { ErrorCode } from "@gabo-common/SocketEvents";
import { ClientGame } from "@gabo-common/ClientGame";
import { ClientPlayer } from "@gabo-common/ClientPlayer";
import { ClientDeck } from "@gabo-common/ClientDeck";
import { CardValues } from "@gabo-common/Card";

export const MAX_PLAYERS = 8;

export class Game {
  private drawDeck: Deck = new Deck();
  private discardDeck: Deck = new Deck();
  private players: Record<string, Player> = {};
  private started: boolean = false;
  private playerInTurn: string = "";

  constructor() {
    this.drawDeck.generateCards();
  }

  public start() {
    this.clear();
    this.drawDeck.generateCards();
    this.drawDeck.shuffle();
    for (const playerName in this.players) {
      for (let i = 0; i < 4; i++) {
        this.players[playerName].hand.cards.push(this.drawDeck.pop());
      }
    }
    this.started = true;
    this.nextTurn();
  }

  public isStarted(): boolean {
    return this.started;
  }

  public clear() {
    this.drawDeck.clear();
    this.discardDeck.clear();
    for (const playerName in this.players) {
      this.players[playerName].clearHand();
    }
  }

  addPlayer(playerName: string) {
    if (playerName in this.players) {
      throw new GaboError(
        ErrorCode.ErrorNameUnavailable,
        "A player with that name is already in the game."
      );
    }
    const player = new Player(playerName);
    this.players[playerName] = player;
    //Take four cards from deck and assign them to the new player
    for (let i = 0; i < 4; i++) {
      player.hand.cards.push(this.drawDeck.pop());
    }
  }

  removePlayer(playerName: string) {
    if (!(playerName in this.players)) {
      throw new Error("Tried to remove a player that is not in the game");
    }
    const hand = this.players[playerName]!.hand;
    //Leaving player's cards are sent to deck.
    for (const card of hand.clear()) {
      this.drawDeck.putCardOnTop(card);
    }
    this.drawDeck.shuffle();
    delete this.players[playerName];
  }

  getPlayer(playerName: string) {
    return this.players[playerName];
  }

  playerCount(): number {
    return Object.keys(this.players).length;
  }

  getClientPlayers() {
    const clientPlayers: Record<string, ClientPlayer> = {};
    for (const playerName in this.players) {
      clientPlayers[playerName] = this.players[playerName].toClientPlayer();
    }
    return clientPlayers;
  }

  toClientGame(): ClientGame {
    const drawDeck: ClientDeck = {
      cardOnTop: this.drawDeck.size() ? { value: CardValues.RED_BACK } : null,
    };

    const discardDeck: ClientDeck = {
      cardOnTop: this.discardDeck.size() ? this.discardDeck.top() : null,
    };

    const players = this.getClientPlayers();

    return { drawDeck, discardDeck, players, started: this.started };
  }

  public nextTurn() {
    const playerNames = Object.keys(this.players);
    if (!this.playerInTurn) {
      this.playerInTurn =
        playerNames[Math.floor(Math.random() * playerNames.length)];
      return;
    }

    let nextPlayerShouldPlay = false;
    for (const playerName in this.players) {
      if (nextPlayerShouldPlay) {
        this.playerInTurn = playerName;
        return;
      }
      if (this.playerInTurn === playerName) {
        nextPlayerShouldPlay = true;
      }
    }
    if (nextPlayerShouldPlay) {
      this.playerInTurn = playerNames[0];
    }
  }

  public whoIsPlaying() {
    return this.playerInTurn;
  }
}
