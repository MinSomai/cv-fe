'use client';

import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface EmotionalAnalysisProps {
  values: any;
  showPoints?: boolean;
  showBackground?: boolean;
}

export default function EmotionalAnalysis({
  values,
  showPoints = false,
  showBackground = false,
}: EmotionalAnalysisProps) {
  const data = {
    labels: Object.keys(values),
    datasets: [
      {
        label: 'Emotional Analysis',
        data: Object.keys(values).map((key) => values[key]),
        backgroundColor: showBackground ? 'rgba(79, 70, 229, 0.2)' : 'rgba(0, 0, 0, 0)',
        borderColor: '#465ff1',
        borderWidth: 2,
        pointBackgroundColor: '#465ff1',
        pointBorderColor: '#fff',
        pointRadius: showPoints ? 6 : 0,
        pointHoverRadius: showPoints ? 8 : 0,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#465ff1',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 1,
        ticks: {
          stepSize: 0.2,
          display: false,
        },
        pointLabels: {
          font: {
            size: 12,
          },
          color: 'rgb(102, 112, 133)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: showPoints,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className='h-64 my-auto'>
      <Radar data={data} options={options} />
    </div>
  );
}
