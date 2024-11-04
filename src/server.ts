import { createServer } from "http";
import { Server } from "socket.io";

const port = 3000;
const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(socket);
});

httpServer.listen(port, () => console.log(`server listen on ${port}`));
