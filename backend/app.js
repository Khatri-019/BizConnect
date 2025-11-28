import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import db from './config/db.js';
import expertRoutes from './routes/expertRoutes.js';
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protectedExample.js";
import chatRoutes from "./routes/chatRoutes.js";
import activeUsersRoutes from "./routes/activeUsers.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']; // frontend and chat-dashboard

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
db.connectDB();

// loading express
const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // <-- CRITICAL: Allows sending/receiving HTTP-only cookies
  optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// routes
app.use('/api/experts', expertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/active", activeUsersRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});