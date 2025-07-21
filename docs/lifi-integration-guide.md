# Guía de Integración con LiFi

## 📋 **Requisitos Previos**

### 1. Obtener API Key de LiFi
- Ve a https://li.quest/
- Regístrate para obtener una cuenta gratuita
- Obtén tu API key desde el dashboard
- La API key gratuita permite hasta 1000 requests por mes

### 2. Configurar Variables de Entorno
Crear archivo `.env.local` en la raíz del proyecto:

```env
# LiFi Configuration
NEXT_PUBLIC_LIFI_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_LIFI_API_URL=https://li.quest

# Web3 Configuration
NEXT_PUBLIC_RPC_URL_ETHEREUM=https://mainnet.infura.io/v3/TU_INFURA_KEY
NEXT_PUBLIC_RPC_URL_POLYGON=https://polygon-rpc.com
NEXT_PUBLIC_RPC_URL_BASE=https://mainnet.base.org
NEXT_PUBLIC_RPC_URL_ARBITRUM=https://arb1.arbitrum.io/rpc
```

## 🔗 **Documentación Oficial de LiFi**

### SDK Documentation
- **LiFi SDK**: https://docs.li.fi/products/li.fi-api/sdk
- **API Reference**: https://docs.li.fi/reference/api
- **Widget Documentation**: https://docs.li.fi/products/li.fi-api/widget

### Endpoints Principales
- **Get Routes**: `GET /v1/routes`
- **Get Route**: `GET /v1/routes/{routeId}`
- **Execute Route**: `POST /v1/routes/execute`

## 🛠️ **Implementación Real**

### 1. Actualizar el Hook de LiFi

```typescript
// hooks/use-lifi-payment.ts
import { getRoutes, executeRoute } from '@lifi/sdk'

// Configuración real de LiFi
const LIFI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
  apiUrl: 'https://li.quest'
}
```

### 2. Implementar Llamadas Reales

```typescript
// Verificar rutas disponibles
const routes = await getRoutes({
  fromChainId: params.fromChainId,
  toChainId: params.toChainId,
  fromToken: params.fromTokenAddress,
  toToken: params.toTokenAddress,
  fromAmount: params.fromAmount,
  fromAddress: params.fromAddress,
  toAddress: params.toAddress
})

// Ejecutar transacción
const result = await executeRoute(signer, route)
```

## 📚 **Recursos Adicionales**

### Ejemplos de Código
- **GitHub LiFi SDK**: https://github.com/lifinance/lifi-sdk
- **React Examples**: https://github.com/lifinance/lifi-widget/tree/main/examples

### Redes Soportadas
- Ethereum (1)
- Polygon (137)
- Base (8453)
- Arbitrum (42161)
- BSC (56)
- Optimism (10)

### Tokens Soportados
- Tokens nativos (ETH, MATIC, etc.)
- USDC, USDT, DAI
- Tokens ERC-20 personalizados

## 🚀 **Próximos Pasos**

1. **Obtener API Key** de LiFi
2. **Configurar variables de entorno**
3. **Actualizar el hook** con llamadas reales
4. **Probar con diferentes redes**
5. **Implementar manejo de errores específicos**

## ⚠️ **Consideraciones Importantes**

- **Rate Limits**: 1000 requests/mes (gratuito)
- **Redes**: Verificar compatibilidad antes de usar
- **Tokens**: Algunos tokens pueden no estar soportados
- **Gas**: Los costos de gas varían por red 