import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import { AgCartesianChartOptions } from "ag-charts-community";

interface ChartData {
  month: string;
  avgscore: number;
}

export default function Chart({ data }: { data: ChartData[] }) {
  const [options, setOptions] = useState<AgCartesianChartOptions>({
    data: data,
    series: [
      {
        type: "area",
        xKey: data.length > 0 ? Object.keys(data[0])[0] : "",
        xName: "Period",
        yKey: "avgscore",
        yName: "Avg Score",
        stroke: "#465ff1",
        strokeWidth: 3,
        marker: {
          enabled: true,
          fill: "#465ff1",
          size: 8,
        },
        interpolation: { type: "smooth" },
        fillOpacity: 0.05,
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
      },
      {
        type: "number",
        position: "left",
        min: 0,
        // label: {
        //   formatter: (params) => {
        //     return `${params.value}%`;
        //   },
        // },
        label: {
          formatter: () => "",
        },
        interval: {
          step: 20,
        },
      },
    ],
  });

  // 🔁 Update the options whenever data changes
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      data: data,
      series: [
        {
          type: "area",
          xKey: data.length > 0 ? Object.keys(data[0])[0] : "",
          xName: "Period",
          yKey: "avgscore",
          yName: "Avg Score",
          stroke: "#465ff1",
          strokeWidth: 3,
          marker: {
            enabled: true,
            fill: "#465ff1",
            size: 8,
          },
          interpolation: { type: "smooth" },
          fillOpacity: 0.05,
        },
      ],
    }));
  }, [data]);

  return <AgCharts options={options} />;
}
