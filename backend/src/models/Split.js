const { v4: uuidv4 } = require('uuid');

class Split {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.token = data.token || this.generateToken();
    this.name = data.name;
    this.amount = parseFloat(data.amount);
    this.participants = parseInt(data.participants);
    this.description = data.description || '';
    this.creator = data.creator; // Wallet address del creador
    this.creatorChain = data.creatorChain; // Chain del creador
    this.amountPerPerson = this.amount / this.participants;
    this.status = 'active'; // active, completed, cancelled
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    
    // Lista de participantes
    this.participantsList = data.participantsList || [{
      address: this.creator,
      chain: this.creatorChain,
      amount: this.amountPerPerson,
      paid: true, // El creador ya pagó todo
      paidAt: new Date(),
      transactionHash: null
    }];
  }

  generateToken() {
    // Generar token de 12 caracteres alfanuméricos
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  addParticipant(address, chain) {
    // Verificar si el participante ya existe
    const existingParticipant = this.participantsList.find(p => p.address === address);
    if (existingParticipant) {
      throw new Error('Participant already exists');
    }

    // Verificar si hay espacio para más participantes
    if (this.participantsList.length >= this.participants) {
      throw new Error('Split is full');
    }

    const participant = {
      address,
      chain,
      amount: this.amountPerPerson,
      paid: false,
      paidAt: null,
      transactionHash: null
    };

    this.participantsList.push(participant);
    this.updatedAt = new Date();
    
    return participant;
  }

  markParticipantAsPaid(address, transactionHash) {
    const participant = this.participantsList.find(p => p.address === address);
    if (!participant) {
      throw new Error('Participant not found');
    }

    if (participant.paid) {
      throw new Error('Participant already paid');
    }

    participant.paid = true;
    participant.paidAt = new Date();
    participant.transactionHash = transactionHash;
    this.updatedAt = new Date();

    // Verificar si todos han pagado
    const allPaid = this.participantsList.every(p => p.paid);
    if (allPaid) {
      this.status = 'completed';
    }

    return participant;
  }

  getPaymentStatus() {
    const paidCount = this.participantsList.filter(p => p.paid).length;
    const totalAmount = this.amount;
    const collectedAmount = paidCount * this.amountPerPerson;
    
    return {
      totalAmount,
      collectedAmount,
      remainingAmount: totalAmount - collectedAmount,
      paidCount,
      totalParticipants: this.participantsList.length,
      percentage: (collectedAmount / totalAmount) * 100
    };
  }

  toJSON() {
    return {
      id: this.id,
      token: this.token,
      name: this.name,
      amount: this.amount,
      participants: this.participants,
      description: this.description,
      creator: this.creator,
      creatorChain: this.creatorChain,
      amountPerPerson: this.amountPerPerson,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      participantsList: this.participantsList,
      paymentStatus: this.getPaymentStatus()
    };
  }
}

module.exports = Split; 