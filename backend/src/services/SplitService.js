const Split = require('../models/Split');

class SplitService {
  constructor() {
    // Almacenamiento en memoria (en producción usar base de datos)
    this.splits = new Map();
    this.tokens = new Map(); // token -> splitId
  }

  // Crear un nuevo split
  createSplit(splitData) {
    const split = new Split(splitData);
    
    // Guardar por ID
    this.splits.set(split.id, split);
    
    // Guardar por token para búsquedas rápidas
    this.tokens.set(split.token, split.id);
    
    console.log(`Split created: ${split.id} with token: ${split.token}`);
    return split;
  }

  // Obtener split por token
  getSplitByToken(token) {
    const splitId = this.tokens.get(token);
    if (!splitId) {
      return null;
    }
    
    return this.splits.get(splitId);
  }

  // Obtener split por ID
  getSplitById(id) {
    return this.splits.get(id);
  }

  // Obtener todos los splits (para debugging)
  getAllSplits() {
    return Array.from(this.splits.values());
  }

  // Unirse a un split
  joinSplit(token, participantAddress, participantChain) {
    const split = this.getSplitByToken(token);
    if (!split) {
      throw new Error('Split not found');
    }

    if (split.status !== 'active') {
      throw new Error('Split is not active');
    }

    // Agregar participante
    const participant = split.addParticipant(participantAddress, participantChain);
    
    console.log(`Participant ${participantAddress} joined split ${split.id}`);
    return split;
  }

  // Marcar participante como pagado
  markParticipantAsPaid(token, participantAddress, transactionHash) {
    const split = this.getSplitByToken(token);
    if (!split) {
      throw new Error('Split not found');
    }

    const participant = split.markParticipantAsPaid(participantAddress, transactionHash);
    
    console.log(`Participant ${participantAddress} paid for split ${split.id}`);
    return split;
  }

  // Obtener estadísticas
  getStats() {
    const totalSplits = this.splits.size;
    const activeSplits = Array.from(this.splits.values()).filter(s => s.status === 'active').length;
    const completedSplits = Array.from(this.splits.values()).filter(s => s.status === 'completed').length;
    
    return {
      totalSplits,
      activeSplits,
      completedSplits,
      totalTokens: this.tokens.size
    };
  }

  // Limpiar splits antiguos (para desarrollo)
  cleanup() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    for (const [id, split] of this.splits.entries()) {
      if (split.createdAt < oneDayAgo && split.status === 'completed') {
        this.splits.delete(id);
        this.tokens.delete(split.token);
        console.log(`Cleaned up old split: ${id}`);
      }
    }
  }
}

module.exports = new SplitService(); 