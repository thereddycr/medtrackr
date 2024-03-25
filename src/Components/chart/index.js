import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Doughnut,PolarArea,Pie } from 'react-chartjs-2';



ChartJS.register(ArcElement,RadialLinearScale, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' ,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  return <Bar data={data} options={options} />;
};
export const PolarAreaChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' ,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  return <PolarArea data={data} options={options} />;
};
export const PieChart = ({ data }) => {
  return <Pie data={data} />;
};
export const DoughnutChart = ({ data }) => {
  return <Doughnut data={data} />;
};

