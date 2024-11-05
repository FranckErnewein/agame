import { createServer } from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

import { PlayerCommand, GameEvent } from "../protocol";

const port = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server<GameEvent, PlayerCommand>(httpServer, {
  serveClient: false,
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  socket.on("action", (action) => {
    io.emit("action", action);
  });
});

httpServer.listen(port, () => console.log(`server listen on ${port}`));
