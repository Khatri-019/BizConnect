import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import db from './config/db.js';
import expertRoutes from './routes/expertRoutes.js';

const PORT = process.env.PORT || 5000;

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
db.connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // allow frontend
app.use(express.json());

// routes
app.use('/api/experts', expertRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});