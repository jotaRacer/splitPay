"use client"

import { useCallback } from 'react'
import { LIFI_CONFIG } from '@/lib/lifi-config'
import { usePrivyWeb3 } from '@/contexts/privy-context'
import { toast } from 'sonner'

export function useNetworkValidator() {
  const { chainId, switchNetwork } = usePrivyWeb3()

  const isNetworkSupported = useCallback((networkId: number) => {
    return Object.values(LIFI_CONFIG.supportedNetworks).some(
      network => network.chainId === networkId
    )
  }, [])

  const validateAndSwitchNetwork = useCallback(async (requiredChainId: number) => {
    if (!isNetworkSupported(requiredChainId)) {
      toast.error(`Red no soportada. Redes soportadas: ${Object.values(LIFI_CONFIG.supportedNetworks).map(n => n.name).join(', ')}`)
      return false
    }

    if (chainId !== requiredChainId) {
      try {
        await switchNetwork(requiredChainId)
        const networkName = Object.values(LIFI_CONFIG.supportedNetworks).find(n => n.chainId === requiredChainId)?.name || 'red requerida'
        toast.success(`Cambiado a ${networkName}`)
        return true
      } catch (error) {
        toast.error('Error al cambiar de red')
        return false
      }
    }

    return true
  }, [chainId, switchNetwork, isNetworkSupported])

  const getSupportedNetworks = useCallback(() => {
    return Object.values(LIFI_CONFIG.supportedNetworks)
  }, [])

  return {
    isNetworkSupported,
    validateAndSwitchNetwork,
    getSupportedNetworks
  }
} 