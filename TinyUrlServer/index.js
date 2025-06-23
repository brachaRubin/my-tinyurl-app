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
app.use(cors());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB database:', mongoose.connection.name))
  .catch((err) => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(httpLogger); // Winston HTTP request logger

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);

app.get('/:shortId', getLinkAndRedirect);
app.get('/', (req, res) => {
  res.send('Welcome to the TinyURL API! Use /api/auth, /api/users, or /api/links for more functionality.');
});

// Error handling
// app.use(notFound);
// 
//app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;