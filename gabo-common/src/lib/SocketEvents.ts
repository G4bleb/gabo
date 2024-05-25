import { type ClientGame } from "@gabo-common/ClientGame";
import { ClientPlayer } from "./ClientPlayer";

export const enum ErrorCode {
  Success,
  ErrorNoRoomAvailable,
  ErrorNameUnavailable,
  ErrorAlreadyInGame,
  ErrorRoomFull,
}

export interface ServerToClientEvents {
  playerDisconnected: (playerName: string) => void;
  playerConnected: (playerName: string, player: ClientPlayer) => void;
  //deck shuffling (play animation)
  deckShuffled: () => void;
  gameStarted: () => void;

  gaboSaid: (playerName: string) => void;

  //TODO example stuff -- to remove
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  addPlayer: (
    playerName: string,
    roomName: string,
    callback: (
      result: ErrorCode,
      message: string,
      eventGame: ClientGame | null
    ) => void
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
