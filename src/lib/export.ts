import * as XLSX from 'xlsx'
import type { AnalysisItem } from './types'

export function exportAnalysisToExcel(items: AnalysisItem[], filename = 'reporte_precio_unitario.xlsx') {
  const book = XLSX.utils.book_new()

  const headers = [
    'Código de barra',
    'Nombre producto',
    'Proveedor ganador',
    'Laboratorio',
    'Mejor precio',
    'Unidades disponibles',
    'Fecha análisis',
  ]

  const now = new Date().toLocaleString('es-PE')
  const dataRows = items.map((it) => [
    it.codigoBarra ?? '',
    it.nombreProducto ?? '',
    it.proveedorGanador ?? '',
    it.nombreLaboratorio ?? it.proveedorGanador ?? '',
    typeof it.mejorPrecio === 'number' ? it.mejorPrecio : null,
    typeof it.unidadesDisponibles === 'number' ? it.unidadesDisponibles : null,
    it.analisisTimestamp ?? '',
  ])

  const ws = XLSX.utils.aoa_to_sheet([
    ['Reporte de Analisis de Precio Unitario'],
    [`Generado: ${now}`],
    [`Total de filas: ${items.length}`],
    [],
    headers,
    ...dataRows,
  ])

  ws['!merges'] = [XLSX.utils.decode_range('A1:G1')]
  ws['!cols'] = [
    { wch: 18 },
    { wch: 44 },
    { wch: 26 },
    { wch: 24 },
    { wch: 14 },
    { wch: 18 },
    { wch: 22 },
  ]

  const headerRow = 5
  const firstDataRow = headerRow + 1
  const lastDataRow = Math.max(firstDataRow, firstDataRow + dataRows.length - 1)
  ws['!autofilter'] = { ref: `A${headerRow}:G${lastDataRow}` }

  // Formatos numéricos para que Excel muestre moneda y enteros correctamente.
  for (let row = firstDataRow; row <= lastDataRow; row += 1) {
    const priceCell = ws[`E${row}`]
    if (priceCell && typeof priceCell.v === 'number') {
      priceCell.z = '"$"#,##0.00'
    }

    const stockCell = ws[`F${row}`]
    if (stockCell && typeof stockCell.v === 'number') {
      stockCell.z = '#,##0'
    }
  }

  XLSX.utils.book_append_sheet(book, ws, 'Datos')

  const uniqueProviders = new Set(items.map((item) => item.proveedorGanador)).size
  const uniqueLabs = new Set(items.map((item) => item.nombreLaboratorio || item.proveedorGanador)).size
  const prices = items.map((item) => item.mejorPrecio).filter((n) => typeof n === 'number')
  const avgPrice = prices.length ? prices.reduce((acc, n) => acc + n, 0) / prices.length : 0
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0

  const providerCounts = new Map<string, number>()
  items.forEach((item) => {
    const key = item.proveedorGanador || 'Sin proveedor'
    providerCounts.set(key, (providerCounts.get(key) ?? 0) + 1)
  })

  const topProviders = Array.from(providerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const summaryRows: (string | number)[][] = [
    ['Resumen del reporte'],
    ['Fecha de exportación', now],
    ['Productos (filas)', items.length],
    ['Proveedores únicos', uniqueProviders],
    ['Laboratorios únicos', uniqueLabs],
    ['Precio promedio', avgPrice],
    ['Precio mínimo', minPrice],
    ['Precio máximo', maxPrice],
    [],
    ['Top proveedores', 'Registros'],
    ...topProviders.map(([provider, total]) => [provider, total]),
  ]

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows)
  wsSummary['!cols'] = [{ wch: 34 }, { wch: 20 }]

  for (let row = 6; row <= 8; row += 1) {
    const metricCell = wsSummary[`B${row}`]
    if (metricCell && typeof metricCell.v === 'number') {
      metricCell.z = '"$"#,##0.00'
    }
  }

  XLSX.utils.book_append_sheet(book, wsSummary, 'Resumen')

  XLSX.writeFile(book, filename)
}

export default exportAnalysisToExcel
