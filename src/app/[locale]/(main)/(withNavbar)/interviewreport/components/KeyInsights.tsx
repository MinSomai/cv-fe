import { Eye, Mic, Brain, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ContentCard/ContentCard';

export default function KeyInsights() {
  const insights = [
    {
      title: 'Maintain Confidence',
      category: 'Presence',
      icon: Eye,
      description:
        'You demonstrated strong, clear answers. However, increasing your eye contact, especially during key moments, will make your responses feel more.',
    },
    {
      title: 'Engage Your Body',
      category: 'Non-verbal',
      icon: Brain,
      description:
        'Your posture was well-controlled, with an open and approachable stance. To keep projecting confidence, continue practicing staying relaxed and avoid',
    },
    {
      title: 'Control Your Tempo',
      category: 'Verbal',
      icon: Mic,
      description:
        'Your speech flow was good, but there were a few moments where it became slightly inconsistent. Focus on reducing filler words and maintaining.',
    },
    {
      title: 'Refine Your Vocabulary',
      category: 'Verbal',
      icon: MessageSquare,
      description:
        'You used a great range of vocabulary, which added depth to your answers. However, simplifying some technical jargon could make your points more than the others',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-6'>
          {insights.map((insight) => (
            <div key={insight.title} className='rounded-lg border border-gray-200 bg-white p-6'>
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <insight.icon className='h-5 w-5 text-[#465ff1]' />
                    <h4 className='font-semibold'>{insight.title}</h4>
                  </div>
                  <span className='text-sm text-[#667085]'>{insight.category}</span>
                </div>
              </div>
              <p className='text-sm text-[#667085]'>{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
