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

// Load environment variables FIRST before using them
dotenv.config();

const PORT = process.env.PORT || 5000;

// Build allowed origins - use env variables in production, localhost in development
// NOTE: These should be the FRONTEND origin URLs (where requests come from), not API URLs
const frontendOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_ORIGIN
  : 'http://localhost:5173';
  
const chatDashboardOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.CHAT_DASHBOARD_ORIGIN 
  : 'http://localhost:5174';

const allowedOrigins = [frontendOrigin, chatDashboardOrigin].filter(Boolean);

// Connect to MongoDB
db.connectDB();

// loading express
const app = express();

// CORS configuration - must be before other middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Allows sending/receiving HTTP-only cookies
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow Cloudinary images
}));
app.use(cookieParser());

// Health check endpoint (before routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// routes
app.use('/api/experts', expertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/active", activeUsersRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});