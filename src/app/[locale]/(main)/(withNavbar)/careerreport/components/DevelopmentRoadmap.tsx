import { KeyInsightCard } from '@/app/[locale]/(main)/(withNavbar)/interviewreport/components';
import { Target, CheckCircle2, Heart } from 'lucide-react';
import { DevelopmentTimeline } from './DevelopmentTimeline';

interface DevelopmentRoadmapProps {
  data: {
    phases: Array<{
      title: string;
      duration: string;
      focusAreas: string[];
      expectedOutcomes: string[];
    }>;
    personalAspirationsAlignment: string;
  };
}

export function DevelopmentRoadmap({ data }: DevelopmentRoadmapProps) {
  // Convert duration strings to month numbers
  const timelinePhases = data.phases.map((phase) => {
    const monthMatch = phase.duration.match(/Months (\d+)-(\d+)/);
    return {
      title: phase.title.toUpperCase(),
      month: monthMatch ? Number.parseInt(monthMatch[1]) : 0,
    };
  });

  return (
    <div className='gap-4 flex flex-col'>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>Development Roadmap</h2>
      </div>

      <DevelopmentTimeline phases={timelinePhases} totalMonths={9} />

      {data.phases.map((phase, index) => (
        <div key={index}>
          <h3 className='text-xl font-semibold mb-4'>
            PHASE {index + 1}: {phase.title.toUpperCase()} ({phase.duration})
          </h3>

          <div className='grid grid-cols-2 gap-6'>
            <KeyInsightCard icon={Target} title='Focus Areas' description={phase.focusAreas.join('\n')} />

            <KeyInsightCard
              icon={CheckCircle2}
              title='Expected Outcomes'
              description={phase.expectedOutcomes.join('\n')}
            />
          </div>
        </div>
      ))}

      <div className='mt-6'>
        <KeyInsightCard
          icon={Heart}
          title='Personal Aspirations Alignment'
          description={data.personalAspirationsAlignment}
        />
      </div>
    </div>
  );
}
