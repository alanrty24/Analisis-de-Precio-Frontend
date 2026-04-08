import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type BarChartProps = {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
}

const BarChart = ({ data, options }: BarChartProps) => {
  return <Bar data={data} options={options} />
}

export default BarChart