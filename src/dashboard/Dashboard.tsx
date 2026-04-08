import FileUploader from './FileUploader'
import KpiCards from './KpiCards'
import PriceComparisonBarChart from './PriceComparisonBarChart'
import ProviderCoverageDoughnutChart from './ProviderCoverageDoughnutChart'

const Dashboard = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/70 bg-slate-950 px-4 py-4 text-white shadow-[0_18px_80px_rgba(15,23,42,0.16)] sm:gap-6 sm:rounded-4xl sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
              Dashboard shell
            </span>
          </div>
        </div>
        <FileUploader />
      </section>

      <KpiCards />

      {/* Grid que inicia en una columna (mobile-first) y crece en pantallas amplias. */}
      <section className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <PriceComparisonBarChart />
        </div>
        <div className="xl:col-span-2">
          <ProviderCoverageDoughnutChart />
        </div>
      </section>
    </div>
  )
}

export default Dashboard