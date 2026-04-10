import { useMemo } from "react";
import MaterialSymbol from "../components/ui/MaterialSymbol";
import { useDashboardStore } from "../store/dashboardStore";
import { computeProviderSavings, computeTopCheapHighStock } from "../lib/kpiMapper";
import ProviderCoverageDoughnutChart from "../dashboard/ProviderCoverageDoughnutChart";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const AnalyticsKpis = () => {
  const analysisItems = useDashboardStore((state) => state.analysisItems);

  const providerSavings = useMemo(
    () => computeProviderSavings(analysisItems),
    [analysisItems],
  );
  const topCheapStock = useMemo(
    () => computeTopCheapHighStock(analysisItems, 5),
    [analysisItems],
  );

  const topSaver = providerSavings[0];
  const providerCount = providerSavings.length;

  return (
    <section className="grid gap-3 grid-cols-1 sm:gap-4 md:grid-cols-2">
      {/* Card 1: % Ahorro por proveedor (muestra el proveedor con mayor ahorro promedio) */}
      <article className="rounded-3xl border border-slate-200/80 bg-white/75 p-4 shadow-[0_16px_48px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <MaterialSymbol name="percent" className="text-[22px]" />
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-bold tracking-[0.16em] bg-emerald-100 text-emerald-700">
            ANALITICA
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-sm font-bold tracking-[0.18em] text-slate-500">
            % AHORRO PROMEDIO POR PROVEEDOR
          </p>
          {topSaver ? (
            <h3 className="font-['Manrope'] text-[clamp(1.15rem,2.4vw,2rem)] font-extrabold leading-tight text-slate-900">
              {topSaver.provider} — {topSaver.savingsPercent.toFixed(1)}%
            </h3>
          ) : (
            <h3 className="font-['Manrope'] text-lg font-extrabold text-slate-900">
              No disponible
            </h3>
          )}

          <p className="text-sm font-semibold text-slate-500">
            {topSaver
              ? `${topSaver.count} productos cubiertos — ${providerCount} proveedores analizados`
              : "Se requieren datos para calcular ahorro por proveedor"}
          </p>
        </div>
      </article>

      {/* Card 2: Mejor proveedor + dona (reusa ProviderCoverageDoughnutChart) */}
      <ProviderCoverageDoughnutChart />

      {/* Card 3: Top 5 productos con menor precio y gran stock */}
      <article className="rounded-3xl md:col-span-2 border border-slate-200/80 bg-white/75 p-4 shadow-[0_16px_48px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <MaterialSymbol name="inventory_2" className="text-[22px]" />
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-bold tracking-[0.16em] bg-rose-100 text-rose-700">
            ALERTA
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-sm font-bold tracking-[0.18em] text-slate-500">
            TOP 5: MENOR PRECIO CON GRAN STOCK
          </p>

          {topCheapStock.length === 0 ? (
            <p className="text-sm text-slate-500">No hay datos suficientes para mostrar productos con gran stock.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {topCheapStock.map((p) => (
                <li key={p.productKey} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{p.productName}</p>
                    <p className="text-xs text-slate-500">{p.provider} · {currency.format(p.price)}</p>
                  </div>
                  <div className="ml-3 text-right">
                    <div className="text-sm font-bold text-emerald-700">{p.units} uds</div>
                    <div className="text-xs text-slate-500">score: {p.score.toFixed(2)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </section>
  );
};

export default AnalyticsKpis;
