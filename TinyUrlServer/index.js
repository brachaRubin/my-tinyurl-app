import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import {getLinkAndRedirect} from './controllers/linkController.js';


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;


// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB database:', mongoose.connection.name))
  .catch((err) => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://tinyurl-backend-sgp4.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(httpLogger); // Winston HTTP request logger

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);

app.get('/:shortId', getLinkAndRedirect);

// Error handling
// app.use(notFound);
// 
//app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;