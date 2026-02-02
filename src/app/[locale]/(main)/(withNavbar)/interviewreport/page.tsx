'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InterviewSummary from './components/InterviewSummary';
import Loading from '@/components/Loading';

export default function InterviewReportPage() {
  return (
    <Suspense fallback={<Loading />}>
      <InterviewReportContent />
    </Suspense>
  );
}

function InterviewReportContent() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");

  if (!interviewId) {
    return <div>Interview ID is required</div>;
  }

  return <InterviewSummary interviewId={interviewId} />;
}
