'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function AnxietyOverviewChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#667085',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#eaecf0',
        },
        ticks: {
          color: '#667085',
          font: {
            size: 12,
          },
        },
        min: 0,
        max: 100,
      },
    },
  };

  const data = {
    labels: ['0:00', '0:50', '1:00', '1:50', '2:00', '2:50', '3:00'],
    datasets: [
      {
        fill: true,
        data: [20, 40, 30, 70, 50, 60, 40],
        borderColor: '#465ff1',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(70, 95, 241, 0.2)');
          gradient.addColorStop(1, 'rgba(70, 95, 241, 0)');
          return gradient;
        },
      },
    ],
  };

  return <Line options={options} data={data} />;
}
