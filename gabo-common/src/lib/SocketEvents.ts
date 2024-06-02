import { type ClientGame } from "./ClientGame";
import { ClientPlayer } from "./ClientPlayer";

export const enum ErrorCode {
  ErrorNoRoomAvailable = "ErrorNoRoomAvailable",
  ErrorNameUnavailable = "ErrorNameUnavailable",
  ErrorAlreadyInGame = "ErrorAlreadyInGame",
  ErrorRoomFull = "ErrorRoomFull",
  ErrorInvalidName = "ErrorInvalidName",
}

export interface ServerToClientEvents {
  playerDisconnected: (playerName: string) => void;
  playerConnected: (playerName: string, player: ClientPlayer) => void;
  //deck shuffling (play animation)
  deckShuffled: () => void;
  gameStarted: () => void;

  gaboSaid: (playerName: string) => void;

  playerTurn: (playerName: string) => void;

  //TODO example stuff -- to remove
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  addPlayer: (
    playerName: string,
    roomName: string,
    onSuccess: (eventGame: ClientGame) => void
  ) => void;
  //game start button pressed
  startGame: () => void;
  showPlayerCard: (playerName: string, cardIndex: string) => void;
  swapPlayerCards: (
    playerName1: string,
    cardIndex1: string,
    playerName2: string,
    cardIndex2: string
  ) => void;
  drawCard: () => void;
  discardCard: (cardIndex: string) => void;

  sayGabo: () => void;
}

export interface SocketData {}

export interface InterServerEvents {}
