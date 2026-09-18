import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trainRoutes from './routes/trainRoutes.js';
import { testConnection } from './config/db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable JSON body parsing

// Base Health Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Railway Route Planner API Server is running.',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api', trainRoutes);

// Start Server Listener
app.listen(PORT, async () => {
  console.log(`🚀 Railway Route Planner API server running on http://localhost:${PORT}`);
  await testConnection();
});

