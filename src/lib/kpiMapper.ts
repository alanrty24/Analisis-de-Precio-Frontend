import type { AnalysisItem, DashboardKpis, KpiCardData, KpiVariables } from './types'

const DEFAULT_KPIS: DashboardKpis = {
  bestPriceSavings: 0,
  bestPriceDeltaLabel: 'Sin variacion disponible',
  cheapestProductName: 'Sin producto identificado',
  cheapestProductUnitPrice: 0,
  providerCount: 0,
  providerTags: [],
}

const toProviderTag = (index: number) => `V${index + 1}`

const DEFAULT_KPI_VARIABLES: KpiVariables = {
  totalRows: 0,
  uniqueProducts: 0,
  uniqueProviders: 0,
  totalSavings: 0,
  totalHighestPrice: 0,
  savingsPercentage: 0,
}

export const buildKpiVariables = (items: AnalysisItem[]): KpiVariables => {
  if (items.length === 0) {
    return DEFAULT_KPI_VARIABLES
  }

  let totalSavings = 0
  let totalHighestPrice = 0
  const providerSet = new Set<string>()
  const productGroups = new Map<string, AnalysisItem[]>()

  items.forEach((item) => {
    providerSet.add(item.nombreProveedor)

    const groupKey = `${item.codigoProducto}::${item.nombreProducto}`
    const existingGroup = productGroups.get(groupKey)

    if (existingGroup) {
      existingGroup.push(item)
      return
    }

    productGroups.set(groupKey, [item])
  })

  productGroups.forEach((groupItems) => {
    const prices = groupItems.map((item) => item.precioUnitario)
    const lowestPrice = Math.min(...prices)
    const highestPrice = Math.max(...prices)

    totalSavings += Math.max(highestPrice - lowestPrice, 0)
    totalHighestPrice += highestPrice
  })

  return {
    totalRows: items.length,
    uniqueProducts: productGroups.size,
    uniqueProviders: providerSet.size,
    totalSavings,
    totalHighestPrice,
    savingsPercentage: totalHighestPrice > 0 ? (totalSavings / totalHighestPrice) * 100 : 0,
  }
}

export const buildDashboardKpis = (items: AnalysisItem[]): DashboardKpis => {
  if (items.length === 0) {
    return DEFAULT_KPIS
  }

  let cheapestProductName = DEFAULT_KPIS.cheapestProductName
  let cheapestProductUnitPrice = Number.POSITIVE_INFINITY
  const providerSet = new Set<string>()
  const kpiVariables = buildKpiVariables(items)

  items.forEach((item) => {
    providerSet.add(item.nombreProveedor)

    if (item.precioUnitario < cheapestProductUnitPrice) {
      cheapestProductUnitPrice = item.precioUnitario
      cheapestProductName = item.nombreProducto
    }

  })

  const providerTags = Array.from(providerSet)
    .slice(0, 3)
    .map((_, index) => toProviderTag(index))

  return {
    bestPriceSavings: kpiVariables.totalSavings,
    bestPriceDeltaLabel:
      kpiVariables.totalSavings > 0
        ? `${kpiVariables.savingsPercentage.toFixed(1)}% vs. precio mas alto`
        : DEFAULT_KPIS.bestPriceDeltaLabel,
    cheapestProductName,
    cheapestProductUnitPrice:
      Number.isFinite(cheapestProductUnitPrice) && cheapestProductUnitPrice !== Number.POSITIVE_INFINITY
        ? cheapestProductUnitPrice
        : DEFAULT_KPIS.cheapestProductUnitPrice,
    providerCount: providerSet.size,
    providerTags,
  }
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export const buildKpiCards = (kpis: DashboardKpis): KpiCardData[] => {
  const remainingProviders = Math.max(kpis.providerCount - kpis.providerTags.length, 0)
  const providerTags =
    remainingProviders > 0
      ? [...kpis.providerTags, `+${remainingProviders}`]
      : kpis.providerTags

  return [
    {
      id: 'best-price',
      title: 'MEJOR PRECIO',
      mainValue: `Ahorro Total: ${currency.format(kpis.bestPriceSavings)}`,
      subtitle: `↑ ${kpis.bestPriceDeltaLabel}`,
      tone: 'green',
      badge: 'TOP INSIGHT',
    },
    {
      id: 'cheapest-product',
      title: 'PRODUCTO ECONOMICO',
      mainValue: kpis.cheapestProductName,
      subtitle: `Unit Price: ${currency.format(kpis.cheapestProductUnitPrice)}`,
      tone: 'indigo',
    },
    {
      id: 'coverage',
      title: 'ANALISIS DE COBERTURA',
      mainValue: `${kpis.providerCount} Proveedores Detectados`,
      subtitle: providerTags.length > 0 ? ' ' : 'Sin proveedores detectados',
      tone: 'rose',
      tags: providerTags,
    },
  ]
}