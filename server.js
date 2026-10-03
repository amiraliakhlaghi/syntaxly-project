import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  io = new Server(httpServer);

  let onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("addOnlineUser", (userId) => {
      if (userId && !onlineUsers.has(userId)) {
        onlineUsers.set(userId, {
          userId,
          socketId: socket.id,
        });
      }
    });

    socket.on("onNotification", (recipientId) => {
      const recipient = onlineUsers.get(recipientId);

      if (recipient) {
        io.to(recipient.socketId).emit("getNotifications");
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((value, key) => {
        if (value.socketId === socket.id) {
          onlineUsers.delete(key);
        }
      });
    });
  });

  httpServer
    .once("error", (err) => {
      process.exit(1);
    })
    .listen(port);
});
