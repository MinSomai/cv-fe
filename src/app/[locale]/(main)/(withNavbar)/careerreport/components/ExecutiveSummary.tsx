import { MetricsGrid, KeyInsightCard } from '@/app/[locale]/(main)/(withNavbar)/interviewreport/components';
import { Clock, CalendarClock, FileText, Verified, ThumbsUp, Calendar } from 'lucide-react';
import { IconList } from '@/components/IconList';
import { RIASECChart } from './RIASECChart';

interface ExecutiveSummaryProps {
  data: {
    description: string;
    metrics?: {
      careerPathwaysMatch: {
        overallScore: number;
        organizationalDevelopmentConsultant?: number;
        learningDevelopmentManager?: number;
        hrBusinessPartner?: number;
      };
    };
    careerPathways?: Array<{
      category: string;
      score?: number;
      items: Array<{
        label: string;
        value: number;
      }>;
    }>;
    priorityDevelopmentAreas: string[];
    longTermTrajectory: string;
    estimatedTransitionTimeline: string;
    // emotionalAnalysis: {
    //   values: number[];
    // };
    riasecProfile?: {
      values: number[];
    };
  };
}

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  // Sample RIASEC data for demonstration
  const sampleRIASECData = [65, 80, 45, 90, 75, 50]; // R, I, A, S, E, C values

  // Use provided RIASEC data or sample data if not available
  const riasecValues = data.riasecProfile?.values || sampleRIASECData;

  // Extract titles from priorityDevelopmentAreas for IconList
  const priorityAreaTitles = data.priorityDevelopmentAreas;

  // Use the metrics object if available, otherwise use the old careerPathways format
  const metricsData =
    data.metrics ||
    (data.careerPathways
      ? {
          careerPathwaysMatch: {
            overallScore: 65,
            ...Object.fromEntries(
              data.careerPathways.flatMap((pathway) =>
                pathway.items.map((item) => [
                  item.label
                    .toLowerCase()
                    .replace(/\s(.)/g, (_, char) => char.toUpperCase())
                    .replace(/\s/g, '')
                    .replace(/[^a-z0-9]/gi, ''),
                  item.value,
                ])
              )
            ),
          },
        }
      : {});

  return (
    <div>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>Executive Summary</h2>
      </div>

      <div className='grid grid-cols-3 gap-6 mb-6'>
        <div className='col-span-1'>
          <div className='border border-gray-200 rounded-2xl bg-white p-4'>
            <h3 className='text-lg font-semibold text-[#344054] mb-2'>RIASEC Profile</h3>
            <RIASECChart values={riasecValues} />
          </div>
        </div>

        <div className='col-span-2 space-y-6'>
          <KeyInsightCard className='!h-fit' icon={FileText} title='Description' description={data.description} />

          <div className='grid grid-cols-2 gap-6'>
            <div className='flex'>
              <MetricsGrid metrics={metricsData} className='w-full' />
            </div>

            <div>
              <IconList
                headerIcon={Verified}
                itemIcon={ThumbsUp}
                className='!h-full'
                title='Priority Development Areas'
                items={priorityAreaTitles}
                color='#039855'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-6'>
        <div className='col-span-2'>
          <KeyInsightCard icon={CalendarClock} title='Long-Term Trajectory' description={data.longTermTrajectory} />
        </div>

        <div className='col-span-1'>
          <KeyInsightCard
            icon={Calendar}
            title='Estimated Transition Timeline'
            description={data.estimatedTransitionTimeline}
          />
        </div>
      </div>
    </div>
  );
}
