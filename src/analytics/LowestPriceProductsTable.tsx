import { useMemo } from 'react'
import { useDashboardStore } from '../store/dashboardStore'

type LowestPriceRow = {
	nombreProducto: string
	proveedor: string
	nombreLaboratorio: string
	precioUnitario: number
}

const currency = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

const LowestPriceProductsTable = () => {
	const analysisItems = useDashboardStore((state) => state.analysisItems)

	const topRows = useMemo<LowestPriceRow[]>(() => {
		// La API ya devuelve el mejor registro por producto, asi que solo ordenamos y deduplicamos por codigo_barra.
		const bestByProduct = new Map<string, LowestPriceRow>()

		analysisItems.forEach((item) => {
			const productKey = `${item.codigoBarra}::${item.nombreProducto}`
			const candidate: LowestPriceRow = {
				nombreProducto: item.nombreProducto,
				proveedor: item.proveedorGanador,
				nombreLaboratorio: item.nombreLaboratorio || item.proveedorGanador,
				precioUnitario: item.mejorPrecio,
			}

			const current = bestByProduct.get(productKey)

			if (!current) {
				bestByProduct.set(productKey, candidate)
				return
			}

			if (candidate.precioUnitario < current.precioUnitario) {
				bestByProduct.set(productKey, candidate)
				return
			}

			// Desempate estable por nombre de laboratorio cuando el precio es igual.
			if (
				candidate.precioUnitario === current.precioUnitario
				&& candidate.nombreLaboratorio.localeCompare(current.nombreLaboratorio) < 0
			) {
				bestByProduct.set(productKey, candidate)
			}
		})

		// Orden final ascendente por precio para mostrar top 10 productos mas economicos.
		return Array.from(bestByProduct.values())
			.sort((a, b) => a.precioUnitario - b.precioUnitario)
			.slice(0, 10)
	}, [analysisItems])

	return (
		<section className="mx-auto sm:overflow-hidden rounded-4xl border border-slate-200/80 bg-white/75 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.05)] backdrop-blur sm:p-8">
			<div className="mb-5">
				<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tabla de precios</p>
				<h3 className="mt-2 font-['Manrope'] text-xl font-extrabold text-slate-900 sm:text-2xl">
					Top 10 productos con menor precio
				</h3>
				{/* Mensaje de ayuda para enfatizar scroll horizontal en móvil. */}
				<p className="mt-2 text-xs text-slate-500 sm:hidden">
					Desliza horizontalmente para ver todas las columnas.
				</p>
			</div>

			{topRows.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-500">
					Carga y analiza un archivo para ver la tabla de productos mas economicos.
				</div>
			) : (
				<div className="relative">
					{/* Scroll interno mobile-first: la tabla se desplaza, la página no. */}
					<div className="pb-2 [scrollbar-gutter:stable] [touch-action:pan-x] overflow-x-auto">
						<table className="border-separate border-spacing-y-2 sm:min-w-full">
							<thead>
								<tr>
									<th className="w-12 px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Item</th>
									<th className="w-64 px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Nombre del producto</th>
									<th className="w-32 px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Proveedor</th>
                                    <th className="w-32 px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Laboratorio</th>
									<th className="w-32 px-3 py-2 text-right text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Precio unitario</th>
								</tr>
							</thead>
							<tbody>
								{topRows.map((row, index) => (
									<tr key={`${row.nombreProducto}-${row.proveedor}-${row.nombreLaboratorio}-${row.precioUnitario}`}>
										<td className="rounded-l-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700">
											{index + 1}
										</td>
										<td className="whitespace-nowrap md:whitespace-pre-wrap border-y border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900">
											{row.nombreProducto}
										</td>
										<td className="w-28 border-y border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
											{row.proveedor}
										</td>
										<td className="w-32 border-y border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
											{row.nombreLaboratorio}
										</td>
										<td className="rounded-r-xl border border-slate-200 bg-white px-3 py-3 text-right text-sm font-bold text-emerald-700">
											{currency.format(row.precioUnitario)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Sombra lateral para indicar contenido desplazable en eje X. */}
					{/* <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white/90 to-transparent sm:hidden" /> */}
				</div>
			)}
		</section>
	)
}

export default LowestPriceProductsTable
