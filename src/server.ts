import { createServer } from "http";
import { clone } from "lodash/fp";
import express from "express";
import cors from "cors";

import { Server } from "socket.io";
import { emptyGame } from "./game";

const port = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin: "*",
  },
});

const game = clone(emptyGame);

app.use(cors());

io.on("connection", (socket) => {
  socket.send(game);
});

httpServer.listen(port, () => console.log(`server listen on ${port}`));
