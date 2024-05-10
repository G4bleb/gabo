import { ErrorCode } from "@gabo-common/SocketEvents";

export class GaboError extends Error {
  public readonly code: ErrorCode;
  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
