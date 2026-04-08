import { useMemo } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
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
    () => Math.max(...bubbleItems.map((item) => item.accumulatedSavings), 1),
    [bubbleItems],
  )

  const chartData = useMemo<ChartData<'bubble'>>(() => {
    return {
      datasets: [
        {
          label: 'Laboratorios',
          data: bubbleItems.map((item) => ({
            // Eje X: cantidad de productos donde el laboratorio gana por menor precio.
            x: item.winningProducts,
            // Eje Y: precio promedio de esos productos ganadores.
            y: Number(item.averageWinningPrice.toFixed(2)),
            // Radio: ahorro acumulado relativo para destacar impacto economico.
            r: 8 + Math.round((item.accumulatedSavings / maxSavings) * 18),
            nombreLaboratorio: item.nombreLaboratorio,
            accumulatedSavings: item.accumulatedSavings,
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
          label: (context) => {
            const rawPoint = context.raw as {
              x: number
              y: number
              r: number
              nombreLaboratorio?: string
              accumulatedSavings?: number
            }

            const ahorro = rawPoint.accumulatedSavings ?? 0
            const nombreLaboratorio = rawPoint.nombreLaboratorio ?? 'Laboratorio'

            return `${nombreLaboratorio}: ${rawPoint.x} productos, precio prom. $${rawPoint.y.toFixed(2)}, ahorro $${ahorro.toFixed(2)}`
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