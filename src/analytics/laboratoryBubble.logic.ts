import type { AnalysisItem } from '../lib/types'

export type LaboratoryBubbleDatum = {
  // Mantenemos el nombre explicito para evitar ambiguedad con otros labels.
  nombreLaboratorio: string
  winningProducts: number
  averageWinningPrice: number
  accumulatedSavings: number
}

// Construye el ranking de laboratorios ganadores por producto (precio mas bajo).
export const buildLaboratoryBubbleData = (items: AnalysisItem[]): LaboratoryBubbleDatum[] => {
  const productGroups = new Map<string, AnalysisItem[]>()

  items.forEach((item) => {
    // Si no viene laboratorio, usamos nombreProveedor como respaldo operativo.
    const nombreLaboratorio = item.nombreLaboratorio?.trim() || item.nombreProveedor.trim()
    const normalizedItem = {
      ...item,
      nombreLaboratorio,
    }

    const productKey = `${item.codigoProducto}::${item.nombreProducto}`
    const existingItems = productGroups.get(productKey)

    if (existingItems) {
      existingItems.push(normalizedItem)
      return
    }

    productGroups.set(productKey, [normalizedItem])
  })

  const laboratoryMap = new Map<
    string,
    { productSet: Set<string>; totalWinningPrice: number; totalSavings: number }
  >()

  productGroups.forEach((groupItems, productKey) => {
    const prices = groupItems.map((entry) => entry.precioUnitario)
    const lowestPrice = Math.min(...prices)
    const highestPrice = Math.max(...prices)
    const winners = groupItems.filter((entry) => entry.precioUnitario === lowestPrice)

    winners.forEach((winner) => {
      const current = laboratoryMap.get(winner.nombreLaboratorio) ?? {
        productSet: new Set<string>(),
        totalWinningPrice: 0,
        totalSavings: 0,
      }

      current.productSet.add(productKey)
      current.totalWinningPrice += lowestPrice
      current.totalSavings += Math.max(highestPrice - lowestPrice, 0)
      laboratoryMap.set(winner.nombreLaboratorio, current)
    })
  })

  return Array.from(laboratoryMap.entries())
    .map(([nombreLaboratorio, values]) => {
      const winningProducts = values.productSet.size
      const averageWinningPrice =
        winningProducts > 0 ? values.totalWinningPrice / winningProducts : 0

      return {
        nombreLaboratorio,
        winningProducts,
        averageWinningPrice,
        accumulatedSavings: values.totalSavings,
      }
    })
    .sort((a, b) => {
      if (b.winningProducts !== a.winningProducts) {
        return b.winningProducts - a.winningProducts
      }

      return a.averageWinningPrice - b.averageWinningPrice
    })
}