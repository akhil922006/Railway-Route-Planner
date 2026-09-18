import express from 'express';
import { getStations, searchRoutes } from '../controllers/trainController.js';

const router = express.Router();

// @route   GET /api/stations
// @desc    Get list of all stations
router.get('/stations', getStations);

// @route   POST /api/search
// @desc    Search direct and connecting routes matching buffer rules
router.post('/search', searchRoutes);

export default router;
