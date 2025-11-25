import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import db from './config/db.js';
import expertRoutes from './routes/expertRoutes.js';

import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protectedExample.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;
const allowedOrigin = 'http://localhost:5173';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
db.connectDB();

// loading express
const app = express();

app.use(cors({
  origin: allowedOrigin,
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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});