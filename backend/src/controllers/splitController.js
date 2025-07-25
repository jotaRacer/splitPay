const DatabaseService = require('../../services/databaseService');
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

      // 1. Buscar o crear usuario basado en la dirección de wallet
      let user = await DatabaseService.getUserByWalletAddress(value.creator);
      
      if (!user.success) {
        // Crear nuevo usuario si no existe
        const timestamp = Date.now();
        const userData = {
          email: `${value.creator.slice(0, 8)}_${timestamp}@splitpay.local`, // Email único
          name: `User ${value.creator.slice(0, 8)}...`,
          wallet_address: value.creator // Agregar la dirección de wallet
        };
        
        const createUserResult = await DatabaseService.createUser(userData);
        if (!createUserResult.success) {
          throw new Error(`Error creating user: ${createUserResult.error}`);
        }
        user = createUserResult;
      }

      // 2. Obtener el network_id por chain_id
      const networks = await DatabaseService.getActiveNetworks();
      if (!networks.success) {
        throw new Error('Error getting networks');
      }
      
      const network = networks.data.find(n => n.chain_id === parseInt(value.creatorChain));
      if (!network) {
        throw new Error(`Network with chain_id ${value.creatorChain} not found`);
      }

      // 3. Generar token único
      const tokenCode = await DatabaseService.generateTokenCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 1 semana

      // 4. Crear el split en Supabase
      const splitData = {
        creator_id: user.data.id, // Usar el UUID del usuario
        name: value.name,
        description: value.description || '',
        total_amount: value.amount,
        participants_count: value.participants,
        network_id: network.id, // Usar el UUID del network
        creator_wallet_address: value.creator,
        status: 'pending'
      };

      const splitResult = await DatabaseService.createSplit(splitData);
      
      if (!splitResult.success) {
        throw new Error(splitResult.error);
      }

      // 5. Crear el token
      const tokenData = {
        split_id: splitResult.data.id,
        token_code: tokenCode,
        expires_at: expiresAt.toISOString()
      };

      const tokenResult = await DatabaseService.createToken(tokenData);
      
      if (!tokenResult.success) {
        throw new Error(tokenResult.error);
      }

      // 6. Agregar el creador como participante
      const participantData = {
        split_id: splitResult.data.id,
        user_id: user.data.id, // Usar el UUID del usuario
        role: 'creator'
      };

      await DatabaseService.addParticipant(participantData);

      console.log('Split created successfully:', splitResult.data);

      res.status(201).json({
        success: true,
        message: 'Split created successfully',
        data: {
          ...splitResult.data,
          token: tokenCode
        }
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

      // Buscar el token en la base de datos
      const tokenResult = await DatabaseService.getTokenByCode(token);
      if (!tokenResult.success) {
        return res.status(404).json({
          success: false,
          message: 'Split not found'
        });
      }

      // Verificar si el token es válido
      const isValid = await DatabaseService.isTokenValid(token);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Token has expired'
        });
      }

      // Obtener el split completo con toda la información
      const splitResult = await DatabaseService.getSplitById(tokenResult.data.split_id);
      if (!splitResult.success) {
        return res.status(404).json({
          success: false,
          message: 'Split not found'
        });
      }

      res.json({
        success: true,
        data: splitResult.data
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

      // 1. Buscar el token y verificar que sea válido
      const tokenResult = await DatabaseService.getTokenByCode(token);
      if (!tokenResult.success) {
        return res.status(404).json({
          success: false,
          message: 'Split not found'
        });
      }

      const isValid = await DatabaseService.isTokenValid(token);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Token has expired'
        });
      }

      // 2. Obtener el split
      const splitResult = await DatabaseService.getSplitById(tokenResult.data.split_id);
      if (!splitResult.success) {
        return res.status(404).json({
          success: false,
          message: 'Split not found'
        });
      }

      const split = splitResult.data;

      // 3. Verificar que el split esté activo
      if (split.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Split is not active'
        });
      }

      // 4. Verificar que no esté lleno
      const participants = await DatabaseService.getParticipantsBySplit(split.id);
      if (participants.success && participants.data.length >= split.participants_count) {
        return res.status(400).json({
          success: false,
          message: 'Split is full'
        });
      }

      // 5. Buscar o crear el usuario participante
      let participantUser = await DatabaseService.getUserByWalletAddress(participantAddress);
      
      if (!participantUser.success) {
        const timestamp = Date.now();
        const userData = {
          email: `${participantAddress.slice(0, 8)}_${timestamp}@splitpay.local`,
          name: `User ${participantAddress.slice(0, 8)}...`,
          wallet_address: participantAddress
        };
        
        const createUserResult = await DatabaseService.createUser(userData);
        if (!createUserResult.success) {
          throw new Error(`Error creating participant user: ${createUserResult.error}`);
        }
        participantUser = createUserResult;
      }

      // 6. Verificar que el usuario no esté ya en el split
      const isAlreadyParticipant = await DatabaseService.isUserParticipant(split.id, participantUser.data.id);
      if (isAlreadyParticipant) {
        return res.status(400).json({
          success: false,
          message: 'You have already joined this split'
        });
      }

      // 7. Agregar el participante
      const participantData = {
        split_id: split.id,
        user_id: participantUser.data.id,
        role: 'participant'
      };

      const addParticipantResult = await DatabaseService.addParticipant(participantData);
      if (!addParticipantResult.success) {
        throw new Error(`Error adding participant: ${addParticipantResult.error}`);
      }

      // 8. Registrar el uso del token
      await DatabaseService.logTokenUsage(tokenResult.data.id, participantUser.data.id);

      // 9. Obtener el split actualizado
      const updatedSplitResult = await DatabaseService.getSplitById(split.id);

      res.json({
        success: true,
        message: 'Successfully joined split',
        data: updatedSplitResult.data
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