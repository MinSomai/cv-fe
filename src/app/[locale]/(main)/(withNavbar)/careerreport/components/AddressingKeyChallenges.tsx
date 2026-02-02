import { BadgeHelp } from 'lucide-react';
import { KeyInsightCard } from '@/app/[locale]/(main)/(withNavbar)/interviewreport/components';

interface Challenge {
  title: string;
  solutions: string[];
}

interface AddressingKeyChallengesProps {
  challenges: Challenge[];
}

export function AddressingKeyChallenges({ challenges }: AddressingKeyChallengesProps) {
  return (
    <div>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>ADDRESSING KEY CHALLENGES</h2>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {challenges.map((challenge, index) => {
          const challengeContent = (
            <div className='space-y-3'>
              {challenge.solutions.map((solution, solutionIndex) => (
                <div key={solutionIndex} className='flex'>
                  <strong className='mr-2 whitespace-nowrap'>{solutionIndex + 1}. Solution:</strong>
                  <div className='text-gray-600'>{solution}</div>
                </div>
              ))}
            </div>
          );

          return (
            <KeyInsightCard
              key={index}
              icon={BadgeHelp}
              iconColor='#e11d48'
              title={`Challenge ${index + 1}: ${challenge.title}`}
              titleColor='#e11d48'
              content={challengeContent}
            />
          );
        })}
      </div>
    </div>
  );
}
