// composables/useRiskApi.ts
import type { TaxpayerRiskData, TaxpayerInfo } from '~/types/risk'
import type { ApiError, ApiResponse } from '~/types/api'

export const useRiskApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.apiBase}/api`

  const handleApiError = (error: unknown): ApiError => {
    if (error instanceof Response) {
      return {
        code: 'API_ERROR',
        message: `API Error: ${error.statusText}`,
        details: { status: error.status }
      }
    }
    if (error instanceof Error) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message
      }
    }
    return {
      code: 'UNKNOWN',
      message: 'An unexpected error occurred'
    }
  }

  const fetchTaxpayers = async (): Promise<ApiResponse<TaxpayerInfo[]>> => {
    try {
      const response = await fetch(`${baseUrl}/risk/taxpayers`)
      if (!response.ok) throw response
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  }

  const fetchTaxpayerRisk = async (taxpayerId: string): Promise<ApiResponse<TaxpayerRiskData>> => {
    try {
      const response = await fetch(`${baseUrl}/risk/${taxpayerId}`)
      if (!response.ok) throw response
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  }

  const fetchRiskHistory = async (taxpayerId: string): Promise<ApiResponse<TaxpayerRiskData['history']>> => {
    try {
      const response = await fetch(`${baseUrl}/risk/${taxpayerId}/history`)
      if (!response.ok) throw response
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  }

  return {
    fetchTaxpayers,
    fetchTaxpayerRisk,
    fetchRiskHistory
  }
}
