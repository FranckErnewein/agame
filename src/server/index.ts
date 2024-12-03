import { createServer } from "http";
import { readFileSync } from "fs";
import { join } from "path";

import express from "express";
import cors from "cors";
import { Server } from "socket.io";

import { createServerRunner, PlayerCommand, ServerEvent } from "../protocol";
import { Game } from "../engine/game";
import { createInitialMultiPlayerGameState } from "../map/parser";

const port = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server<PlayerCommand, ServerEvent>(httpServer, {
  serveClient: false,
  cors: {
    origin: "*",
  },
});

app.use(cors());

let state: Game = createInitialMultiPlayerGameState(
  JSON.parse(readFileSync(join(__dirname, "../../public/maps/1.json"), "utf8"))
);

const onAction = createServerRunner(
  state,
  (game) => (state = game),
  (lockstep) => io.emit("lockstep", lockstep)
);

io.on("connection", (socket) => {
  socket.emit("init", state);
  socket.on("action", onAction);
});

httpServer.listen(port, () => console.log(`server listen on ${port}`));
