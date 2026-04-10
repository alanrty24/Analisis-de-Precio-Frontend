import { useMemo, useState } from "react";
// import ChartCard from '../components/ui/ChartCard'
import MaterialSymbol from "../components/ui/MaterialSymbol";
import ComboBox from "../components/ui/ComboBox";
import { useDashboardStore } from "../store/dashboardStore";
import exportAnalysisToExcel from "../lib/export";

const Reports = () => {
  const analysisItems = useDashboardStore((s) => s.analysisItems);

  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const providers = useMemo(
    () =>
      Array.from(
        new Set(analysisItems.map((i) => i.proveedorGanador).filter(Boolean)),
      ),
    [analysisItems],
  );
  const labs = useMemo(
    () =>
      Array.from(
        new Set(
          analysisItems
            .map((i) => i.nombreLaboratorio || i.proveedorGanador)
            .filter(Boolean),
        ),
      ),
    [analysisItems],
  );

  const filtered = useMemo(() => {
    return analysisItems.filter((it) => {
      if (
        selectedProviders.length > 0 &&
        !selectedProviders.includes(it.proveedorGanador)
      )
        return false;
      const lab = it.nombreLaboratorio || it.proveedorGanador;
      if (selectedLabs.length > 0 && !selectedLabs.includes(lab)) return false;
      if (query.trim().length > 0) {
        const q = query.toLowerCase();
        if (
          !`${it.nombreProducto} ${it.codigoBarra} ${it.proveedorGanador} ${lab}`
            .toLowerCase()
            .includes(q)
        )
          return false;
      }
      return true;
    });
  }, [analysisItems, selectedProviders, selectedLabs, query]);

  const handleExport = () => {
    exportAnalysisToExcel(
      filtered,
      `reporte_mejor_precio_${filtered.length || "0"}.xlsx`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow sm:p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Reportes
            </p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <h2 className="mt-1 font-['Manrope'] text-xl font-extrabold text-slate-900">
                Generar y exportar reportes
              </h2>
              <p className="text-sm font-extrabold text-green-700">
                Score {filtered.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ComboBox
              label="Proveedor"
              options={providers}
              selected={selectedProviders}
              onChange={setSelectedProviders}
              placeholder="Todos los proveedores"
            />

            <ComboBox
              label="Laboratorio"
              options={labs}
              selected={selectedLabs}
              onChange={setSelectedLabs}
              placeholder="Todos los laboratorios"
            />

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Busqueda
              </p>
              <input
                placeholder="Producto, proveedor o codigo"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedProviders([]);
                  setSelectedLabs([]);
                  setQuery("");
                }}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Exportar Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-4xl border border-slate-200/80 bg-white/75 p-4 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-['Manrope'] text-lg font-extrabold text-slate-900">
              Vista previa de datos
            </h3>
            <p className="text-xs text-slate-500">
              Se muestran hasta 100 filas de la consulta.
            </p>
          </div>
          <div className="inline-flex items-center gap-3">
            <button
              onClick={() => exportAnalysisToExcel(filtered)}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white inline-flex items-center gap-2"
            >
              <MaterialSymbol name="download" /> Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-175 table-fixed border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-bold uppercase text-slate-500">
                  Código
                </th>
                <th className="w-1/4 px-3 py-2 text-left text-xs font-bold uppercase text-slate-500">
                  Producto
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold uppercase text-slate-500">
                  Proveedor
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold uppercase text-slate-500">
                  Laboratorio
                </th>
                <th className="px-3 py-2 text-right text-xs font-bold uppercase text-slate-500">
                  Precio
                </th>
                <th className="px-3 py-2 text-xs font-bold uppercase text-slate-500 text-center">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((row, i) => (
                <tr key={`${row.codigoBarra}-${i}`}>
                  <td className="border-y border-slate-200 bg-white text-center py-2 text-sm text-slate-700">
                    {row.codigoBarra}
                  </td>
                  <td className="overflow-hidden border-y border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900">
                    {row.nombreProducto}
                  </td>
                  <td className="border-y border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                    {row.proveedorGanador}
                  </td>
                  <td className="border-y border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                    {row.nombreLaboratorio || row.proveedorGanador}
                  </td>
                  <td className="border-y border-slate-200 bg-white px-3 py-3 text-right text-sm font-bold text-emerald-700">
                    {typeof row.mejorPrecio === "number"
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(row.mejorPrecio)
                      : "-"}
                  </td>
                  <td className="border-y border-slate-200 bg-white px-3 py-3 text-center text-sm">
                    {typeof row.unidadesDisponibles === "number"
                      ? row.unidadesDisponibles
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
