'use client';

import { useEffect, useRef } from 'react';
import { AgCharts } from 'ag-charts-community';

interface AnswerScoresProps {
  detailedQuestions: any[];
}

export default function AnswerScores({ detailedQuestions }: AnswerScoresProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const data = detailedQuestions.map((dQuestion, index) => ({
        question: `Q-${index + 1}`,
        score: dQuestion.analyzedData.score,
      }));

      AgCharts.create({
        container: chartRef.current,
        data,
        series: [
          {
            type: 'bar',
            xKey: 'question',
            yKey: 'score',
            fill: '#465ff1',
            cornerRadius: 4,
          },
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              enabled: false,
            },
            label: {
              fontSize: 12,
              color: '#667085',
            },
          },
          {
            type: 'number',
            position: 'left',
            title: {
              enabled: false,
            },
            label: {
              fontSize: 12,
              color: '#667085',
            },
            min: 0,
            max: 100,
          },
        ],
        background: {
          fill: 'transparent',
        },
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 40,
        },
      });
    }
  }, [detailedQuestions]);

  return <div ref={chartRef} className='h-64 w-full' />;
}
