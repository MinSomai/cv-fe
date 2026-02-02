interface Opportunity {
  text: string;
  timeframe: string;
}

interface GrowthOpportunitiesProps {
  opportunities: Opportunity[];
}

export function GrowthOpportunities({ opportunities }: GrowthOpportunitiesProps) {
  return (
    <div>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>GROWTH OPPORTUNITIES</h2>
      </div>

      <div className='grid grid-cols-3 gap-6'>
        {opportunities.map((opportunity, index) => (
          <div key={index} className='border border-gray-200 rounded-2xl p-4'>
            <div className='flex items-start gap-4 flex-col'>
              <div className='w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center flex-shrink-0'>
                <span className='text-lg font-bold'>{index + 1}</span>
              </div>
              <div>
                <p className='text-lg font-medium'>
                  {opportunity.text} ({opportunity.timeframe})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
