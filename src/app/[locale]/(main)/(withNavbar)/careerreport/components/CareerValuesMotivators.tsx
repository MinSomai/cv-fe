import { KeyInsightCard, MetricsGrid, EmotionalAnalysis } from '@/app/[locale]/(main)/(withNavbar)/interviewreport/components';
import { FileText, Handshake, Wrench, Feather, LineChartIcon } from 'lucide-react';

interface CareerValuesMotivatorProps {
  data: {
    description: string;
    metrics?: {
      careerDecisionsAreDrivenBy: {
        overallScore: number;
        positiveImpactOnOthers?: number;
        workLifeBalance?: number;
        continuousLearning?: number;
        professionalRecognition?: number;
        financialRewards?: number;
        // Other properties as needed
      };
    };
    careerDecisions?: Array<{ title: string; value: number }>;
    primaryMotivators: string[];
    practicalApplications: string[];
    idealOrganizationalCultures: string;
    emotionalAnalysis: {
      values: number[];
    };
  };
}

export function CareerValuesMotivators({ data }: CareerValuesMotivatorProps) {
  // Use the metrics object if available, otherwise convert from the old careerDecisions format
  const metricsData = data.metrics || (data.careerDecisions ? {
    careerDecisionsAreDrivenBy: {
      overallScore: Math.round(
        data.careerDecisions.reduce((sum, item) => sum + item.value, 0) / data.careerDecisions.length
      ),
      ...Object.fromEntries(
        data.careerDecisions.map(item => [
          item.title.toLowerCase().replace(/\s(.)/g, (_, char) => char.toUpperCase()).replace(/\s/g, '').replace(/[^a-z0-9]/gi, ''),
          item.value
        ])
      )
    }
  } : {});

  const Icon = LineChartIcon;
  const iconStyle = { color: '#465ff1' };

  return (
    <div>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>Career Values & Motivators</h2>
      </div>

      <div className='grid grid-cols-3 gap-6 '>
        <div className='flex flex-col p-6 border border-gray-200 rounded-2xl'>
          <h3 className='mb-2 font-semibold flex'>
            <Icon size={24} style={iconStyle} className='mr-3' /> Career Values Radar
          </h3>
          <EmotionalAnalysis values={data.emotionalAnalysis.values} />
        </div>

        <div className='col-span-2 space-y-6'>
          <KeyInsightCard className='!h-fit' icon={FileText} title='Description' description={data.description} />

          <div className='grid grid-cols-2 gap-6'>
            <div>
              <MetricsGrid metrics={metricsData} isTyped={true} />
            </div>

            <div>
              <KeyInsightCard
                icon={Feather}
                title='Primary Motivators'
                description={data.primaryMotivators.join('\n')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-3 gap-6'>
        <KeyInsightCard
          icon={Wrench}
          title='Practical Applications'
          description={data.practicalApplications.join('\n')}
          className='col-span-2'
        />

        <KeyInsightCard
          icon={Handshake}
          title='Ideal Organizational Cultures'
          description={data.idealOrganizationalCultures}
        />
      </div>
    </div>
  );
}
