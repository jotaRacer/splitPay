# 📊 Documentación de Base de Datos - SplitPay

## 🎯 **Descripción General**

SplitPay es una aplicación de pagos divididos (splits) que permite a los usuarios crear grupos de pago, invitar participantes y gestionar transacciones blockchain. La base de datos está diseñada siguiendo principios de normalización (1NF, 2NF, 3NF, BCNF) y utiliza PostgreSQL a través de Supabase.

## 🏗️ **Arquitectura de la Base de Datos**

### **Tecnologías:**
- **Base de datos:** PostgreSQL (Supabase)
- **ORM:** Supabase Client (JavaScript/Node.js)
- **Autenticación:** Privy (wallet-based)
- **Transacciones:** LiFi (cross-chain)

### **Principios de Diseño:**
- ✅ **Normalización completa** (1NF, 2NF, 3NF, BCNF)
- ✅ **Claves foráneas** para integridad referencial
- ✅ **Índices** para optimización de consultas
- ✅ **Row Level Security (RLS)** para seguridad
- ✅ **Triggers** para auditoría automática

---

## 📋 **Estructura de Tablas**

### **1. 🧑‍💼 Tabla: `users`**
**Descripción:** Almacena información de usuarios del sistema.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(42) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos importantes:**
- `id`: Identificador único del usuario (UUID)
- `email`: Email único del usuario
- `name`: Nombre del usuario
- `wallet_address`: Dirección de wallet (formato 0x...)
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

**Relaciones:**
- Un usuario puede ser **creador** de múltiples splits
- Un usuario puede ser **participante** en múltiples splits
- Un usuario puede tener múltiples **pagos**

---

### **2. 🎯 Tabla: `splits`**
**Descripción:** Almacena información de los grupos de pago dividido.

```sql
CREATE TABLE splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount DECIMAL(20,8) NOT NULL,
  participants_count INTEGER NOT NULL,
  network_id UUID NOT NULL REFERENCES networks(id),
  creator_wallet_address VARCHAR(42) NOT NULL,
  status split_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos importantes:**
- `id`: Identificador único del split
- `creator_id`: ID del usuario creador (FK a users)
- `name`: Nombre del split
- `description`: Descripción opcional
- `total_amount`: Monto total a dividir
- `participants_count`: Número de participantes
- `network_id`: Red blockchain donde se creó (FK a networks)
- `creator_wallet_address`: Wallet del creador para recibir pagos
- `status`: Estado del split (pending, paid, cancelled)

**Relaciones:**
- Un split tiene **un creador** (users)
- Un split pertenece a **una red** (networks)
- Un split puede tener **múltiples participantes** (participants)
- Un split puede tener **múltiples tokens** (tokens)
- Un split puede tener **múltiples pagos** (payments)

---

### **3. 🔑 Tabla: `tokens`**
**Descripción:** Almacena tokens de acceso únicos para unirse a splits.

```sql
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID NOT NULL REFERENCES splits(id),
  token_code VARCHAR(12) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos importantes:**
- `id`: Identificador único del token
- `split_id`: ID del split asociado (FK a splits)
- `token_code`: Código único de 12 caracteres
- `expires_at`: Fecha de expiración (1 semana)
- `created_at`: Fecha de creación

**Relaciones:**
- Un token pertenece a **un split** (splits)
- Un token puede ser usado **múltiples veces** (token_usage_logs)

---

### **4. 👥 Tabla: `participants`**
**Descripción:** Almacena la relación entre usuarios y splits.

```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID NOT NULL REFERENCES splits(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role participant_role DEFAULT 'participant',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(split_id, user_id)
);
```

**Campos importantes:**
- `id`: Identificador único de la participación
- `split_id`: ID del split (FK a splits)
- `user_id`: ID del usuario (FK a users)
- `role`: Rol del participante (creator, participant)
- `joined_at`: Fecha de unión al split

**Relaciones:**
- Un participante pertenece a **un split** (splits)
- Un participante es **un usuario** (users)
- Un participante puede tener **múltiples pagos** (payments)

---

### **5. 💰 Tabla: `payments`**
**Descripción:** Almacena información de los pagos realizados por los participantes.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID NOT NULL REFERENCES splits(id),
  participant_id UUID NOT NULL REFERENCES participants(id),
  amount DECIMAL(20,8) NOT NULL,
  transaction_hash VARCHAR(66),
  status payment_status DEFAULT 'pending',
  network_id UUID NOT NULL REFERENCES networks(id),
  token_address VARCHAR(42),
  token_symbol VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);
```

**Campos importantes:**
- `id`: Identificador único del pago
- `split_id`: ID del split (FK a splits)
- `participant_id`: ID del participante (FK a participants)
- `amount`: Monto pagado
- `transaction_hash`: Hash de la transacción blockchain
- `status`: Estado del pago (pending, confirmed, failed)
- `network_id`: Red donde se realizó el pago (FK a networks)
- `token_address`: Dirección del token usado
- `token_symbol`: Símbolo del token (ETH, USDC, etc.)
- `created_at`: Fecha de creación del pago
- `confirmed_at`: Fecha de confirmación

**Relaciones:**
- Un pago pertenece a **un split** (splits)
- Un pago es realizado por **un participante** (participants)
- Un pago se realiza en **una red** (networks)

---

### **6. 🌐 Tabla: `networks`**
**Descripción:** Almacena información de las redes blockchain soportadas.

```sql
CREATE TABLE networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  chain_id INTEGER UNIQUE NOT NULL,
  rpc_url VARCHAR(500),
  explorer_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos importantes:**
- `id`: Identificador único de la red
- `name`: Nombre de la red (Ethereum, Polygon, etc.)
- `chain_id`: ID de la cadena (1, 137, etc.)
- `rpc_url`: URL del RPC
- `explorer_url`: URL del explorador de bloques
- `is_active`: Si la red está activa

**Relaciones:**
- Una red puede tener **múltiples splits**
- Una red puede tener **múltiples pagos**

---

### **7. 📊 Tabla: `token_usage_logs`**
**Descripción:** Almacena el historial de uso de tokens para auditoría.

```sql
CREATE TABLE token_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES tokens(id),
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos importantes:**
- `id`: Identificador único del log
- `token_id`: ID del token usado (FK a tokens)
- `user_id`: ID del usuario que usó el token (FK a users)
- `action`: Acción realizada (join, view, etc.)
- `ip_address`: IP del usuario
- `user_agent`: User agent del navegador
- `created_at`: Fecha del log

**Relaciones:**
- Un log pertenece a **un token** (tokens)
- Un log es generado por **un usuario** (users)

---

## 🔗 **Diagrama de Relaciones**

```
users (1) ←→ (N) splits
users (1) ←→ (N) participants
users (1) ←→ (N) payments
users (1) ←→ (N) token_usage_logs

splits (1) ←→ (N) tokens
splits (1) ←→ (N) participants
splits (1) ←→ (N) payments
splits (N) ←→ (1) networks

participants (1) ←→ (N) payments
participants (N) ←→ (1) users
participants (N) ←→ (1) splits

payments (N) ←→ (1) networks
payments (N) ←→ (1) participants
payments (N) ←→ (1) splits

tokens (1) ←→ (N) token_usage_logs
token_usage_logs (N) ←→ (1) users
```

---

## 🎯 **Flujo de Datos para Historial**

### **Para implementar el historial, necesitarás:**

1. **📋 Historial de Splits por Usuario:**
   ```sql
   -- Splits creados por el usuario
   SELECT s.*, n.name as network_name 
   FROM splits s 
   JOIN networks n ON s.network_id = n.id 
   WHERE s.creator_id = $1
   
   -- Splits donde el usuario es participante
   SELECT s.*, p.role, n.name as network_name
   FROM splits s 
   JOIN participants p ON s.id = p.split_id
   JOIN networks n ON s.network_id = n.id
   WHERE p.user_id = $1
   ```

2. **💰 Historial de Pagos:**
   ```sql
   -- Pagos realizados por el usuario
   SELECT p.*, s.name as split_name, n.name as network_name
   FROM payments p
   JOIN participants part ON p.participant_id = part.id
   JOIN splits s ON p.split_id = s.id
   JOIN networks n ON p.network_id = n.id
   WHERE part.user_id = $1
   ```

3. **📊 Estado de Splits:**
   ```sql
   -- Estado de pagos en un split
   SELECT 
     s.name,
     s.total_amount,
     COUNT(p.id) as payments_count,
     SUM(p.amount) as total_paid,
     s.status
   FROM splits s
   LEFT JOIN payments p ON s.id = p.split_id AND p.status = 'confirmed'
   WHERE s.id = $1
   GROUP BY s.id, s.name, s.total_amount, s.status
   ```

---

## 🔧 **Funciones y Métodos Importantes**

### **Backend (DatabaseService):**

1. **`getUserByWalletAddress(walletAddress)`**
   - Busca usuario por dirección de wallet
   - Retorna `{success: boolean, data: user | null}`

2. **`createSplit(splitData)`**
   - Crea un nuevo split
   - Genera token automáticamente
   - Agrega creador como participante

3. **`getSplitById(splitId)`**
   - Obtiene split con participantes y pagos
   - Incluye información de red y creador

4. **`joinSplit(tokenCode, participantData)`**
   - Valida token y expiración
   - Agrega participante al split
   - Registra uso del token

5. **`getUserSplits(userId)`**
   - Obtiene splits creados por el usuario
   - Obtiene splits donde participa

### **Frontend (API Service):**

1. **`apiService.createSplit(splitData)`**
2. **`apiService.getSplitByToken(token)`**
3. **`apiService.joinSplit(joinData)`**
4. **`apiService.getUserSplits()`** (para implementar)

---

## 🚀 **Endpoints API para Historial**

### **Endpoints a implementar:**

1. **`GET /api/users/:userId/splits`**
   - Splits creados por el usuario
   - Splits donde participa

2. **`GET /api/users/:userId/payments`**
   - Historial de pagos del usuario

3. **`GET /api/splits/:splitId/status`**
   - Estado detallado del split
   - Progreso de pagos

4. **`GET /api/splits/:splitId/participants`**
   - Lista de participantes con estado de pago

---

## 📝 **Notas Importantes para el Desarrollo**

### **🔐 Seguridad:**
- Todas las tablas tienen RLS habilitado
- Usar `service_role` key para backend
- Validar permisos por wallet address

### **⚡ Performance:**
- Índices en `wallet_address`, `token_code`, `split_id`
- Usar `LIMIT` y `OFFSET` para paginación
- Considerar cache para consultas frecuentes

### **🔄 Estados:**
- **Split:** `pending`, `paid`, `cancelled`
- **Payment:** `pending`, `confirmed`, `failed`
- **Participant:** `creator`, `participant`

### **💡 Tips para el Historial:**
1. Usar `created_at` para ordenar por fecha
2. Calcular montos pendientes dinámicamente
3. Mostrar progreso visual de pagos
4. Filtrar por estado y fecha
5. Incluir información de red y tokens

---

## 📚 **Recursos Adicionales**

- **Script SQL completo:** `supabase-schema.sql`
- **Configuración Supabase:** `backend/config/supabase.js`
- **Servicios de BD:** `backend/services/databaseService.js`
- **Controladores:** `backend/src/controllers/splitController.js`

---

**Última actualización:** Julio 2025  
**Versión:** 1.0.0  
**Autor:** SplitPay Team 