import MaterialSymbol from '../components/ui/MaterialSymbol'
import { useDashboardStore } from '../store/dashboardStore'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const FileUploader = () => {
  const selectedFiles = useDashboardStore((state) => state.selectedFiles);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);
  const setSelectedFiles = useDashboardStore((state) => state.setSelectedFiles);
  const analyzeSelectedFile = useDashboardStore((state) => state.analyzeSelectedFile);
  const analysisItems = useDashboardStore((state) => state.analysisItems);
  const resetAnalysis = useDashboardStore((state) => state.resetAnalysis);

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
          multiple
          className="sr-only"
          onChange={(event) => {
            // Convertimos FileList en arreglo para soportar 1 o mas archivos Excel.
            const nextFiles = Array.from(event.target.files ?? [])
            setSelectedFiles(nextFiles)
          }}
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {selectedFiles.length > 0
            ? selectedFiles.length === 1
              ? `Archivo seleccionado: ${selectedFiles[0].name}`
              : `${selectedFiles.length} archivos seleccionados para el analisis`
            : 'Selecciona uno o mas archivos para habilitar el analisis'}
        </p>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:w-auto">
          <button
            type="button"
            onClick={() => {
              void analyzeSelectedFile()
            }}
            disabled={selectedFiles.length === 0 || isLoading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
          >
            {isLoading ? 'Procesando...' : 'Analizar archivos'}
          </button>

          <button
            type="button"
            onClick={async () => {
              if (analysisItems.length === 0) return

              const result = await Swal.fire({
                title: 'Reiniciar análisis',
                text: '¿Seguro que quieres reiniciar el análisis y borrar los datos locales?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, reiniciar',
                cancelButtonText: 'Cancelar',
                focusCancel: true,
              })

              if (result.isConfirmed) {
                resetAnalysis()

                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'Análisis reiniciado',
                  showConfirmButton: false,
                  timer: 2000,
                  timerProgressBar: true,
                })
              }
            }}
            disabled={analysisItems.length === 0 || isLoading}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Reiniciar análisis
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
    </section>
  )
}

export default FileUploader