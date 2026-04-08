import type { AnalysisItem } from './types'

const API_BASE_URL = import.meta.env.VITE_ANALISIS_API_URL ?? 'https://analisis-precio-backend.onrender.com/analizar'

type ApiResponseShape =
  | Array<Partial<AnalysisItem> & { precioUnitario?: number | string }>
  | {
      data?: Array<Partial<AnalysisItem> & { precioUnitario?: number | string }>
      results?: Array<Partial<AnalysisItem> & { precioUnitario?: number | string }>
      items?: Array<Partial<AnalysisItem> & { precioUnitario?: number | string }>
    }

const normalizeItem = (
  item: Partial<AnalysisItem> & { precioUnitario?: number | string },
): AnalysisItem | null => {
  // Normalizamos campos string para evitar inconsistencias de espacios y mayusculas.
  const codigoProducto = typeof item.codigoProducto === 'string' ? item.codigoProducto.trim() : ''
  const nombreProducto = typeof item.nombreProducto === 'string' ? item.nombreProducto.trim() : ''
  const nombreProveedor = typeof item.nombreProveedor === 'string' ? item.nombreProveedor.trim() : ''
  const nombreLaboratorio =
    typeof item.nombreLaboratorio === 'string' && item.nombreLaboratorio.trim().length > 0
      ? item.nombreLaboratorio.trim()
      : nombreProveedor
  const rawPrice: unknown = item.precioUnitario
  const precioUnitario =
    typeof rawPrice === 'number'
      ? rawPrice
      : typeof rawPrice === 'string'
        ? Number.parseFloat(rawPrice.replace(/[^0-9.,-]/g, '').replace(',', '.'))
        : Number.NaN

  if (!codigoProducto || !nombreProducto || !nombreProveedor || !Number.isFinite(precioUnitario)) {
    return null
  }

  return {
    codigoProducto,
    nombreProducto,
    // Usamos nombreProveedor como fallback cuando la API no envia laboratorio.
    nombreLaboratorio,
    nombreProveedor,
    precioUnitario,
  }
}

const extractItems = (payload: ApiResponseShape): AnalysisItem[] => {
  const rawItems = Array.isArray(payload)
    ? payload
    : payload.data ?? payload.results ?? payload.items ?? []

  return rawItems
    .map((item) => normalizeItem(item))
    .filter((item): item is AnalysisItem => item !== null)
}

export const requestAnalysisItems = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`No se pudo procesar el archivo (${response.status})`)
  }

  const payload = (await response.json()) as ApiResponseShape
  return extractItems(payload)
}