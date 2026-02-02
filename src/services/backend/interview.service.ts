import { TranscriptionMessage } from '@/app/[locale]/(main)/(withoutNavbar)/interview/[id]/Interview'
import axiosInstance from './axiosInstance'
import { cookies } from 'next/headers'

const getInterviewInfo = async (interviewId: string) => {
  const cookieStore = cookies()
  const token = cookieStore.get('payload-token')?.value

  const results = await axiosInstance({ token })
    .get(`/interviews/info/${interviewId}`)
    .then((resp) => resp?.data)
  return results
}

const updateInterviewStatus = async (interviewId: string, status: string) => {
  const cookieStore = cookies()
  const token = cookieStore.get('payload-token')?.value

  const results = await axiosInstance({ token })
    .patch(`/interviews/${interviewId}`, {
      status
    })
    .then((resp) => resp?.data)
  return results
}

const endInterview = async (interviewId: string, {
  status,
  transcription,
  interviewDuration,
}: {
  status: string
  transcription: TranscriptionMessage[]
  interviewDuration: number
}) => {
  const cookieStore = cookies()
  const token = cookieStore.get('payload-token')?.value

  const results = await axiosInstance({ token })
    .patch(`/interviews/${interviewId}`, {
      status,
      transcription,
      interviewDuration
    })
    .then((resp) => resp?.data)
  return results
}

export {
  getInterviewInfo,
  updateInterviewStatus,
  endInterview,
}
