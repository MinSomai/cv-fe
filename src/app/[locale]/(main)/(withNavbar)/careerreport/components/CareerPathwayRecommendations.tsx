import { KeyInsightCard } from '@/app/[locale]/(main)/(withNavbar)/interviewreport/components';
import { List, User, Building, Banknote, Route, ChevronsRightIcon, Box, FileTextIcon } from 'lucide-react';
import { CareerPathwayBar } from './CareerPathwayBar';
import { useTranslations } from 'next-intl';

interface CareerPathwayRecommendationsProps {
  data: {
    recommendations: Array<{
      title: string;
      match: number;
      whyThisFitsYou: string;
      keyRequirements: string[];
      marketOutlook: string;
      compensationRange: string;
      careerProgressionPath: string;
      potentialChallenges: string;
      nextSteps: string;
    }>;
    theoreticalAlignment: string;
  };
}

export function CareerPathwayRecommendations({ data }: CareerPathwayRecommendationsProps) {
  const t = useTranslations("careerPathwayRecommendations");
  return (
    <div>
      <div className='bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center'>
        <h2 className='text-2xl font-bold'>{t("title")}</h2>
      </div>

      {/* Career Pathway Bars */}
      <div className='border border-gray-100 rounded-2xl p-3 mb-3'>
        {data.recommendations.map((recommendation) => (
          <CareerPathwayBar key={recommendation.title} title={recommendation.title} percentage={recommendation.match} />
        ))}
      </div>

      {data.recommendations.map((recommendation, index) => {
        let bgColor;
        let textColor;
        let borderColor;
        if (recommendation.match <= 49) {
          bgColor = 'bg-[#fef3f2]';
          textColor = 'text-[#b42318]';
          borderColor = 'border-[#FECDCA]';
        } else if (recommendation.match <= 60) {
          bgColor = 'bg-[#FFFAEB]';
          textColor = 'text-[#B54708]';
          borderColor = 'border-[#FEDF89]';
        } else {
          bgColor = 'bg-[#ecfdf3]';
          textColor = 'text-[#039855]';
          borderColor = 'border-[#ABEFC6]';
        }

        return (
          <div
            key={index}
            className='mb-8 pb-8 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0 bg-[#f0f3ff] rounded-2xl p-4'>
            <h3 className='text-xl font-semibold mb-4 flex items-center gap-2'>
              <div className='w-7 h-7 border-2 border-blue-500 rounded-full text-blue-500 flex items-center justify-center flex-shrink-0'>
                <span className='text-xl'>{index + 1}</span>
              </div>
              {/* <span className='border border-blue-500 rounded-full text-blue-500'>{index + 1}</span> */}
              {recommendation.title}
              <span
                className={`rounded-full ${bgColor} ${textColor} border ${borderColor} px-2 py-1 text-sm font-medium whitespace-nowrap`}>
                {recommendation.match}% {t("match")}
              </span>
            </h3>

            <div className='grid grid-cols-4 gap-4 mb-4'>
              <div className='col-span-1 flex'>
                <KeyInsightCard icon={User} title={t("whyThisFitsYou")} description={recommendation.whyThisFitsYou} />
              </div>

              <div className='col-span-1 flex'>
                <KeyInsightCard
                  icon={List}
                  title={t("keyRequirements")}
                  description={recommendation.keyRequirements.join('\n')}
                />
              </div>

              <div className='col-span-2'>
                <KeyInsightCard icon={Building} title={t("marketOutlook")} description={recommendation.marketOutlook} />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 mb-4'>
              <KeyInsightCard
                icon={Banknote}
                title={t("compensationRange")}
                description={recommendation.compensationRange}
              />

              <KeyInsightCard
                icon={Route}
                title={t("careerProgressionPath")}
                description={recommendation.careerProgressionPath}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <KeyInsightCard
                icon={Box}
                title={t("potentialChallenges")}
                iconColor='rgba(192, 16, 72, 1)'
                titleColor='rgba(192, 16, 72, 1)'
                description={recommendation.potentialChallenges}
              />

              <KeyInsightCard
                icon={ChevronsRightIcon}
                title={t("nextSteps")}
                iconColor='rgba(3, 152, 85, 1)'
                titleColor='rgba(3, 152, 85, 1)'
                description={recommendation.nextSteps}
              />
            </div>
          </div>
        );
      })}

      <div className='mb-8 bg-[#f0f3ff] rounded-2xl p-4'>
        <KeyInsightCard icon={FileTextIcon} title={t("theoreticalAlignment")} description={data.theoreticalAlignment} />
      </div>
    </div>
  );
}
