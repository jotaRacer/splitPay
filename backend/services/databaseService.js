const { supabase } = require('../config/supabase')

class DatabaseService {
  // =====================================================
  // USERS
  // =====================================================
  
  static async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating user:', error)
      return { success: false, error: error.message }
    }
  }

  static async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error getting user:', error)
      return { success: false, error: error.message }
    }
  }

  static async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error getting user by email:', error)
      return { success: false, error: error.message }
    }
  }

  static async getUserByWalletAddress(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()
      
      if (error) {
        // Si no encuentra el usuario, retornar false en lugar de error
        if (error.code === 'PGRST116') {
          return { success: false, error: 'User not found' }
        }
        throw error
      }
      return { success: true, data }
    } catch (error) {
      console.error('Error getting user by wallet address:', error)
      return { success: false, error: error.message }
    }
  }

  // =====================================================
  // SPLITS
  // =====================================================

  static async createSplit(splitData) {
    try {
      const { data, error } = await supabase
        .from('splits')
        .insert(splitData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating split:', error)
      return { success: false, error: error.message }
    }
  }

  static async getSplitById(id) {
    try {
      const { data, error } = await supabase
        .from('splits')
        .select(`
          *,
          creator:users!splits_creator_id_fkey(*),
          participants:participants(
            *,
            user:users(*)
          ),
          payments:payments(*),
          token:tokens(*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error getting split:', error)
      return { success: false, error: error.message }
    }
  }

  static async getSplitsByCreator(creatorId) {
    try {
      const { data, error } = await supabase
        .from('splits')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error getting splits by creator:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateSplitStatus(id, status) {
    try {
      const { error } = await supabase
        .from('splits')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error updating split status:', error)
      return { success: false, error: error.message }
    }
  }

  // =====================================================
  // TOKENS
  // =====================================================

  static async createToken(tokenData) {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .insert(tokenData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating token:', error)
      return { success: false, error: error.message }
    }
  }

  static async getTokenByCode(tokenCode) {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('token_code', tokenCode)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error getting token by code:', error)
      return { success: false, error: error.message }
    }
  }

  static async isTokenValid(tokenCode) {
    try {
      const result = await this.getTokenByCode(tokenCode)
      if (!result.success || !result.data) return false
      
      return new Date(result.data.expires_at) > new Date()
    } catch (error) {
      return false
    }
  }

  // =====================================================
  // PARTICIPANTS
  // =====================================================

  static async addParticipant(participantData) {
    try {
      const { data, error } = await supabase
        .from('participants')
        .insert(participantData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error adding participant:', error)
      return { success: false, error: error.message }
    }
  }

  static async getParticipantsBySplit(splitId) {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          user:users(*)
        `)
        .eq('split_id', splitId)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error getting participants:', error)
      return { success: false, error: error.message }
    }
  }

  static async isUserParticipant(splitId, userId) {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('id')
        .eq('split_id', splitId)
        .eq('user_id', userId)
        .single()
      
      if (error) return false
      return !!data
    } catch (error) {
      return false
    }
  }

  // =====================================================
  // PAYMENTS
  // =====================================================

  static async createPayment(paymentData) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating payment:', error)
      return { success: false, error: error.message }
    }
  }

  static async getPaymentsBySplit(splitId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('split_id', splitId)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error getting payments:', error)
      return { success: false, error: error.message }
    }
  }

  static async updatePaymentStatus(id, status, transactionHash = null) {
    try {
      const updateData = { 
        status,
        confirmed_at: status === 'confirmed' ? new Date().toISOString() : null
      }
      
      if (transactionHash) {
        updateData.transaction_hash = transactionHash
      }
      
      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error updating payment status:', error)
      return { success: false, error: error.message }
    }
  }

  // =====================================================
  // NETWORKS
  // =====================================================

  static async getActiveNetworks() {
    try {
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error getting active networks:', error)
      return { success: false, error: error.message }
    }
  }

  // =====================================================
  // TOKEN USAGE LOGS
  // =====================================================

  static async logTokenUsage(tokenId, userId) {
    try {
      const { error } = await supabase
        .from('token_usage_logs')
        .insert({
          token_id: tokenId,
          user_id: userId
        })
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error logging token usage:', error)
      return { success: false, error: error.message }
    }
  }

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================

  static async generateTokenCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  static async calculateAmountPerParticipant(totalAmount, participantsCount) {
    return totalAmount / participantsCount
  }
}

module.exports = DatabaseService 