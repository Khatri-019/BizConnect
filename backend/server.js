import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { initializeSocketHandlers } from "./sockets/socketHandlers.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" 
      ? [process.env.FRONTEND_ORIGIN, process.env.CHAT_DASHBOARD_ORIGIN].filter(Boolean)
      : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Initialize socket handlers
initializeSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server initialized`);
});

export { io };

