import type { TaxpayerRiskData } from '~/types/risk'
import type { ApiError } from '~/types/api'
import { useRiskApi } from '~/composables/useRiskApi'

export const useRiskData = () => {
  const api = useRiskApi()
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const taxpayerData = ref<TaxpayerRiskData | null>(null)
  const riskHistory = ref<TaxpayerRiskData['history'] | null>(null)

  const fetchData = async (taxpayerId: string) => {
    loading.value = true
    error.value = null
    
    const [riskResponse, historyResponse] = await Promise.all([
      api.fetchTaxpayerRisk(taxpayerId),
      api.fetchRiskHistory(taxpayerId)
    ])

    if (riskResponse.error || historyResponse.error) {
      error.value = riskResponse.error || historyResponse.error
      taxpayerData.value = null
      riskHistory.value = null
    } else {
      taxpayerData.value = riskResponse.data
      riskHistory.value = historyResponse.data
    }
    
    loading.value = false
  }

  return {
    taxpayerData,
    riskHistory,
    loading,
    error,
    fetchData
  }
}