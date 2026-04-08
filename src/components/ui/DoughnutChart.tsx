import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type DoughnutChartProps = {
  data: ChartData<'doughnut'>
  options?: ChartOptions<'doughnut'>
}

const DoughnutChart = ({ data, options }: DoughnutChartProps) => {
  return <Doughnut data={data} options={options} />
}

export default DoughnutChart