import { useMemo } from 'react'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import BubbleChart from '../components/ui/BubbleChart'
import ChartCard from '../components/ui/ChartCard'
import { useDashboardStore } from '../store/dashboardStore'
import { buildLaboratoryBubbleData } from './laboratoryBubble.logic'

const bubblePalette = [
  'rgba(16, 185, 129, 0.60)',
  'rgba(6, 182, 212, 0.60)',
  'rgba(59, 130, 246, 0.60)',
  'rgba(234, 88, 12, 0.60)',
  'rgba(168, 85, 247, 0.60)',
  'rgba(244, 63, 94, 0.60)',
]

const LaboratoryBubbleChart = () => {
  const analysisItems = useDashboardStore((state) => state.analysisItems)

  const bubbleItems = useMemo(
    () => buildLaboratoryBubbleData(analysisItems).slice(0, 10),
    [analysisItems],
  )

  const maxSavings = useMemo(
    // Usamos unidades disponibles para escalar el radio y reflejar peso operativo.
    () => Math.max(...bubbleItems.map((item) => item.totalUnitsAvailable), 1),
    [bubbleItems],
  )

  const chartData = useMemo<ChartData<'bubble'>>(() => {
    return {
      datasets: [
        {
          label: 'Top 10 laboratorios',
          data: bubbleItems.map((item) => ({
            // Eje X: cantidad de productos donde el laboratorio gana por menor precio.
            x: item.winningProducts,
            // Eje Y: precio promedio de esos productos ganadores.
            y: Number(item.averageWinningPrice.toFixed(2)),
            // Radio: volumen disponible relativo para destacar impacto operativo.
            r: 8 + Math.round((item.totalUnitsAvailable / maxSavings) * 18),
            nombreLaboratorio: item.nombreLaboratorio,
            totalUnitsAvailable: item.totalUnitsAvailable,
          })),
          backgroundColor: bubbleItems.map((_, index) => bubblePalette[index % bubblePalette.length]),
          borderColor: bubbleItems.map((_, index) => bubblePalette[index % bubblePalette.length].replace('0.60', '1')),
          borderWidth: 1,
        },
      ],
    }
  }, [bubbleItems, maxSavings])

  const options: ChartOptions<'bubble'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'bubble'>[]) => {
            // Show laboratorio name as title when hovering a point
            const raw = items[0]?.raw as { nombreLaboratorio?: string } | undefined
            return raw?.nombreLaboratorio ?? 'Laboratorio'
          },
          label: (context: TooltipItem<'bubble'>) => {
            const rawPoint = context.raw as {
              x: number
              y: number
              r: number
              nombreLaboratorio?: string
              totalUnitsAvailable?: number
            }

            const unidades = rawPoint.totalUnitsAvailable ?? 0
            const productos = rawPoint.x ?? 0

            return `Productos: ${productos} · Precio prom.: ${rawPoint.y.toFixed(2)} · Unidades: ${unidades}`
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Productos con menor precio',
          color: '#334155',
          font: {
            size: 12,
            weight: 700,
          },
        },
        ticks: {
          color: '#475569',
          precision: 0,
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.18)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Precio promedio ganador (USD)',
          color: '#334155',
          font: {
            size: 12,
            weight: 700,
          },
        },
        ticks: {
          color: '#475569',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.18)',
        },
      },
    },
  }

  if (bubbleItems.length === 0) {
    return (
      <ChartCard
        title="Bubble chart"
        subtitle="Analisis por laboratorio"
      >
        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center text-slate-500">
          Carga y analiza un archivo para visualizar que laboratorio gana mas productos con menor precio.
        </div>
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Bubble chart"
      subtitle="Laboratorios ganadores por menor precio"
    >
      <BubbleChart data={chartData} options={options} />
    </ChartCard>
  )
}

export default LaboratoryBubbleChart