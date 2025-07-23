# 🔑 Cómo obtener tu API Key de LiFi

## Pasos para obtener la API Key gratuita:

### 1. Ir al Dashboard de LiFi
- Ve a: https://li.quest/
- Haz clic en "Get Started" o "Dashboard"

### 2. Crear una cuenta
- Regístrate con tu email
- Confirma tu cuenta

### 3. Obtener la API Key
- Una vez logueado, ve a la sección "API Keys"
- Haz clic en "Create New API Key"
- Dale un nombre descriptivo (ej: "splitPay-app")
- Copia la API Key generada

### 4. Configurar en el proyecto
- Abre el archivo `.env.local`
- Reemplaza `tu_api_key_aqui` con tu API Key real
- Guarda el archivo

### 5. Verificar la configuración
```bash
npm run check-lifi
```

## Límites de la API gratuita:
- ✅ 1000 requests por mes
- ✅ Acceso completo a todas las redes
- ✅ Soporte para cross-chain swaps

## Enlaces útiles:
- Dashboard: https://li.quest/
- Documentación: https://docs.li.fi/
- SDK: https://docs.li.fi/products/li.fi-api/sdk 