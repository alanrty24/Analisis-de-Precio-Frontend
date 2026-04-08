import MaterialSymbol from '../components/ui/MaterialSymbol'
import { useDashboardStore } from '../store/dashboardStore'

const FileUploader = () => {
  const selectedFile = useDashboardStore((state) => state.selectedFile)
  const isLoading = useDashboardStore((state) => state.isLoading)
  const error = useDashboardStore((state) => state.error)
  const setSelectedFile = useDashboardStore((state) => state.setSelectedFile);
  const analyzeSelectedFile = useDashboardStore((state) => state.analyzeSelectedFile)

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/75 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:rounded-4xl sm:p-6">
      <label
        htmlFor="vendor-comparison-upload"
        // Altura base mas contenida en mobile y ampliada en pantallas mayores.
        className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-100/80 px-4 py-7 text-center transition hover:border-emerald-300 hover:bg-slate-50 sm:min-h-72 sm:rounded-4xl sm:px-6 sm:py-10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-emerald-700 shadow-inner shadow-white/70">
          <MaterialSymbol name="upload" className="text-[26px] font-light" />
        </div>

        <div className="mt-5 space-y-2">
          <h3 className="font-['Manrope'] text-[clamp(1.1rem,4vw,1.75rem)] font-extrabold text-slate-900">
            Import Vendor Comparison Sheet
          </h3>
          <p className="text-sm text-slate-500 sm:text-base">
            Drag and drop your .xlsx or .csv files here
          </p>
        </div>

        <input
          id="vendor-comparison-upload"
          type="file"
          accept=".xlsx,.csv"
          className="sr-only"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null
            setSelectedFile(nextFile)
          }}
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {selectedFile
            ? `Archivo seleccionado: ${selectedFile.name}`
            : 'Selecciona un archivo para habilitar el analisis'}
        </p>

        <button
          type="button"
          onClick={() => {
            void analyzeSelectedFile()
          }}
          disabled={!selectedFile || isLoading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
        >
          {isLoading ? 'Procesando...' : 'Analizar Excel'}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
    </section>
  )
}

export default FileUploader