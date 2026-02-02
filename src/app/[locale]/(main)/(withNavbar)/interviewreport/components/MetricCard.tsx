import { Card, CardContent, CardHeader, CardTitle } from '@/components/ContentCard/ContentCard';
import type { LucideIcon } from 'lucide-react';

interface MetricValue {
  label: string;
  value: string;
}

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  score: number;
  items: MetricValue[];
  className?: string;
}

function MetricChip({ value }: { value: string }) {
  const numericValue = Number.parseInt(value);
  const isPositiveOrLow = value === 'Positive' || value === 'Low' || value === 'Neutral';
  const isNumeric = !isNaN(numericValue);

  let bgColor = 'bg-gray-100';
  let textColor = 'text-[#344054]';

  if (isPositiveOrLow) {
    bgColor = 'bg-[#ecfdf3]';
    textColor = 'text-[#039855]';
  } else if (isNumeric) {
    if (numericValue < 50) {
      bgColor = 'bg-[#fef3f2]';
      textColor = 'text-[#b42318]';
    } else if (numericValue === 50) {
      bgColor = 'bg-[#fffaeb]';
      textColor = 'text-[#b54708]';
    } else {
      bgColor = 'bg-[#ecfdf3]';
      textColor = 'text-[#039855]';
    }
  }

  return <span className={`rounded-full ${bgColor} ${textColor} px-2 py-1 text-sm font-medium`}>{value}</span>;
}

export default function MetricCard({ title, icon: Icon, score, items, className }: MetricCardProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center gap-4 pb-2'>
        <Icon className='h-5 w-5 text-[#465ff1]' />
        <div className='flex flex-1 items-center justify-between'>
          <CardTitle className='text-lg font-semibold text-[#344054]'>{title}</CardTitle>
          <MetricChip value={`${score}%`} />
        </div>
      </CardHeader>
      <CardContent className='pt-2'>
        <div className='space-y-3'>
          {items.map((item) => (
            <div key={item.label} className='flex items-center justify-between'>
              <span className='text-sm text-[#667085]'>{item.label}</span>
              <MetricChip value={item.value} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
