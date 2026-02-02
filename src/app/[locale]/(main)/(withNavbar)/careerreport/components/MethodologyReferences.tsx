import { KeyInsightCard } from '@/app/[locale]/(main)/(withNavbar)/interviewreport/components';
import { FileText, Book } from 'lucide-react';

interface MethodologyReferencesProps {
  description: string;
  references: string[];
}

export function MethodologyReferences({ description, references }: MethodologyReferencesProps) {
  const referencesContent = (
    <div className='space-y-3'>
      {references.map((reference, index) => (
        <div key={index} className='flex'>
          <span className='mr-2 font-semibold'>{index + 1}.</span>
          <span className='text-gray-600'>{reference}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>METHODOLOGY & REFERENCES</h2>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <KeyInsightCard icon={FileText} title='Description' description={description} iconColor='#465ff1' />

        <KeyInsightCard
          icon={Book}
          title='References'
          content={referencesContent}
          iconColor='#465ff1'
          titleColor='#4669f2'
        />
      </div>
    </div>
  );
}
