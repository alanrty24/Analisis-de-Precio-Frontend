import { useMemo } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
import BarChart from '../components/ui/BarChart'
import ChartCard from '../components/ui/ChartCard'
import { useDashboardStore } from '../store/dashboardStore'

const PriceComparisonBarChart = () => {
  const analysisItems = useDashboardStore((state) => state.analysisItems)

  const chartData = useMemo<ChartData<'bar'>>(() => {
    const minPriceByProduct = new Map<string, number>()

    analysisItems.forEach((item) => {
      const key = item.nombreProducto
      const previous = minPriceByProduct.get(key)

      if (previous === undefined || item.precioUnitario < previous) {
        minPriceByProduct.set(key, item.precioUnitario)
      }
    })

    const topProducts = Array.from(minPriceByProduct.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, 7)

    return {
      labels: topProducts.map(([name]) => name.slice(0, 20)),
      datasets: [
        {
          label: 'Precio unitario minimo',
          data: topProducts.map(([, price]) => price),
          backgroundColor: 'rgba(15, 118, 110, 0.75)',
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    }
  }, [analysisItems])

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569',
          maxRotation: 40,
          minRotation: 20,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#64748b',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.22)',
        },
      },
    },
  }

  return (
    <ChartCard
      title="Grafico de barras"
      subtitle="Productos con menor precio unitario"
    >
      <BarChart data={chartData} options={options} />
    </ChartCard>
  )
}

export default PriceComparisonBarChart