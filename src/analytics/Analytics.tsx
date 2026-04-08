import LaboratoryBubbleChart from './LaboratoryBubbleChart'
import LowestPriceProductsTable from './LowestPriceProductsTable'

const Analytics = () => {
  return (
    // Contenedor con ancho controlado y mismo margen horizontal para todas las secciones.
    <div className="w-full min-w-0 space-y-4 overflow-x-hidden px-1 sm:px-2 sm:space-y-6">
      <section className="mx-auto w-full max-w-full rounded-3xl border border-slate-200/80 bg-white/75 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.05)] backdrop-blur sm:rounded-4xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Analisis</p>
        <h2 className="mt-2 font-['Manrope'] text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Analisis por laboratorio
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Este bloque identifica que laboratorio concentra mas productos con el menor precio unitario disponible en cada comparativa.
        </p>
      </section>

        <LaboratoryBubbleChart />

        <LowestPriceProductsTable />
    </div>
  )
}

export default Analytics