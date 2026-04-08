import { useMemo } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartCard from '../components/ui/ChartCard'
import DoughnutChart from '../components/ui/DoughnutChart'
import { useDashboardStore } from '../store/dashboardStore'

const palette = [
  'rgba(14, 116, 144, 0.82)',
  'rgba(124, 58, 237, 0.78)',
  'rgba(5, 150, 105, 0.78)',
  'rgba(220, 38, 38, 0.75)',
  'rgba(234, 88, 12, 0.75)',
  'rgba(2, 132, 199, 0.75)',
]

const ProviderCoverageDoughnutChart = () => {
  const analysisItems = useDashboardStore((state) => state.analysisItems)

  const chartData = useMemo<ChartData<'doughnut'>>(() => {
    const counts = new Map<string, number>()

    analysisItems.forEach((item) => {
      const current = counts.get(item.nombreProveedor) ?? 0
      counts.set(item.nombreProveedor, current + 1)
    })

    const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])

    return {
      labels: entries.map(([provider]) => provider),
      datasets: [
        {
          label: 'Participacion por proveedor',
          data: entries.map(([, total]) => total),
          backgroundColor: entries.map((_, index) => palette[index % palette.length]),
          borderWidth: 1,
          borderColor: '#f8fafc',
        },
      ],
    }
  }, [analysisItems])

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#475569',
          usePointStyle: true,
          boxWidth: 8,
        },
      },
    },
  }

  return (
    <ChartCard
      title="Grafico de dona"
      subtitle="Cobertura por proveedor"
    >
      <DoughnutChart data={chartData} options={options} />
    </ChartCard>
  )
}

export default ProviderCoverageDoughnutChart