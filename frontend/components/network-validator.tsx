"use client"

import { useCallback, useState, useEffect } from 'react'
import { LIFI_CONFIG } from '@/lib/lifi-config'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { toast } from 'sonner'

export function useNetworkValidator() {
  const { getChainId } = usePrivyWeb3()
  const [chainId, setChainId] = useState<number | null>(null)

  // Get chain ID on mount and when context changes
  useEffect(() => {
    if (getChainId) {
      getChainId().then(setChainId)
    }
  }, [getChainId])

  const isNetworkSupported = useCallback((networkId: number) => {
    return Object.values(LIFI_CONFIG.supportedNetworks).some(
      network => network.chainId === networkId
    )
  }, [])

  const validateNetwork = useCallback(async (requiredChainId: number) => {
    if (!isNetworkSupported(requiredChainId)) {
      toast.error(`Red no soportada. Redes soportadas: ${Object.values(LIFI_CONFIG.supportedNetworks).map(n => n.name).join(', ')}`)
      return false
    }

    const currentChainId = await getChainId()
    if (currentChainId !== requiredChainId) {
      const networkName = Object.values(LIFI_CONFIG.supportedNetworks).find(n => n.chainId === requiredChainId)?.name || 'red requerida'
      toast.error(`Por favor, cambia a la red ${networkName} en tu wallet`)
      return false
    }

    return true
  }, [getChainId, isNetworkSupported])

  const getSupportedNetworks = useCallback(() => {
    return Object.values(LIFI_CONFIG.supportedNetworks)
  }, [])

  return {
    chainId,
    isNetworkSupported,
    validateNetwork,
    getSupportedNetworks
  }
} 