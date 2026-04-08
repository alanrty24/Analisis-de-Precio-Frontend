import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { requestAnalysisItems } from '../lib/api'
import { buildDashboardKpis, buildKpiVariables } from '../lib/kpiMapper'
import type { AnalysisItem, DashboardKpis, KpiVariables } from '../lib/types'

type DashboardState = {
  selectedFile: File | null
  isLoading: boolean
  error: string | null
  analysisItems: AnalysisItem[]
  kpis: DashboardKpis
  kpiVariables: KpiVariables
  setSelectedFile: (file: File | null) => void
  analyzeSelectedFile: () => Promise<void>
}

const defaultKpis: DashboardKpis = {
  bestPriceSavings: 12450,
  bestPriceDeltaLabel: '14.2% vs. Last Quarter',
  cheapestProductName: 'Motor Electrico X-1',
  cheapestProductUnitPrice: 450,
  providerCount: 8,
  providerTags: ['V1', 'V2', 'V3'],
}

const defaultKpiVariables: KpiVariables = {
  totalRows: 0,
  uniqueProducts: 0,
  uniqueProviders: 0,
  totalSavings: 0,
  totalHighestPrice: 0,
  savingsPercentage: 0,
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      selectedFile: null,
      isLoading: false,
      error: null,
      analysisItems: [],
      kpis: defaultKpis,
      kpiVariables: defaultKpiVariables,
      setSelectedFile: (file) => {
        set({ selectedFile: file, error: null })
      },
      analyzeSelectedFile: async () => {
        const currentFile = get().selectedFile

        if (!currentFile) {
          set({ error: 'Selecciona un archivo antes de analizar.' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          const items = await requestAnalysisItems(currentFile)
          const kpis = buildDashboardKpis(items)
          const kpiVariables = buildKpiVariables(items)

          set({
            analysisItems: items,
            kpis,
            kpiVariables,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'No fue posible procesar el archivo con la API.',
          })
        }
      },
    }),
    {
      name: 'apu-dashboard-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        analysisItems: state.analysisItems,
        kpis: state.kpis,
        kpiVariables: state.kpiVariables,
      }),
    },
  ),
)