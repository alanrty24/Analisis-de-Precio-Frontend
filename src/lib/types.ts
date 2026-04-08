export type AnalysisItem = {
  codigoProducto: string
  nombreProducto: string
  nombreProveedor: string
  // Campo normalizado con el nombre oficial del laboratorio.
  nombreLaboratorio: string
  precioUnitario: number
}

export type DashboardKpis = {
  bestPriceSavings: number
  bestPriceDeltaLabel: string
  cheapestProductName: string
  cheapestProductUnitPrice: number
  providerCount: number
  providerTags: string[]
}

export type KpiVariables = {
  totalRows: number
  uniqueProducts: number
  uniqueProviders: number
  totalSavings: number
  totalHighestPrice: number
  savingsPercentage: number
}

export type KpiCardTone = 'green' | 'indigo' | 'rose'

export type KpiCardData = {
  id: string
  title: string
  mainValue: string
  subtitle: string
  tone: KpiCardTone
  badge?: string
  tags?: string[]
}