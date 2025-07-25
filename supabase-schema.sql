-- =====================================================
-- SPLITPAY DATABASE SCHEMA - SUPABASE
-- =====================================================
-- Script completo para crear todas las tablas y relaciones
-- Ejecutar este script en el SQL Editor de Supabase

-- =====================================================
-- 1. CREAR TIPOS ENUM
-- =====================================================

-- Tipo para estado de splits
CREATE TYPE split_status AS ENUM ('pending', 'paid', 'cancelled');

-- Tipo para estado de pagos
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'failed');

-- Tipo para rol de participantes
CREATE TYPE participant_role AS ENUM ('creator', 'participant');

-- =====================================================
-- 2. CREAR TABLAS
-- =====================================================

-- Tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de redes blockchain
CREATE TABLE networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    chain_id INTEGER UNIQUE NOT NULL,
    rpc_url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de splits
CREATE TABLE splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_amount DECIMAL(20, 8) NOT NULL CHECK (total_amount > 0),
    participants_count INTEGER NOT NULL CHECK (participants_count > 0),
    network_id UUID NOT NULL REFERENCES networks(id) ON DELETE RESTRICT,
    creator_wallet_address VARCHAR(255) NOT NULL,
    status split_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tokens de acceso
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
    token_code VARCHAR(50) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de participantes
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role participant_role NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(split_id, user_id) -- Un usuario solo puede participar una vez por split
);

-- Tabla de pagos
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    amount DECIMAL(20, 8) NOT NULL CHECK (amount > 0),
    currency_symbol VARCHAR(10) NOT NULL,
    transaction_hash VARCHAR(255) UNIQUE,
    network_id UUID NOT NULL REFERENCES networks(id) ON DELETE RESTRICT,
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de logs de uso de tokens
CREATE TABLE token_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_splits_creator_id ON splits(creator_id);
CREATE INDEX idx_splits_status ON splits(status);
CREATE INDEX idx_splits_created_at ON splits(created_at);
CREATE INDEX idx_tokens_token_code ON tokens(token_code);
CREATE INDEX idx_tokens_expires_at ON tokens(expires_at);
CREATE INDEX idx_participants_split_id ON participants(split_id);
CREATE INDEX idx_participants_user_id ON participants(user_id);
CREATE INDEX idx_payments_split_id ON payments(split_id);
CREATE INDEX idx_payments_participant_id ON payments(participant_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_hash ON payments(transaction_hash);
CREATE INDEX idx_token_usage_logs_token_id ON token_usage_logs(token_id);
CREATE INDEX idx_token_usage_logs_user_id ON token_usage_logs(user_id);

-- Índices compuestos para consultas complejas
CREATE INDEX idx_splits_creator_status ON splits(creator_id, status);
CREATE INDEX idx_participants_user_role ON participants(user_id, role);
CREATE INDEX idx_payments_split_status ON payments(split_id, status);

-- =====================================================
-- 4. CREAR FUNCIONES DE ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_splits_updated_at BEFORE UPDATE ON splits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREAR POLÍTICAS DE SEGURIDAD BÁSICAS
-- =====================================================

-- Políticas para usuarios (cada usuario puede ver/editar solo sus datos)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Políticas para splits (creador puede ver/editar, participantes pueden ver)
CREATE POLICY "Split creator can manage split" ON splits
    FOR ALL USING (creator_id::text = auth.uid()::text);

CREATE POLICY "Split participants can view split" ON splits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM participants 
            WHERE participants.split_id = splits.id 
            AND participants.user_id::text = auth.uid()::text
        )
    );

-- Políticas para tokens (cualquiera puede ver tokens activos)
CREATE POLICY "Anyone can view active tokens" ON tokens
    FOR SELECT USING (expires_at > NOW());

-- Políticas para participantes
CREATE POLICY "Users can view their participations" ON participants
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Políticas para pagos
CREATE POLICY "Users can view their payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM participants 
            WHERE participants.id = payments.participant_id 
            AND participants.user_id::text = auth.uid()::text
        )
    );

-- Políticas para logs de tokens
CREATE POLICY "Users can view their token usage" ON token_usage_logs
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- =====================================================
-- 7. INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar redes blockchain soportadas
INSERT INTO networks (name, chain_id, rpc_url, is_active) VALUES
('Ethereum Mainnet', 1, 'https://ethereum.publicnode.com', true),
('Polygon', 137, 'https://polygon-rpc.com', true),
('Mantle', 5000, 'https://rpc.mantle.xyz', true),
('Arbitrum One', 42161, 'https://arb1.arbitrum.io/rpc', true),
('Optimism', 10, 'https://mainnet.optimism.io', true);

-- =====================================================
-- 8. COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE users IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE networks IS 'Redes blockchain soportadas';
COMMENT ON TABLE splits IS 'Grupos de gastos compartidos';
COMMENT ON TABLE tokens IS 'Tokens de acceso para unirse a splits';
COMMENT ON TABLE participants IS 'Participantes en splits';
COMMENT ON TABLE payments IS 'Transacciones de pago';
COMMENT ON TABLE token_usage_logs IS 'Registro de uso de tokens';

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================
-- Este script crea toda la estructura de la base de datos
-- Ejecutar en el SQL Editor de Supabase 