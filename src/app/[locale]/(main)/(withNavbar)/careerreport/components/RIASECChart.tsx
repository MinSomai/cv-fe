import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import React, { useRef } from 'react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RIASECChartProps {
  values: number[];
  labels?: string[];
}

export function RIASECChart({
  values,
  labels = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
}: RIASECChartProps) {
  const chartRef = useRef<any>(null);

  // Calculate normalized point sizes based on their values
  const baseSize = 3;
  const maxSize = 8;
  const maxValue = Math.max(...values);
  const pointSizes = values.map((value) => baseSize + (value / maxValue) * (maxSize - baseSize));

  // Create a background dataset for the hexagon
  const backgroundDataset = {
    label: 'Background',
    data: Array(6).fill(100), // Fixed at max radius (100%)
    fill: true,
    backgroundColor: 'rgba(240, 240, 240, 0.25)', // Semi-transparent light gray background (#F0F0F0)
    borderColor: 'rgba(0, 0, 0, 0)', // Transparent border
    borderWidth: 0,
    pointRadius: 0,
    pointHoverRadius: 0,
  };

  // Create the outer boundary dataset
  const outerBoundaryDataset = {
    label: 'Outer Boundary',
    data: Array(6).fill(100), // Fixed at max radius (100%)
    fill: false,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    pointRadius: 0,
    pointHoverRadius: 0,
  };

  // Create the boundary dataset that connects the furthest points
  const boundaryDataset = {
    label: 'Data Boundary',
    data: values,
    backgroundColor: 'rgba(196, 214, 235, 0.5)', // Semi-transparent light blue
    borderColor: '#465ff1',
    borderWidth: 3,
    pointRadius: 0, // Hide points for this dataset
    pointHoverRadius: 0,
    fill: true,
  };

  // Create the points dataset without connections
  const pointsDataset = {
    label: 'Data Points',
    data: values,
    backgroundColor: '#465ff1',
    borderColor: '#fff',
    borderWidth: 1,
    pointBackgroundColor: '#465ff1',
    pointBorderColor: '#fff',
    pointBorderWidth: 1,
    pointRadius: pointSizes,
    pointHoverRadius: (ctx: any) => pointSizes[ctx.dataIndex] + 2,
    fill: false,
    showLine: false, // Don't connect points with lines
  };

  const data = {
    labels: labels,
    datasets: [
      // Background layer (drawn first)
      backgroundDataset,
      // Outer boundary
      outerBoundaryDataset,
      // RIASEC Boundary (the hexagonal shape)
      boundaryDataset,
      // RIASEC Points (individual points)
      pointsDataset,
    ],
  };

  const options = {
    elements: {
      line: {
        tension: 0, // Straight lines
      },
    },
    scales: {
      r: {
        grid: {
          display: false, // Hide circular grid lines
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)', // Gray angle lines
          lineWidth: 1,
          z: 10, // Try to ensure angle lines are drawn on top
        },
        pointLabels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          color: 'rgba(71, 84, 103, 1)',
        },
        ticks: {
          display: false, // Hide tick values
        },
        suggestedMin: 0,
        suggestedMax: 100, // Ensure we can see the outer boundary at 100%
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            // Only show tooltips for the data points, not the backgrounds or boundaries
            if (context.datasetIndex === 3) {
              return `${context.label}: ${context.raw}`;
            }
            return '';
          },
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#465ff1',
        bodyColor: 'rgba(71, 84, 103, 1)',
        borderColor: '#465ff1',
        borderWidth: 1,
        bodyFont: {
          family: 'Inter, sans-serif',
        },
        padding: 10,
        displayColors: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className='w-full h-80'>
      <Radar ref={chartRef} data={data} options={options} />
    </div>
  );
}
