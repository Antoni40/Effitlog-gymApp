import React from "react";

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
    console.log(props.data)
    console.log(props.labels);
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: "workouts in weeks",
        data: props.data,
        backgroundColor: "rgb(121, 121, 121)"
      }
    ]
  };


  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Gym progress"
      }
    }
  };

  return <Bar data={data} options={options} />;
}

export default BarChart;
