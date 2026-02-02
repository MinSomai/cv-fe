interface TimelinePhase {
  title: string;
  month: number;
}

interface DevelopmentTimelineProps {
  phases: TimelinePhase[];
  totalMonths: number;
}

export function DevelopmentTimeline({ phases, totalMonths }: DevelopmentTimelineProps) {
  return (
    <div className='border border-gray-200 rounded-2xl p-5'>
      <div className='flex justify-between mb-2 gap-3'>
        {phases.map((phase, index) => (
          <div
            key={index}
            className='bg-[#dfe4ff] text-[#465ff1] rounded-lg p-3 text-center font-medium'
            style={{
              width: `${
                index < phases.length - 1
                  ? ((phases[index + 1].month - phase.month) / totalMonths) * 100
                  : ((totalMonths - phase.month) / totalMonths) * 100
              }%`,
            }}>
            {phase.title}
          </div>
        ))}
      </div>

      <div className='relative pt-6 pb-12'>
        <div className='absolute top-6 left-0 right-0 h-0.5 bg-[#dfe4ff]'></div>

        {phases.map((phase, index) => (
          <div
            key={index}
            className='absolute top-4 flex flex-col items-center'
            style={{ left: `${(phase.month / totalMonths) * 100 - (index !== 0 ? 2.5 : 0)}%` }}>
            <div className='w-4 h-4 bg-[#465ff1] rounded-full'></div>
            <div className='mt-2 text-gray-600 whitespace-nowrap'>Month {phase.month}</div>
          </div>
        ))}

        {/* Add the final month marker */}
        <div className='absolute top-4 flex flex-col items-center' style={{ left: '95%' }}>
          <div className='w-4 h-4 bg-[#465ff1] rounded-full'></div>
          <div className='mt-2 text-gray-600 whitespace-nowrap'>Month {totalMonths}</div>
        </div>
      </div>
    </div>
  );
}
