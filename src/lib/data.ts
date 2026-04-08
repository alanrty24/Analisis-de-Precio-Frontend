export type LayoutMetric = {
  id: string
  label: string
  value: string
  delta: string
}

export type LayoutNavItem = {
  id: string
  label: string
  description: string
}

export type LayoutPanel = {
  id: string
  title: string
  description: string
  eyebrow: string
  colSpan: string
}

export const layoutMetrics: LayoutMetric[] = [
  {
    id: 'insumos',
    label: 'Insumos monitoreados',
    value: '128',
    delta: '+12 esta semana',
  },
  {
    id: 'variacion',
    label: 'Variacion promedio',
    value: '4.8%',
    delta: 'Frente al cierre anterior',
  },
  {
    id: 'comparativas',
    label: 'Comparativas activas',
    value: '06',
    delta: 'Listas para revision',
  },
]

export const layoutNavItems: LayoutNavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Resumen ejecutivo del analisis',
  },
  {
    id: 'catalogo',
    label: 'Catalogo',
    description: 'Materiales, equipos y cuadrillas',
  },
  {
    id: 'comparador',
    label: 'Comparador',
    description: 'Cruce entre bases y listas nuevas',
  },
  {
    id: 'alertas',
    label: 'Alertas',
    description: 'Cambios criticos y seguimiento',
  },
]

export const layoutPanels: LayoutPanel[] = [
  {
    id: 'kpi-zone',
    title: 'Zona KPI',
    description: 'Contenedor superior para indicadores, variaciones y accesos rapidos.',
    eyebrow: 'Hero block',
    colSpan: 'lg:col-span-8',
  },
  {
    id: 'activity-zone',
    title: 'Actividad reciente',
    description: 'Espacio para linea de tiempo, eventos de carga y ultimos movimientos.',
    eyebrow: 'Feed',
    colSpan: 'lg:col-span-4',
  },
  {
    id: 'analysis-zone',
    title: 'Area de analisis',
    description: 'Seccion principal para tablas comparativas y vistas de detalle.',
    eyebrow: 'Workspace',
    colSpan: 'lg:col-span-7',
  },
  {
    id: 'insights-zone',
    title: 'Insights y alertas',
    description: 'Reservado para hallazgos, desviaciones y recomendaciones.',
    eyebrow: 'Signals',
    colSpan: 'lg:col-span-5',
  },
]