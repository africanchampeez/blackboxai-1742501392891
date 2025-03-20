const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signalController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all signals (protected route)
router.get('/', authMiddleware, signalController.getAllSignals);

// Get latest signals (protected route)
router.get('/latest', authMiddleware, signalController.getLatestSignals);

// Get single signal by ID (protected route)
router.get('/:id', authMiddleware, signalController.getSignalById);

// Create new signal (protected route - only for admin)
router.post('/', authMiddleware, signalController.createSignal);

module.exports = router;
