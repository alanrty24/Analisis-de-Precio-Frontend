import type { AnalysisItem, DashboardKpis, KpiCardData, KpiVariables } from './types'

const DEFAULT_KPIS: DashboardKpis = {
  bestPriceSavings: 0,
  bestPriceDeltaLabel: 'Sin analisis disponible',
  cheapestProductName: 'Sin producto identificado',
  cheapestProductUnitPrice: 0,
  providerCount: 0,
  providerTags: [],
}

const toProviderTag = (providerName: string) => {
  // Generamos chips cortos a partir del nombre del proveedor ganador.
  const compactName = providerName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('')

  return compactName || providerName.slice(0, 2).toUpperCase()
}

const DEFAULT_KPI_VARIABLES: KpiVariables = {
  totalRows: 0,
  uniqueProducts: 0,
  uniqueProviders: 0,
  totalBestPrice: 0,
  averageBestPrice: 0,
  totalUnitsAvailable: 0,
  latestAnalysisTimestamp: null,
}

export const buildKpiVariables = (items: AnalysisItem[]): KpiVariables => {
  if (items.length === 0) {
    return DEFAULT_KPI_VARIABLES
  }

  let totalBestPrice = 0
  let totalUnitsAvailable = 0
  let latestAnalysisTimestamp: string | null = null
  const providerSet = new Set<string>()
  const uniqueProducts = new Set<string>()

  items.forEach((item) => {
    providerSet.add(item.proveedorGanador)
    uniqueProducts.add(`${item.codigoBarra}::${item.nombreProducto}`)
    totalBestPrice += item.mejorPrecio
    totalUnitsAvailable += item.unidadesDisponibles

    // Conservamos el timestamp mas reciente disponible para mostrar frescura del analisis.
    if (item.analisisTimestamp && (!latestAnalysisTimestamp || item.analisisTimestamp > latestAnalysisTimestamp)) {
      latestAnalysisTimestamp = item.analisisTimestamp
    }
  })

  return {
    totalRows: items.length,
    uniqueProducts: uniqueProducts.size,
    uniqueProviders: providerSet.size,
    totalBestPrice,
    averageBestPrice: items.length > 0 ? totalBestPrice / items.length : 0,
    totalUnitsAvailable,
    latestAnalysisTimestamp,
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
    providerSet.add(item.proveedorGanador)

    if (item.mejorPrecio < cheapestProductUnitPrice) {
      cheapestProductUnitPrice = item.mejorPrecio
      cheapestProductName = item.nombreProducto
    }
  })

  const providerTags = Array.from(providerSet)
    .slice(0, 3)
    .map((providerName) => toProviderTag(providerName))

  return {
    // Reutilizamos la propiedad existente para el costo total optimizado del resultado actual.
    bestPriceSavings: kpiVariables.totalBestPrice,
    bestPriceDeltaLabel: kpiVariables.latestAnalysisTimestamp
      ? `Analizado: ${kpiVariables.latestAnalysisTimestamp}`
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
      title: 'COSTO OPTIMIZADO',
      mainValue: `Total: ${currency.format(kpis.bestPriceSavings)}`,
      subtitle: kpis.bestPriceDeltaLabel,
      tone: 'green',
      badge: 'TOP INSIGHT',
    },
    {
      id: 'cheapest-product',
      title: 'PRODUCTO MAS BARATO',
      mainValue: kpis.cheapestProductName,
      subtitle: `Mejor precio: ${currency.format(kpis.cheapestProductUnitPrice)}`,
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

// Calcula ahorro relativo por proveedor: compara el precio promedio
// cuando el proveedor es ganador vs el precio promedio global.
export type ProviderSavings = {
  provider: string
  avgPrice: number
  count: number
  savingsPercent: number
}

export const computeProviderSavings = (items: AnalysisItem[]): ProviderSavings[] => {
  if (items.length === 0) return []

  const sums = new Map<string, { sum: number; count: number }>()
  let globalSum = 0

  items.forEach((it) => {
    globalSum += it.mejorPrecio
    const entry = sums.get(it.proveedorGanador) ?? { sum: 0, count: 0 }
    entry.sum += it.mejorPrecio
    entry.count += 1
    sums.set(it.proveedorGanador, entry)
  })

  const globalAvg = globalSum / items.length

  return Array.from(sums.entries()).map(([provider, { sum, count }]) => {
    const avgPrice = sum / count
    const savingsPercent = globalAvg > 0 ? ((globalAvg - avgPrice) / globalAvg) * 100 : 0

    return {
      provider,
      avgPrice,
      count,
      savingsPercent,
    }
  }).sort((a, b) => b.savingsPercent - a.savingsPercent)
}

// Encuentra productos con rango de precio (max - min) cuando existen
// múltiples entradas por el mismo producto (por codigoBarra + nombre).
export type PriceGap = {
  productKey: string
  productName: string
  minProvider: string
  minPrice: number
  maxProvider: string
  maxPrice: number
  diff: number
}

export const computeTopPriceGaps = (items: AnalysisItem[], top = 5): PriceGap[] => {
  const groups = new Map<string, AnalysisItem[]>()

  items.forEach((it) => {
    const key = `${it.codigoBarra}::${it.nombreProducto}`
    const arr = groups.get(key) ?? []
    arr.push(it)
    groups.set(key, arr)
  })

  const gaps: PriceGap[] = []

  groups.forEach((arr, key) => {
    if (arr.length < 2) return // no hay comparativa si solo existe 1 registro

    let minItem = arr[0]
    let maxItem = arr[0]

    for (const it of arr) {
      if (it.mejorPrecio < minItem.mejorPrecio) minItem = it
      if (it.mejorPrecio > maxItem.mejorPrecio) maxItem = it
    }

    const diff = Math.abs(maxItem.mejorPrecio - minItem.mejorPrecio)

    gaps.push({
      productKey: key,
      productName: minItem.nombreProducto,
      minProvider: minItem.proveedorGanador,
      minPrice: minItem.mejorPrecio,
      maxProvider: maxItem.proveedorGanador,
      maxPrice: maxItem.mejorPrecio,
      diff,
    })
  })

  return gaps.sort((a, b) => b.diff - a.diff).slice(0, top)
}

// Selecciona los productos con mejor combinación: precio bajo y gran stock.
export type CheapHighStock = {
  productKey: string
  productName: string
  provider: string
  price: number
  units: number
  score: number
}

export const computeTopCheapHighStock = (items: AnalysisItem[], top = 5): CheapHighStock[] => {
  if (items.length === 0) return []

  const groups = new Map<string, AnalysisItem[]>()

  items.forEach((it) => {
    const key = `${it.codigoBarra}::${it.nombreProducto}`
    const arr = groups.get(key) ?? []
    arr.push(it)
    groups.set(key, arr)
  })

  const candidates: CheapHighStock[] = []

  groups.forEach((arr, key) => {
    // Elegimos el registro con menor precio; en empate elegimos mayor stock.
    let best = arr[0]

    for (const it of arr) {
      if (it.mejorPrecio < best.mejorPrecio) best = it
      else if (it.mejorPrecio === best.mejorPrecio && it.unidadesDisponibles > best.unidadesDisponibles) best = it
    }

    const units = Number.isFinite(best.unidadesDisponibles) ? best.unidadesDisponibles : 0
    const price = Number.isFinite(best.mejorPrecio) ? best.mejorPrecio : Number.POSITIVE_INFINITY
    const score = price > 0 && Number.isFinite(price) ? units / price : 0

    candidates.push({
      productKey: key,
      productName: best.nombreProducto,
      provider: best.proveedorGanador,
      price,
      units,
      score,
    })
  })

  return candidates
    .sort((a, b) => {
      if (b.score === a.score) {
        if (b.units === a.units) return a.price - b.price
        return b.units - a.units
      }
      return b.score - a.score
    })
    .slice(0, top)
}