import type { AnalysisItem } from './types'

const API_BASE_URL = import.meta.env.VITE_ANALISIS_API_URL ?? 'https://analisis-precio-backend.onrender.com/analizar'

type ApiResponseShape =
  | Array<{
      codigo_barra?: string
      codigo_interno_proveedor?: string
      nombre_producto?: string
      mejor_precio?: number | string
      proveedor_ganador?: string
      unidades_disponibles?: number | string
      analisis_timestamp?: string
    }>
  | {
      data?: Array<{
        codigo_barra?: string
        codigo_interno_proveedor?: string
        nombre_producto?: string
        mejor_precio?: number | string
        proveedor_ganador?: string
        unidades_disponibles?: number | string
        analisis_timestamp?: string
      }>
      results?: Array<{
        codigo_barra?: string
        codigo_interno_proveedor?: string
        nombre_producto?: string
        mejor_precio?: number | string
        proveedor_ganador?: string
        unidades_disponibles?: number | string
        analisis_timestamp?: string
      }>
      items?: Array<{
        codigo_barra?: string
        codigo_interno_proveedor?: string
        nombre_producto?: string
        mejor_precio?: number | string
        proveedor_ganador?: string
        unidades_disponibles?: number | string
        analisis_timestamp?: string
      }>
    }

const parseNumber = (value: unknown) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : Number.NaN
  }

  if (typeof value === 'string') {
    return Number.parseFloat(value.replace(/[^0-9.,-]/g, '').replace(',', '.'))
  }

  return Number.NaN
}

const normalizeItem = (
  item: {
    codigo_barra?: string
    codigo_interno_proveedor?: string
    nombre_producto?: string
    mejor_precio?: number | string
    proveedor_ganador?: string
    nombre_laboratorio?: string
    unidades_disponibles?: number | string
    analisis_timestamp?: string
  },
): AnalysisItem | null => {
  // Normalizamos claves snake_case de la API a un modelo interno consistente.
  const codigoBarra = typeof item.codigo_barra === 'string' ? item.codigo_barra.trim() : ''
  const codigoInternoProveedor =
    typeof item.codigo_interno_proveedor === 'string' ? item.codigo_interno_proveedor.trim() : ''
  const nombreProducto = typeof item.nombre_producto === 'string' ? item.nombre_producto.trim() : ''
  const proveedorGanador =
    typeof item.proveedor_ganador === 'string' ? item.proveedor_ganador.trim() : ''
  // Preferimos `nombre_laboratorio` si el backend lo devuelve explícitamente;
  // en caso contrario usamos `proveedor_ganador` como fallback para compatibilidad.
  const nombreLaboratorio =
    typeof item.nombre_laboratorio === 'string' && item.nombre_laboratorio.trim()
      ? item.nombre_laboratorio.trim()
      : proveedorGanador
  const mejorPrecio = parseNumber(item.mejor_precio)
  const unidadesDisponibles = parseNumber(item.unidades_disponibles)
  const analisisTimestamp =
    typeof item.analisis_timestamp === 'string' ? item.analisis_timestamp.trim() : ''

  if (!codigoBarra || !nombreProducto || !proveedorGanador || !Number.isFinite(mejorPrecio)) {
    return null
  }

  return {
    codigoBarra,
    codigoInternoProveedor,
    nombreProducto,
    mejorPrecio,
    proveedorGanador,
    // Si el backend omite unidades, conservamos cero para no romper agregaciones.
    unidadesDisponibles: Number.isFinite(unidadesDisponibles) ? unidadesDisponibles : 0,
    analisisTimestamp,
    // Alias para reutilizar la analitica previa basada en laboratorio.
    nombreLaboratorio,
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

export const requestAnalysisItems = async (files: File[]) => {
  const formData = new FormData()

  // Respetamos el contrato del backend: un archivo usa `file`, multiples usan `files`.
  if (files.length === 1) {
    formData.append('file', files[0])
  } else {
    files.forEach((file) => {
      formData.append('files', file)
    })
  }

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