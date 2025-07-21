const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface CreateSplitData {
  name: string;
  amount: number;
  participants: number;
  description?: string;
  creator: string;
  creatorChain: string;
}

export interface JoinSplitData {
  token: string;
  participantAddress: string;
  participantChain: string;
}

export interface MarkPaidData {
  token: string;
  participantAddress: string;
  transactionHash: string;
}

export interface Split {
  id: string;
  token: string;
  name: string;
  amount: number;
  participants: number;
  description: string;
  creator: string;
  creatorChain: string;
  amountPerPerson: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  participantsList: Array<{
    address: string;
    chain: string;
    amount: number;
    paid: boolean;
    paidAt: string | null;
    transactionHash: string | null;
  }>;
  paymentStatus: {
    totalAmount: number;
    collectedAmount: number;
    remainingAmount: number;
    paidCount: number;
    totalParticipants: number;
    percentage: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: string[];
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("API Service - Making request to:", url)
    console.log("API Service - Request options:", options)
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log("API Service - Response status:", response.status)
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("API Service - Response data:", data)
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        console.log("API Service - Non-JSON response:", text)
        data = { message: text || `HTTP error! status: ${response.status}` };
      }
      
      if (!response.ok) {
        console.error("API Service - Error response:", data)
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Crear un nuevo split
  async createSplit(splitData: CreateSplitData): Promise<ApiResponse<Split>> {
    console.log("API Service - Creating split with data:", splitData)
    const result = await this.request<Split>('/splits/create', {
      method: 'POST',
      body: JSON.stringify(splitData),
    });
    console.log("API Service - Response received:", result)
    return result
  }

  // Obtener split por token
  async getSplitByToken(token: string): Promise<ApiResponse<Split>> {
    return this.request<Split>(`/splits/token/${token}`);
  }

  // Unirse a un split
  async joinSplit(joinData: JoinSplitData): Promise<ApiResponse<Split>> {
    return this.request<Split>('/splits/join', {
      method: 'POST',
      body: JSON.stringify(joinData),
    });
  }

  // Marcar participante como pagado
  async markParticipantAsPaid(paidData: MarkPaidData): Promise<ApiResponse<Split>> {
    return this.request<Split>('/splits/mark-paid', {
      method: 'POST',
      body: JSON.stringify(paidData),
    });
  }

  // Obtener estadísticas (para debugging)
  async getStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/splits/stats');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/health');
  }
}

export const apiService = new ApiService(); 