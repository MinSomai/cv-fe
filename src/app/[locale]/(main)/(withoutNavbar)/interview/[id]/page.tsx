import InterviewInit from "./InterviewInit";
import { getInterviewInfo } from "@/services/backend/interview.service";

interface Props {
  params: {
    id: string;
  };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface InterviewContext {
  interviewId: string
  interviewType: 'careercounselling' | 'interview'

  agentConfiguration: {
    avatarId: string
    voiceId: string
    systemPrompt: string
    language?: string
  }
}

export default async function InterviewPage({ params: { id: interviewId }, searchParams }: Props) {
  const interviewType = (await searchParams).type as 'careercounselling' | 'interview'

  const res = await getInterviewInfo(interviewId)

  const interviewContext: InterviewContext = {
    interviewId,
    interviewType,
    agentConfiguration: {
      avatarId: res?.avatarId,
      voiceId: res?.voiceId,
      systemPrompt: res?.prompt,
      language: res?.language
    }
  }

  return (
    <InterviewInit {...interviewContext} />
  )
}

