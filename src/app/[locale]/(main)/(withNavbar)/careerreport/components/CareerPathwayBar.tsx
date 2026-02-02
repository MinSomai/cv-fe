interface CareerPathwayBarProps {
  title: string;
  percentage: number;
}

export function CareerPathwayBar({ title, percentage }: CareerPathwayBarProps) {
  return (
    <div className='mb-4'>
      <div className='bg-[#dfe4ff] text-[#465ff1] rounded-lg p-3 font-medium' style={{ width: `${percentage}%` }}>
        {title} ({percentage}%)
      </div>
    </div>
  );
}
