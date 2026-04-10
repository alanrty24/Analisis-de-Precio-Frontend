import MaterialSymbol from './MaterialSymbol'

type HelpModalProps = {
  open: boolean
  onClose: () => void
}

const steps = [
  {
    title: 'Sube tus archivos',
    body: 'En el módulo Dashboard, usa el cargador de archivos para seleccionar uno o varios Excel. El sistema aceptará múltiples archivos y procesará todos juntos.',
  },
  {
    title: 'Analiza los datos',
    body: 'Pulsa "Analizar" para enviar los archivos al backend. Verás KPIs actualizados y las tablas de análisis cuando termine el proceso.',
  },
  {
    title: 'Interpreta las métricas',
    body: 'Revisa las tarjetas KPI, el gráfico de burbujas por laboratorio y la dona de proveedores para comprender cobertura, ahorro y concentración.',
  },
  {
    title: 'Genera reportes',
    body: 'En la sección Reportes puedes filtrar por proveedor, laboratorio o buscar por producto; luego exporta a Excel con formatos profesionales.',
  },
  {
    title: 'Exportar y compartir',
    body: 'El Excel exportado incluye resumen, filtros automáticos y formato numérico para facilitar la revisión y la entrega a clientes.',
  },
]

const HelpModal = ({ open, onClose }: HelpModalProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center p-4 justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative z-70 mx-4 w-full h-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Ayuda — Cómo usar el sistema</h3>
            <p className="mt-1 text-sm text-slate-500">Guía rápida paso a paso para preparar y exportar reportes.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar ayuda"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <MaterialSymbol name="close" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {steps.map((s, idx) => (
            <div key={s.title} className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">{idx + 1}</div>
              <div>
                <p className="font-semibold text-slate-800">{s.title}</p>
                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HelpModal
