"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "@/lib/navigation";
import {
  LiveAvatarContextProvider,
  useSession,
  useTextChat,
  useVoiceChat,
} from "@/components/LiveAvatar";
import { SessionState } from "@heygen/liveavatar-web-sdk";
import { useAvatarActions } from "@/components/LiveAvatar/useAvatarActions";
import { RealtimeProvider, useRealtime } from "@/providers/RealtimeProvider";
import { useLiveAvatarContext } from "@/components/LiveAvatar/context";
import { AudioProcessor } from "@/utils/AudioProcessor";
import { InterviewContext } from "./page";
import { TranscriptionMessage } from "./Interview";
import { useAuth } from "@/providers/Auth";
import { rest } from "@/lib/rest";
import { toast } from "sonner";

const Button: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-white text-black px-4 py-2 rounded-md"
    >
      {children}
    </button>
  );
};

const Interview: React.FC<{
  mode: "FULL" | "CUSTOM";
  onSessionStopped: () => void;
  interviewInfo: InterviewContext;
}> = ({ mode, onSessionStopped, interviewInfo }) => {
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const { user } = useAuth();

  const interviewType = interviewInfo.interviewType;
  const interviewId = interviewInfo.interviewId;

  const interviewStartTime = useRef<number>(0);
  const interviewEndTime = useRef<number>(0);

  // Track message timings like old code
  const prevStartMessageTimeStamp = useRef<number>(0);
  const prevEndMessageTimeStamp = useRef<number>(0);

  const realtime = useRealtime();
  const { messagesRTC } = realtime;
  const { sessionRef, messages } = useLiveAvatarContext();

  useEffect(() => {
    console.log("LiveAvatar messages: ", messages);
    console.log("Realtime messagesRTC: ", messagesRTC);
  }, [messages, messagesRTC]);

  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    connectionQuality,
    keepAlive,
    attachElement,
  } = useSession();

  const {
    isAvatarTalking,
    isUserTalking,
    isMuted,
    isActive,
    isLoading,
    start,
    stop,
    mute,
    unmute,
  } = useVoiceChat();

  const { sendMessage } = useTextChat(mode);
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript to bottom when new messages arrive
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesRTC]);

  useEffect(() => {
    if (sessionState === SessionState.DISCONNECTED) {
      onSessionStopped();
    }
  }, [sessionState, onSessionStopped]);

  useEffect(() => {
    if (isStreamReady && videoRef.current) {
      attachElement(videoRef.current);
    }
  }, [attachElement, isStreamReady]);

  useEffect(() => {
    if (sessionState === SessionState.INACTIVE) {
      console.log(" inactive so starting Session:  ");
      startSession();
    }
  }, [startSession, sessionState]);

  useEffect(() => {
    interviewStartTime.current = Date.now();
    realtime.startRTCSession();
  }, []);

  // Converts real-time chat messages into interview transcription format
  const convertMessagesToTranscription = (): TranscriptionMessage[] => {
    const conversationMessages = messagesRTC;

    return conversationMessages.map((msg, index) => {
      const currentMsgTime =
        msg.timestamp.getTime() - interviewStartTime.current;

      // Calculate startTime and endTime based on message sequence
      let startTime = currentMsgTime;
      let endTime = currentMsgTime;

      if (index < conversationMessages.length - 1) {
        endTime =
          conversationMessages[index + 1].timestamp.getTime() -
          interviewStartTime.current;
      }

      // Handle task_id: group consecutive messages from same role
      // This helps identify continuous speech segments
      let taskId: string | undefined = undefined;
      if (index > 0) {
        const prevMsg = conversationMessages[index - 1];

        if (prevMsg.role === msg.role) {
          taskId = `task_${msg.role}_${index}`;
        }
      }

      return {
        role:
          msg.role === "user"
            ? "interviewee"
            : ("interviewer" as "interviewer" | "interviewee"),
        text: msg.content,
        startTime,
        endTime,
        task_id: taskId,
      };
    });
  };

  //  AUTO-SAVE: Save transcription whenever messages change
  useEffect(() => {
    if (messagesRTC.length === 0) return;

    const transcription = convertMessagesToTranscription();
    const endpoint =
      interviewType === "interview"
        ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${interviewId}`
        : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`;

    // Auto-save in the background
    rest(
      endpoint,
      {
        transcription: transcription,
      },
      {
        method: "PATCH",
      },
    ).catch((err) => {
      console.error("Auto-save failed:", err);

      if (err.response) {
        console.error("Error response:", err.response);
      }
    });
  }, [messagesRTC, interviewType, interviewId, interviewStartTime]);

  const endSession = async () => {
    setIsSaving(true);

    try {
      stopSession();
      realtime.stopRTCSession();

      interviewEndTime.current = Date.now();
      const interviewDuration =
        interviewEndTime.current - interviewStartTime.current;

      const transcription = convertMessagesToTranscription();

      if (transcription.length === 0) {
        toast.warning("No conversation was recorded");
      }

      const endpoint =
        interviewType === "interview"
          ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${interviewId}`
          : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`;

      // Final save with status and duration
      await rest(
        endpoint,
        {
          transcription: transcription,
          status: "Completed",
          interviewDuration,
        },
        {
          method: "PATCH",
        },
      );

      toast.success(
        `Interview saved! ${transcription.length} messages recorded`,
      );

      const data =
        interviewType === "interview"
          ? {
            usedInterviewTime: interviewDuration,
            planId:
              typeof user?.interviewPlan === "string"
                ? user.interviewPlan
                : user?.interviewPlan?.id,
          }
          : {
            // Add counselling interview plan data here if needed
            // usedConsultationTime: interviewDuration,
            // usedConsultation: 1,
            // planId:
            //   typeof user?.consultationPlan === "string"
            //     ? user.consultationPlan
            //     : user?.consultationPlan?.id,
          };

      // Only update plan status if we have a valid planId to avoid server error/toast
      if ((data as any).planId) {
        await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/update-plan-status?interviewType=${interviewType}`,
          data,
          {
            method: "POST",
          },
        ).catch((err) => {
          console.error("Failed to update plan status:", err);
        });
      } else {
        console.warn("No planId found; skipping plan status update.");
      }

      if (interviewType === "interview") {
        router.push("/interviewsetup");
      } else {
        router.push("/careercounselling");
      }
    } catch (error: any) {
      console.error("Failed to save interview:", error);

      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        "Failed to save interview. Please try again.";

      toast.error(errorMessage);
      setIsSaving(false);
    }
  };

  const VoiceChatComponents = (
    <>
      <p>Voice Chat Active: {isActive ? "true" : "false"}</p>
      <p>Voice Chat Loading: {isLoading ? "true" : "false"}</p>
      {isActive && <p>Muted: {isMuted ? "true" : "false"}</p>}
      <Button
        onClick={() => {
          if (isActive) {
            stop();
          } else {
            start();
          }
        }}
        disabled={isLoading}
      >
        {isActive ? "Stop Voice Chat" : "Start Voice Chat"}
      </Button>
      {isActive && (
        <Button
          onClick={() => {
            if (isMuted) {
              unmute();
            } else {
              mute();
            }
          }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </Button>
      )}
    </>
  );

  return (
    <div className="w-full h-screen flex gap-4 p-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center bg-black rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
          <button
            className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold transition-colors"
            onClick={() => endSession()}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "End Interview"}
          </button>
        </div>

        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg">
          <div className="flex gap-4">
            <p className="text-sm">
              <span className="font-semibold">Session:</span> {sessionState}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Quality:</span>{" "}
              {connectionQuality}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Messages:</span>{" "}
              {messagesRTC.length}
            </p>
          </div>
          {mode === "FULL" && (
            <div className="flex gap-2">{VoiceChatComponents}</div>
          )}
        </div>

        {isSaving && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            Saving interview... Please wait.
          </div>
        )}
      </div>

      <div className="w-96 flex flex-col bg-white rounded-lg shadow-lg">
        <div className="bg-gray-800 text-white px-4 py-3 rounded-t-lg">
          <h3 className="font-bold text-lg">Live Transcript</h3>
          <p className="text-sm text-gray-300">{messagesRTC.length} messages</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messagesRTC.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 italic text-center">
              <p>
                No messages yet.
                <br />
                Start the conversation!
              </p>
            </div>
          ) : (
            messagesRTC.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 p-3 rounded-lg ${msg.role === "user"
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "bg-green-50 border-l-4 border-green-500"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold text-sm ${msg.role === "user" ? "text-blue-700" : "text-green-700"
                      }`}
                  >
                    {msg.role === "user" ? "You" : "Interviewer"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Interview;
