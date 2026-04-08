import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Bubble } from 'react-chartjs-2'

// Registro de elementos requeridos por Chart.js para el grafico bubble.
ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

type BubbleChartProps = {
  data: ChartData<'bubble'>
  options?: ChartOptions<'bubble'>
}

const BubbleChart = ({ data, options }: BubbleChartProps) => {
  return <Bubble data={data} options={options} />
}

export default BubbleChart