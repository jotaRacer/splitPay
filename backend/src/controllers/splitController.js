const SplitService = require('../services/SplitService');
const Joi = require('joi');

// Esquemas de validación
const createSplitSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  amount: Joi.number().required().positive(),
  participants: Joi.number().required().integer().min(2).max(50),
  description: Joi.string().optional().allow('').max(500),
  creator: Joi.string().required().pattern(/^0x[a-fA-F0-9]{40}$/),
  creatorChain: Joi.string().required(),
  // Receiver preferences for where they want to receive funds
  receiverTokenAddress: Joi.string().optional().allow(''),
  receiverTokenSymbol: Joi.string().optional().allow(''),
  receiverTokenDecimals: Joi.number().optional().integer().min(0).max(18)
});

const joinSplitSchema = Joi.object({
  token: Joi.string().required().length(12).pattern(/^[A-Z0-9]{12}$/),
  participantAddress: Joi.string().required().pattern(/^0x[a-fA-F0-9]{40}$/),
  participantChain: Joi.string().required()
});

const markPaidSchema = Joi.object({
  token: Joi.string().required().length(12).pattern(/^[A-Z0-9]{12}$/),
  participantAddress: Joi.string().required().pattern(/^0x[a-fA-F0-9]{40}$/),
  transactionHash: Joi.string().required()
});

class SplitController {
  // Crear un nuevo split
  async createSplit(req, res) {
    try {
      console.log('=== createSplit called ===');
      console.log('Request body:', req.body);
      console.log('Request headers:', req.headers);
      
      // Validar datos de entrada
      const { error, value } = createSplitSchema.validate(req.body);
      if (error) {
        console.log('Validation error:', error.details);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      console.log('Validation passed, creating split with data:', value);

      // Crear el split
      const split = SplitService.createSplit(value);

      console.log('Split created successfully:', split.toJSON());

      res.status(201).json({
        success: true,
        message: 'Split created successfully',
        data: split.toJSON()
      });

    } catch (error) {
      console.error('Error creating split:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Obtener split por token
  async getSplitByToken(req, res) {
    try {
      const { token } = req.params;

      // Validar formato del token
      if (!token || token.length !== 12 || !/^[A-Z0-9]{12}$/.test(token)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid token format'
        });
      }

      const split = SplitService.getSplitByToken(token);
      if (!split) {
        return res.status(404).json({
          success: false,
          message: 'Split not found'
        });
      }

      res.json({
        success: true,
        data: split.toJSON()
      });

    } catch (error) {
      console.error('Error getting split:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Unirse a un split
  async joinSplit(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = joinSplitSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const { token, participantAddress, participantChain } = value;

      // Unirse al split
      const split = SplitService.joinSplit(token, participantAddress, participantChain);

      res.json({
        success: true,
        message: 'Successfully joined split',
        data: split.toJSON()
      });

    } catch (error) {
      console.error('Error joining split:', error);
      
      if (error.message === 'Split not found') {
        return res.status(404).json({
          success: false,
          message: 'Split not found'
        });
      }

      if (error.message === 'Split is not active') {
        return res.status(400).json({
          success: false,
          message: 'Split is not active'
        });
      }

      if (error.message === 'Participant already exists') {
        return res.status(400).json({
          success: false,
          message: 'You have already joined this split'
        });
      }

      if (error.message === 'Split is full') {
        return res.status(400).json({
          success: false,
          message: 'Split is full'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Marcar participante como pagado
  async markParticipantAsPaid(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = markPaidSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const { token, participantAddress, transactionHash } = value;

      // Marcar como pagado
      const split = SplitService.markParticipantAsPaid(token, participantAddress, transactionHash);

      res.json({
        success: true,
        message: 'Payment recorded successfully',
        data: split.toJSON()
      });

    } catch (error) {
      console.error('Error marking participant as paid:', error);
      
      if (error.message === 'Split not found') {
        return res.status(404).json({
          success: false,
          message: 'Split not found'
        });
      }

      if (error.message === 'Participant not found') {
        return res.status(404).json({
          success: false,
          message: 'Participant not found in this split'
        });
      }

      if (error.message === 'Participant already paid') {
        return res.status(400).json({
          success: false,
          message: 'Participant has already paid'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Obtener estadísticas (para debugging)
  async getStats(req, res) {
    try {
      const stats = SplitService.getStats();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Obtener todos los splits (para debugging)
  async getAllSplits(req, res) {
    try {
      const splits = SplitService.getAllSplits().map(split => split.toJSON());
      
      res.json({
        success: true,
        data: splits
      });

    } catch (error) {
      console.error('Error getting all splits:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new SplitController(); 