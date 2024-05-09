import Fastify from "fastify";
import FastifySocketIO from "fastify-socket.io";
import { Server, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@gabo-common/SocketEvents.js";
import { ResponseCode } from "@gabo-common/SocketEvents.js";

const server = Fastify({ logger: true });

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
        callback: (result: ResponseCode) => void
      ) => {
        console.log("received addPlayer ", playerName, roomName);

        //TODO Check if room has player of same name
        //TODO Check total number of rooms open
        sock.join(roomName);
        sock.data.room = roomName;
        callback(ResponseCode.Success);
      }
    );

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
