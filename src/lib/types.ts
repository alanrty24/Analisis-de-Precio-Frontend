export type AnalysisItem = {
  // Identificador principal del producto dentro del resultado optimizado.
  codigoBarra: string
  // Codigo interno del producto segun el proveedor ganador.
  codigoInternoProveedor: string
  // Nombre comercial del producto analizado.
  nombreProducto: string
  // Mejor precio devuelto por la API para ese producto.
  mejorPrecio: number
  // Proveedor ganador del analisis para ese producto.
  proveedorGanador: string
  // Cantidad de unidades reportadas como disponibles.
  unidadesDisponibles: number
  // Timestamp del analisis emitido por el backend.
  analisisTimestamp: string
  // Alias operativo para reutilizar vistas analiticas por laboratorio/proveedor.
  nombreLaboratorio: string
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
  totalBestPrice: number
  averageBestPrice: number
  totalUnitsAvailable: number
  latestAnalysisTimestamp: string | null
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