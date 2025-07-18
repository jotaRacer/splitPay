const express = require('express');
const splitController = require('../controllers/splitController');

const router = express.Router();

// Crear un nuevo split
router.post('/create', splitController.createSplit);

// Obtener split por token
router.get('/token/:token', splitController.getSplitByToken);

// Unirse a un split
router.post('/join', splitController.joinSplit);

// Marcar participante como pagado
router.post('/mark-paid', splitController.markParticipantAsPaid);

// Obtener estadísticas (para debugging)
router.get('/stats', splitController.getStats);

// Obtener todos los splits (para debugging)
router.get('/all', splitController.getAllSplits);

module.exports = router; 