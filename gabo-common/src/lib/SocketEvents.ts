export const enum ErrorCode {
  Success,
  ErrorNoRoomAvailable,
  ErrorNameUnavailable,
  ErrorAlreadyInGame,
  ErrorRoomFull,
}

export interface ServerToClientEvents {
  addPlayer: (
    playerName: string,
    roomName: string,
    callback: (result: ErrorCode, message: string) => void
  ) => void;
  //player left
  //deck shuffling (play animation)
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  //socket closing = player leaving
  //game start button pressed
  //select card (can equal play card if in no context of selection ?)
  //unselect card
  hello: () => void;
}

export interface SocketData {}

export interface InterServerEvents {}
