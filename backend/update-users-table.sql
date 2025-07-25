-- Agregar columna wallet_address a la tabla users
ALTER TABLE users 
ADD COLUMN wallet_address VARCHAR(42) UNIQUE;

-- Crear índice para búsquedas rápidas por wallet_address
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

-- Agregar comentario a la columna
COMMENT ON COLUMN users.wallet_address IS 'Dirección de wallet del usuario (formato 0x...)'; 