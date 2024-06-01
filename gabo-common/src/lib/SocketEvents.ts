import { type ClientGame } from "./ClientGame";
import { ClientPlayer } from "./ClientPlayer";

export const enum ErrorCode {
  Success = "Success",
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
    onSuccess: (eventGame: ClientGame) => void,
    onError: (error: ErrorCode, message: string) => void
  ) => void;
  //game start button pressed
  startGame: () => void;
  playerCardClicked: (playerName: string, cardIndex: string) => void;
  drawCard: () => void;
  discardCard: (cardIndex: string) => void;

  sayGabo: () => void;
}

export interface SocketData {}

export interface InterServerEvents {}
