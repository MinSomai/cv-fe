import { ThumbsUp, TrendingUp, Sparkles } from 'lucide-react';
import { SkillsMatrix } from './SkillsMatrix';
import { RatingStars } from './RatingStars';

interface SkillsAssessmentProps {
  data: {
    coreStrengths: Array<{ skill: string; rating: number }>;
    emergingStrengths: Array<{ skill: string; rating: number }>;
    developmentPriorities: Array<{ skill: string; rating: number; priority: string; learningPeriod: string }>;
    skillsMatrix: {
      rows: Array<{
        title: string;
        count?: string;
        values: number[];
      }>;
      columns: string[];
    };
  };
}

export function SkillsAssessment({ data }: SkillsAssessmentProps) {
  return (
    <div>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>Skills Assessment</h2>
      </div>

      <div className='grid grid-cols-3 gap-6'>
        <div className='col-span-2'>
          <SkillsMatrix data={data.skillsMatrix} />
        </div>

        <div className='col-span-1 space-y-6'>
          <RatingStars
            title='Core Strengths'
            titleColor='text-green-600'
            icon={<ThumbsUp className='w-6 h-6 text-green-600' />}
            items={data.coreStrengths.map((item) => ({
              text: item.skill,
              rating: item.rating,
            }))}
          />

          <RatingStars
            title='Emerging Strengths'
            titleColor='text-blue-600'
            icon={<TrendingUp className='w-6 h-6 text-blue-600' />}
            items={data.emergingStrengths.map((item) => ({
              text: item.skill,
              rating: item.rating,
            }))}
          />
        </div>
      </div>

      <div className='mt-6'>
        <RatingStars
          title='Development Priorities'
          titleColor='text-blue-600'
          icon={<Sparkles className='w-6 h-6 text-blue-600' />}
          items={data.developmentPriorities.map((item) => ({
            text: item.skill,
            rating: item.rating,
            additionalText: `- ${item.priority} (${item.learningPeriod})`,
          }))}
        />
      </div>
    </div>
  );
}

// Star component
function Star({ fill, stroke, className }: { fill: string; stroke: string; className: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill={fill}
      stroke={stroke}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}>
      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
  );
}
