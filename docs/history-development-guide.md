# 📚 Guía de Desarrollo - Historial de Splits

## 🎯 **Objetivo**

Esta guía está diseñada para implementar el sistema de historial de splits en SplitPay. Incluye endpoints, consultas SQL, y ejemplos de código para el frontend y backend.

---

## 🚀 **Endpoints a Implementar**

### **1. Historial de Splits del Usuario**

#### **Backend - Nuevo Controlador**

```javascript
// backend/src/controllers/historyController.js
const DatabaseService = require('../../services/databaseService');

class HistoryController {
  // Obtener splits creados por el usuario
  async getUserCreatedSplits(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await DatabaseService.getUserCreatedSplits(userId, page, limit);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting user splits',
        error: error.message
      });
    }
  }

  // Obtener splits donde el usuario participa
  async getUserParticipatedSplits(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await DatabaseService.getUserParticipatedSplits(userId, page, limit);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting participated splits',
        error: error.message
      });
    }
  }

  // Obtener historial de pagos del usuario
  async getUserPayments(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      
      const result = await DatabaseService.getUserPayments(userId, page, limit, status);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting user payments',
        error: error.message
      });
    }
  }

  // Obtener estadísticas del usuario
  async getUserStats(req, res) {
    try {
      const { userId } = req.params;
      
      const stats = await DatabaseService.getUserStats(userId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting user stats',
        error: error.message
      });
    }
  }
}

module.exports = new HistoryController();
```

#### **Rutas del Backend**

```javascript
// backend/src/routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Obtener splits creados por el usuario
router.get('/users/:userId/splits/created', historyController.getUserCreatedSplits);

// Obtener splits donde participa el usuario
router.get('/users/:userId/splits/participated', historyController.getUserParticipatedSplits);

// Obtener historial de pagos
router.get('/users/:userId/payments', historyController.getUserPayments);

// Obtener estadísticas del usuario
router.get('/users/:userId/stats', historyController.getUserStats);

module.exports = router;
```

---

## 🔧 **Métodos del DatabaseService**

### **Agregar al DatabaseService**

```javascript
// backend/services/databaseService.js

// Obtener splits creados por el usuario
static async getUserCreatedSplits(userId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabase
      .from('splits')
      .select(`
        *,
        networks(name, chain_id),
        participants(count),
        payments(count)
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Obtener total para paginación
    const { count } = await supabase
      .from('splits')
      .select('*', { count: 'exact' })
      .eq('creator_id', userId);

    return {
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    console.error('Error getting user created splits:', error);
    return { success: false, error: error.message };
  }
}

// Obtener splits donde participa el usuario
static async getUserParticipatedSplits(userId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabase
      .from('participants')
      .select(`
        role,
        joined_at,
        splits(
          *,
          networks(name, chain_id),
          participants(count),
          payments(count)
        )
      `)
      .eq('user_id', userId)
      .neq('role', 'creator')
      .order('joined_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Transformar datos para facilitar el uso
    const transformedData = data.map(item => ({
      ...item.splits,
      role: item.role,
      joined_at: item.joined_at
    }));

    // Obtener total para paginación
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .neq('role', 'creator');

    return {
      success: true,
      data: transformedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    console.error('Error getting user participated splits:', error);
    return { success: false, error: error.message };
  }
}

// Obtener historial de pagos del usuario
static async getUserPayments(userId, page = 1, limit = 10, status = null) {
  try {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('payments')
      .select(`
        *,
        splits(name, total_amount),
        networks(name, chain_id),
        participants(user_id)
      `)
      .eq('participants.user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Obtener total para paginación
    let countQuery = supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('participants.user_id', userId);

    if (status) {
      countQuery = countQuery.eq('status', status);
    }

    const { count } = await countQuery;

    return {
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    console.error('Error getting user payments:', error);
    return { success: false, error: error.message };
  }
}

// Obtener estadísticas del usuario
static async getUserStats(userId) {
  try {
    // Splits creados
    const { count: createdSplits } = await supabase
      .from('splits')
      .select('*', { count: 'exact' })
      .eq('creator_id', userId);

    // Splits donde participa
    const { count: participatedSplits } = await supabase
      .from('participants')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .neq('role', 'creator');

    // Total pagado
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('participants.user_id', userId)
      .eq('status', 'confirmed');

    const totalPaid = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;

    // Splits completados
    const { count: completedSplits } = await supabase
      .from('splits')
      .select('*', { count: 'exact' })
      .eq('creator_id', userId)
      .eq('status', 'paid');

    return {
      success: true,
      data: {
        createdSplits,
        participatedSplits,
        totalPaid,
        completedSplits,
        totalSplits: createdSplits + participatedSplits
      }
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { success: false, error: error.message };
  }
}
```

---

## 🎨 **Frontend - Componentes**

### **1. Página de Historial**

```typescript
// frontend/app/history/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePrivyWeb3 } from '@privy-io/react-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { apiService } from '@/lib/api'
import { 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp
} from 'lucide-react'

interface Split {
  id: string
  name: string
  description: string
  total_amount: number
  participants_count: number
  status: 'pending' | 'paid' | 'cancelled'
  created_at: string
  networks: { name: string; chain_id: number }
  participants: number
  payments: number
}

interface Payment {
  id: string
  amount: number
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
  transaction_hash: string
  token_symbol: string
  splits: { name: string; total_amount: number }
  networks: { name: string; chain_id: number }
}

interface UserStats {
  createdSplits: number
  participatedSplits: number
  totalPaid: number
  completedSplits: number
  totalSplits: number
}

export default function HistoryPage() {
  const { isConnected, account } = usePrivyWeb3()
  const [activeTab, setActiveTab] = useState('created')
  const [createdSplits, setCreatedSplits] = useState<Split[]>([])
  const [participatedSplits, setParticipatedSplits] = useState<Split[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected && account) {
      loadUserData()
    }
  }, [isConnected, account])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Cargar estadísticas
      const statsResponse = await apiService.getUserStats(account)
      if (statsResponse.success) {
        setStats(statsResponse.data)
      }

      // Cargar splits creados
      const createdResponse = await apiService.getUserCreatedSplits(account)
      if (createdResponse.success) {
        setCreatedSplits(createdResponse.data)
      }

      // Cargar splits donde participa
      const participatedResponse = await apiService.getUserParticipatedSplits(account)
      if (participatedResponse.success) {
        setParticipatedSplits(participatedResponse.data)
      }

      // Cargar pagos
      const paymentsResponse = await apiService.getUserPayments(account)
      if (paymentsResponse.success) {
        setPayments(paymentsResponse.data)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completado</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Confirmado</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>
      case 'failed':
        return <Badge variant="destructive">Fallido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Conecta tu Wallet</h3>
            <p className="text-gray-600">
              Necesitas conectar tu wallet para ver tu historial de splits.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">Mi Historial</h1>
            <p className="text-lg text-gray-600">
              Revisa todos tus splits y transacciones
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Splits Creados</p>
                      <p className="text-2xl font-bold">{stats.createdSplits}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Splits Participados</p>
                      <p className="text-2xl font-bold">{stats.participatedSplits}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Pagado</p>
                      <p className="text-2xl font-bold">${stats.totalPaid.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completados</p>
                      <p className="text-2xl font-bold">{stats.completedSplits}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="created">Splits Creados</TabsTrigger>
              <TabsTrigger value="participated">Splits Participados</TabsTrigger>
              <TabsTrigger value="payments">Pagos</TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando splits creados...</p>
                </div>
              ) : createdSplits.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No has creado splits aún</h3>
                    <p className="text-gray-600 mb-4">
                      Crea tu primer split para empezar a dividir pagos.
                    </p>
                    <Button onClick={() => window.location.href = '/create'}>
                      Crear Split
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {createdSplits.map((split) => (
                    <Card key={split.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{split.name}</h3>
                            <p className="text-gray-600">{split.description}</p>
                          </div>
                          {getStatusBadge(split.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Monto Total</p>
                            <p className="font-semibold">${split.total_amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Participantes</p>
                            <p className="font-semibold">{split.participants_count}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Red</p>
                            <p className="font-semibold">{split.networks?.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fecha</p>
                            <p className="font-semibold">
                              {new Date(split.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="participated" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando splits participados...</p>
                </div>
              ) : participatedSplits.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No has participado en splits</h3>
                    <p className="text-gray-600">
                      Únete a splits usando tokens para ver tu historial aquí.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {participatedSplits.map((split) => (
                    <Card key={split.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{split.name}</h3>
                            <p className="text-gray-600">{split.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Participante</Badge>
                            {getStatusBadge(split.status)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Monto Total</p>
                            <p className="font-semibold">${split.total_amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Participantes</p>
                            <p className="font-semibold">{split.participants_count}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Red</p>
                            <p className="font-semibold">{split.networks?.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fecha Unión</p>
                            <p className="font-semibold">
                              {new Date(split.joined_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando pagos...</p>
                </div>
              ) : payments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay pagos registrados</h3>
                    <p className="text-gray-600">
                      Realiza pagos en splits para ver tu historial aquí.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {payments.map((payment) => (
                    <Card key={payment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              Pago - {payment.splits?.name}
                            </h3>
                            <p className="text-gray-600">
                              {payment.token_symbol} • {payment.networks?.name}
                            </p>
                          </div>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Monto</p>
                            <p className="font-semibold">${payment.amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Token</p>
                            <p className="font-semibold">{payment.token_symbol}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Red</p>
                            <p className="font-semibold">{payment.networks?.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fecha</p>
                            <p className="font-semibold">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {payment.transaction_hash && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Transaction Hash:</p>
                            <p className="text-xs font-mono break-all">
                              {payment.transaction_hash}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
```

### **2. Servicio API Actualizado**

```typescript
// frontend/lib/api.ts

// Agregar estos métodos al apiService

// Obtener splits creados por el usuario
async getUserCreatedSplits(userId: string, page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${this.baseUrl}/users/${userId}/splits/created?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: this.headers,
      }
    )
    return await response.json()
  } catch (error) {
    console.error('Error getting user created splits:', error)
    return { success: false, error: error.message }
  }
}

// Obtener splits donde participa el usuario
async getUserParticipatedSplits(userId: string, page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${this.baseUrl}/users/${userId}/splits/participated?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: this.headers,
      }
    )
    return await response.json()
  } catch (error) {
    console.error('Error getting user participated splits:', error)
    return { success: false, error: error.message }
  }
}

// Obtener historial de pagos del usuario
async getUserPayments(userId: string, page = 1, limit = 10, status?: string) {
  try {
    let url = `${this.baseUrl}/users/${userId}/payments?page=${page}&limit=${limit}`
    if (status) {
      url += `&status=${status}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error getting user payments:', error)
    return { success: false, error: error.message }
  }
}

// Obtener estadísticas del usuario
async getUserStats(userId: string) {
  try {
    const response = await fetch(
      `${this.baseUrl}/users/${userId}/stats`,
      {
        method: 'GET',
        headers: this.headers,
      }
    )
    return await response.json()
  } catch (error) {
    console.error('Error getting user stats:', error)
    return { success: false, error: error.message }
  }
}
```

---

## 🎯 **Pasos de Implementación**

### **1. Backend**
1. ✅ Crear `historyController.js`
2. ✅ Crear `historyRoutes.js`
3. ✅ Agregar métodos al `DatabaseService`
4. ✅ Registrar rutas en `index.js`

### **2. Frontend**
1. ✅ Crear página `/history`
2. ✅ Actualizar `apiService`
3. ✅ Agregar navegación al historial
4. ✅ Implementar paginación

### **3. Testing**
1. ✅ Probar endpoints con Postman
2. ✅ Verificar consultas SQL
3. ✅ Testear paginación
4. ✅ Validar permisos

---

## 📝 **Notas Importantes**

- **Paginación:** Implementar para manejar grandes volúmenes de datos
- **Filtros:** Agregar filtros por fecha, estado, red
- **Cache:** Considerar cache para estadísticas
- **Permisos:** Validar que usuarios solo vean sus datos
- **Performance:** Usar índices en consultas frecuentes

---

**¡Listo para implementar!** 🚀 