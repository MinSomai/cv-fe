import { KeyInsightCard, MetricsGrid } from '@/app/[locale]/(main)/(withNavbar)/interviewreport/components';
import { MessageCircleQuestionIcon, Building2 } from 'lucide-react';

interface WorkEnvironmentPreferencesProps {
  data: {
    metrics?: {
      environmentAlignment: {
        overallScore: number;
        hybridFlexibleWorkArrangements?: number;
        collaborativeTeamSettings?: number;
        autonomousDecisionAuthority?: number;
        dynamicAdaptiveCulture?: number;
        structuredProcessFramework?: number;
        // Other properties as needed
      };
    };
    environmentAlignment?: Array<{ factor: string; value: number }>;
    whyThisMatters: string;
    bestFitOrganizations: string;
  };
}

export function WorkEnvironmentPreferences({ data }: WorkEnvironmentPreferencesProps) {
  // Use the metrics object if available, otherwise convert from the old environmentAlignment format
  const metricsData = data.metrics || (data.environmentAlignment ? {
    environmentAlignment: {
      overallScore: Math.round(
        data.environmentAlignment.reduce((sum, item) => sum + item.value, 0) / data.environmentAlignment.length
      ),
      ...Object.fromEntries(
        data.environmentAlignment.map(item => [
          item.factor.toLowerCase().replace(/\s(.)/g, (_, char) => char.toUpperCase()).replace(/\s/g, '').replace(/[^a-z0-9]/gi, ''),
          item.value
        ])
      )
    }
  } : {});

  return (
    <div>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>Work Environment Preferences</h2>
      </div>

      <div className='grid grid-cols-3 gap-6'>
        <div className='col-span-1'>
          <MetricsGrid metrics={metricsData} />
        </div>

        <div className='col-span-1 flex'>
          <KeyInsightCard icon={MessageCircleQuestionIcon} title='Why This Matters' description={data.whyThisMatters} />
        </div>

        <div className='col-span-1 flex'>
          <KeyInsightCard icon={Building2} title='Best-Fit Organizations' description={data.bestFitOrganizations} />
        </div>
      </div>
    </div>
  );
}
