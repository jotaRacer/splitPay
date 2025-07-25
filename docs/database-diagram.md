# 🗂️ Diagrama de Base de Datos - SplitPay

## 📊 **Diagrama ERD (Entity Relationship Diagram)**

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar name
        varchar wallet_address UK
        timestamp created_at
        timestamp updated_at
    }

    splits {
        uuid id PK
        uuid creator_id FK
        varchar name
        text description
        decimal total_amount
        integer participants_count
        uuid network_id FK
        varchar creator_wallet_address
        enum status
        timestamp created_at
        timestamp updated_at
    }

    tokens {
        uuid id PK
        uuid split_id FK
        varchar token_code UK
        timestamp expires_at
        timestamp created_at
    }

    participants {
        uuid id PK
        uuid split_id FK
        uuid user_id FK
        enum role
        timestamp joined_at
    }

    payments {
        uuid id PK
        uuid split_id FK
        uuid participant_id FK
        decimal amount
        varchar transaction_hash
        enum status
        uuid network_id FK
        varchar token_address
        varchar token_symbol
        timestamp created_at
        timestamp confirmed_at
    }

    networks {
        uuid id PK
        varchar name
        integer chain_id UK
        varchar rpc_url
        varchar explorer_url
        boolean is_active
        timestamp created_at
    }

    token_usage_logs {
        uuid id PK
        uuid token_id FK
        uuid user_id FK
        varchar action
        inet ip_address
        text user_agent
        timestamp created_at
    }

    %% Relaciones
    users ||--o{ splits : "crea"
    users ||--o{ participants : "participa"
    users ||--o{ payments : "realiza"
    users ||--o{ token_usage_logs : "usa"

    splits ||--o{ tokens : "tiene"
    splits ||--o{ participants : "incluye"
    splits ||--o{ payments : "recibe"
    splits }o--|| networks : "pertenece"

    participants ||--o{ payments : "realiza"
    participants }o--|| users : "es"
    participants }o--|| splits : "pertenece"

    payments }o--|| networks : "se_realiza_en"
    payments }o--|| participants : "es_realizado_por"
    payments }o--|| splits : "pertenece"

    tokens ||--o{ token_usage_logs : "registra_uso"
    token_usage_logs }o--|| users : "es_usado_por"
```

## 🔄 **Flujo de Datos Principal**

```mermaid
flowchart TD
    A[Usuario conecta wallet] --> B[Crear Split]
    B --> C[Generar Token]
    C --> D[Compartir Token]
    D --> E[Participante usa Token]
    E --> F[Unirse al Split]
    F --> G[Realizar Pago]
    G --> H[Confirmar Transacción]
    H --> I[Actualizar Estado]
    I --> J[Completar Split]
```

## 📈 **Estados de Splits y Pagos**

```mermaid
stateDiagram-v2
    [*] --> Pending: Crear Split
    Pending --> Paid: Todos pagan
    Pending --> Cancelled: Cancelar
    Paid --> [*]
    Cancelled --> [*]

    state Payment {
        [*] --> Pending: Iniciar pago
        Pending --> Confirmed: Confirmar tx
        Pending --> Failed: Error
        Confirmed --> [*]
        Failed --> [*]
    }
```

## 🎯 **Consultas Principales para Historial**

### **1. Splits del Usuario**
```sql
-- Splits creados
SELECT s.*, n.name as network_name 
FROM splits s 
JOIN networks n ON s.network_id = n.id 
WHERE s.creator_id = $1
ORDER BY s.created_at DESC;

-- Splits donde participa
SELECT s.*, p.role, n.name as network_name
FROM splits s 
JOIN participants p ON s.id = p.split_id
JOIN networks n ON s.network_id = n.id
WHERE p.user_id = $1
ORDER BY p.joined_at DESC;
```

### **2. Pagos del Usuario**
```sql
SELECT p.*, s.name as split_name, n.name as network_name
FROM payments p
JOIN participants part ON p.participant_id = part.id
JOIN splits s ON p.split_id = s.id
JOIN networks n ON p.network_id = n.id
WHERE part.user_id = $1
ORDER BY p.created_at DESC;
```

### **3. Estado de Split**
```sql
SELECT 
  s.name,
  s.total_amount,
  COUNT(p.id) as payments_count,
  SUM(CASE WHEN p.status = 'confirmed' THEN p.amount ELSE 0 END) as total_paid,
  s.status,
  (s.total_amount - SUM(CASE WHEN p.status = 'confirmed' THEN p.amount ELSE 0 END)) as remaining
FROM splits s
LEFT JOIN payments p ON s.id = p.split_id
WHERE s.id = $1
GROUP BY s.id, s.name, s.total_amount, s.status;
```

## 🔧 **Índices Importantes**

```sql
-- Índices para optimización
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_splits_creator_id ON splits(creator_id);
CREATE INDEX idx_splits_status ON splits(status);
CREATE INDEX idx_tokens_code ON tokens(token_code);
CREATE INDEX idx_tokens_expires ON tokens(expires_at);
CREATE INDEX idx_participants_user_id ON participants(user_id);
CREATE INDEX idx_payments_participant_id ON payments(participant_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

## 📊 **Métricas para Dashboard**

### **Estadísticas por Usuario:**
- Total de splits creados
- Total de splits donde participa
- Total pagado vs pendiente
- Splits completados vs activos
- Redes más utilizadas

### **Estadísticas por Split:**
- Progreso de pagos (%)
- Participantes activos
- Monto recaudado
- Tiempo restante
- Estado general

---

**Nota:** Este diagrama se actualiza automáticamente con cada cambio en la estructura de la base de datos. 