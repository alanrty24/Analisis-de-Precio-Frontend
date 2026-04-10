import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { requestAnalysisItems } from '../lib/api'
import { buildDashboardKpis, buildKpiVariables } from '../lib/kpiMapper'
import type { AnalysisItem, DashboardKpis, KpiVariables } from '../lib/types'

type DashboardState = {
  selectedFiles: File[]
  isLoading: boolean
  error: string | null
  analysisItems: AnalysisItem[]
  kpis: DashboardKpis
  kpiVariables: KpiVariables
  setSelectedFiles: (files: File[]) => void
  analyzeSelectedFile: () => Promise<void>
  resetAnalysis: () => void
}

const defaultKpis: DashboardKpis = {
  bestPriceSavings: 0,
  bestPriceDeltaLabel: 'Sin analisis disponible',
  cheapestProductName: 'Sin producto identificado',
  cheapestProductUnitPrice: 0,
  providerCount: 0,
  providerTags: [],
}

const defaultKpiVariables: KpiVariables = {
  totalRows: 0,
  uniqueProducts: 0,
  uniqueProviders: 0,
  totalBestPrice: 0,
  averageBestPrice: 0,
  totalUnitsAvailable: 0,
  latestAnalysisTimestamp: null,
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      selectedFiles: [],
      isLoading: false,
      error: null,
      analysisItems: [],
      kpis: defaultKpis,
      kpiVariables: defaultKpiVariables,
      setSelectedFiles: (files) => {
        // No persistimos File[] porque localStorage no puede serializarlos de forma útil.
        set({ selectedFiles: files, error: null })
      },
      analyzeSelectedFile: async () => {
        const currentFiles = get().selectedFiles

        if (currentFiles.length === 0) {
          set({ error: 'Selecciona al menos un archivo antes de analizar.' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          const items = await requestAnalysisItems(currentFiles)
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
      resetAnalysis: () => {
        try {
          localStorage.removeItem('apu-dashboard-storage')
        } catch (e) {
          // ignorar errores de acceso a localStorage
        }

        set({
          selectedFiles: [],
          isLoading: false,
          error: null,
          analysisItems: [],
          kpis: defaultKpis,
          kpiVariables: defaultKpiVariables,
        })
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