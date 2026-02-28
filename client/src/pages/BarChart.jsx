import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart(props) {
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: props.data_title, 
        data: props.data,
        backgroundColor: " rgb(120, 170, 230)"
      }
    ]
  };


  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: '#bccce2'
        },
        grid: {
          color: '#ffffff1a'
        }
      },
      x: {
        ticks: {
          color: '#bccce2'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1'
        },
      },
      title: {
        display: true,
        text: props.title,
        color: '#ffffff'
      },
      }
  };

  return <Bar key={JSON.stringify(props.data)} data={data} options={options} />;
}

export default BarChart;
