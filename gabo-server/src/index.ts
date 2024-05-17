import Fastify from "fastify";
import FastifySocketIO from "fastify-socket.io";
import { Server, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@gabo-common/SocketEvents.js";
import { ErrorCode } from "@gabo-common/SocketEvents.js";
import { State } from "./State";
import { GaboError } from "./GaboError";
import { Game } from "./GameLogic/Game";

const MAX_ROOMS = 100;

const server = Fastify({ logger: true });
const state = new State();

// server.get("/ping", async (request, reply) => {
//   return "pong\n";
// });

server.register(FastifySocketIO, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET"],
  },
});

server.ready((err) => {
  if (err) throw err;

  server.io.on("connection", (sock: Socket) => {
    console.info("Socket connected!", sock.id);

    // TODO check if socket has already a room
    sock.on(
      "addPlayer",
      (
        playerName: string,
        roomName: string,
        callback: (result: ErrorCode, message: string) => void
      ) => {
        console.log("received addPlayer ", playerName, roomName);
        if (sock.data.room !== undefined) {
          callback(ErrorCode.ErrorAlreadyInGame, "You are already in a game.");
        }

        //If the room already exists, add the player to the game
        if (state.games.has(roomName)) {
          const game = state.games.get(roomName) as Game;
          try {
            game.addPlayer(playerName);
          } catch (error) {
            const ge = error as GaboError;
            callback(ge.code, ge.message);
          }
        } else {
          //The room does not exist
          //Check if room is createable
          if (state.games.size >= MAX_ROOMS) {
            callback(
              ErrorCode.ErrorNoRoomAvailable,
              "There is no slot available to create a room."
            );
          }
          const game = new Game();
          state.games.set(roomName, game);
          game.addPlayer(playerName);
        }

        sock.join(roomName);
        sock.data.roomName = roomName;
        sock.data.playerName = playerName;
        callback(ErrorCode.Success, "");
      }
    );

    sock.on("disconnecting", (reason) => {
      const roomName = sock.data.roomName;
      if(roomName){
        console.debug("someone disconnected from game", roomName)
        const game = state.games.get(roomName);
        game?.removePlayer(sock.data.playerName);
        server.io.to(sock.data.roomName).emit("playerDisconnected", sock.data.playerName);
      }
    });

    sock.on("hello", () => {
      console.info("hello", sock.id);
      sock.emit("noArg");
    });
  });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});

declare module "fastify" {
  interface FastifyInstance {
    io: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >;
  }
}
