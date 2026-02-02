"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import StreamingAvatar, { } from "@heygen/streaming-avatar";
import { LogOut, Loader2Icon, Brain } from "lucide-react";

import { useAuth } from "@/providers/Auth";
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index.js";
import { cn, getPlanStatus } from "@/lib/utils";
import { rest } from "@/lib/rest";
import { toast } from "sonner";

import UserCamera from "@/components/Camera";
import Loading from "@/components/Loading";
import { User } from "@/payload-types";
import { InterviewContext } from "./page";


export interface TranscriptionMessage {
  role: "interviewer" | "interviewee";
  text: string;
  startTime: number;
  endTime: number;
  task_id?: string;
}

const OPENCV_URI = "https://docs.opencv.org/3.4/opencv.js";

interface RealtimeEvent {
  time: string;
  source: "client" | "server";
  count?: number;
  event: { [key: string]: any };
}

const LOCAL_RELAY_SERVER_URL: string =
  process.env.NEXT_PUBLIC_RELAY_SERVER_URL || "";

export default function Interview(props: InterviewContext) {
  const { user } = useAuth();
  const interviewType = props.interviewType
  const interviewId = props.interviewId

  const tError = useTranslations("errors");

  const router = useRouter();

  const [stream, setStream] = useState<MediaStream>();
  const [isConnected, setIsConnected] = useState(false);
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [whoTalked, setWhoTalked] = useState<"user" | "avatar" | "none">(
    "none"
  );
  const [isCameraOn, setCameraOn] = useState(true);
  const [conversation, setConversation] = useState<TranscriptionMessage[]>([]);

  const languageRef = useRef<string | null>(null);
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const startTimeStamp = useRef<number>(0);
  const prevStartMessageTimeStamp = useRef<number>(0);
  const prevEndMessageTimeStamp = useRef<number>(0);
  const currentStartMessageTimeStamp = useRef<number>(0);
  const currentEndMessageTimeStamp = useRef<number>(0);

  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  const interviewStartTime = useRef<number>(0);
  const interviewEndTime = useRef<number>(0);

  // Dynamically load opencv.js on the client side
  const loadOpenCv = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).cv) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = OPENCV_URI;
      script.async = true;
      script.onload = () => {
        // Wait until opencv is fully initialized
        (window as any).cv["onRuntimeInitialized"] = () => {
          console.log("opencv is ready");
          resolve();
        };
      };
      script.onerror = (err) =>
        reject(new URIError("opencv didn't load correctly."));
      document.body.appendChild(script);
    });
  };

  const endSession = useCallback(async () => {
    setCameraOn(false);
    // avatar.current?.stopAvatar();
    interviewEndTime.current = Date.now();
    const interviewDuration =
      interviewEndTime.current - interviewStartTime.current;
    // setStream(undefined);
    rest(
      interviewType === "interview"
        ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${interviewId}`
        : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`,
      {
        transcription: conversation,
        status: "Completed",
        interviewDuration,
      },
      {
        method: "PATCH",
      }
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
        }
      ).catch((err) => {
        console.error("Failed to update plan status", err);
      });
    } else {
      console.warn("No planId found; skipping plan status update.");
    }

    if (interviewType === "interview") {
      router.push("/interviewsetup");
    } else {
      router.push("/careercounselling");
    }
  }, [avatar, router, conversation, interviewId, interviewType]);

  const insertMessage = useCallback(
    (role: "interviewer" | "interviewee", event: any) => {
      setConversation((prev) => {
        if (prev.length) {
          const lastMessage = prev[prev.length - 1];
          if (
            lastMessage.role === role &&
            lastMessage.task_id === event.detail.task_id
          ) {
            const newConversation = [...prev];
            let additional = event.detail.message;
            if (
              role === "interviewee" &&
              !newConversation[prev.length - 1].text.endsWith(" ") &&
              !additional.startsWith(" ")
            ) {
              additional =
                (/[A-Z]/.test(additional[0]) ? "." : "") + " " + additional;
            }
            newConversation[prev.length - 1].text += additional;

            // if (timeoutRef.current) clearTimeout(timeoutRef.current);
            // timeoutRef.current = setTimeout(onTimeout, 1500);

            return newConversation;
          }
        }

        // if prev message is interviewer's, have to change the start and end time into prev timeStamps of interviewer's message
        // that's why because the timeStamps are interviewee's
        const prevConversations = [...prev];
        if (prevConversations.length > 0) {
          if (
            prevConversations[prevConversations.length - 1].role ===
            "interviewer"
          ) {
            prevConversations[prevConversations.length - 1].startTime =
              prevStartMessageTimeStamp.current;
            prevConversations[prevConversations.length - 1].endTime =
              prevEndMessageTimeStamp.current;
          }
        }

        const newConversation = [
          ...prevConversations,
          {
            role,
            text: event.detail.message,
            task_id: event.detail.task_id,
            startTime: currentStartMessageTimeStamp.current,
            endTime: currentEndMessageTimeStamp.current,
          },
        ];
        rest(
          interviewType === "interview"
            ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${interviewId}`
            : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`,
          {
            transcription: prev,
          },
          {
            method: "PATCH",
          }
        );
        return newConversation;
      });
    },
    [interviewId, interviewType]
  );

  // const startSession = useCallback(() => {
  //   if (!languageRef.current || !knowledgeBase.current) return;
  //   fetchAccessToken().then((token) => {
  //     if (!languageRef.current || !knowledgeBase.current) return;
  //     avatar.current = new StreamingAvatar({
  //       token,
  //     });
  //     avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
  //       if (isConnected) endSession();
  //     });
  //     avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
  //       avatar.current?.stopListening();
  //       getGptResponse();
  //       connectConversation();
  //       // if (languageRef.current === "he") {
  //       //   helloMessage = "שלום";
  //       //   avatar.current?.stopListening();
  //       //   getGptResponse();
  //       //   connectConversation();
  //       // } else {
  //       //   if (languageRef.current === "en") helloMessage = "Hello";
  //       //   // else if (languageRef.current === "zh") helloMessage = "你好";
  //       //   else if (languageRef.current === "ru") helloMessage = "Привет";
  //       //   avatar.current?.speak({
  //       //     text: helloMessage,
  //       //     taskType: TaskType.TALK,
  //       //   });
  //       // }
  //       setStream(event.detail);
  //       startTimeStamp.current = event.timeStamp;
  //     });
  //     avatar.current?.on(StreamingEvents.USER_START, (event) => {
  //       currentStartMessageTimeStamp.current =
  //         event.timeStamp - startTimeStamp.current;
  //       setWhoTalked("user");
  //     });
  //     avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
  //       currentEndMessageTimeStamp.current =
  //         event.timeStamp - startTimeStamp.current;
  //     });
  //     avatar.current?.on(StreamingEvents.AVATAR_START_TALKING, (event) => {
  //       currentStartMessageTimeStamp.current =
  //         event.timeStamp - startTimeStamp.current;
  //       prevStartMessageTimeStamp.current =
  //         currentStartMessageTimeStamp.current;
  //       setIsAvatarTalking(true);
  //       setWhoTalked("avatar");
  //     });
  //     avatar.current?.on(StreamingEvents.AVATAR_STOP_TALKING, (event) => {
  //       currentEndMessageTimeStamp.current =
  //         event.timeStamp - startTimeStamp.current;
  //       prevEndMessageTimeStamp.current = currentEndMessageTimeStamp.current;
  //       setIsAvatarTalking(false);
  //       if (languageRef.current === "he") {
  //         setWhoTalked("user");
  //       }
  //     });
  //     avatar.current?.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
  //       insertMessage("interviewer", event);
  //     });
  //     avatar.current?.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
  //       insertMessage("interviewee", event);
  //     });

  //     avatar.current
  //       .createStartAvatar({
  //         quality: AvatarQuality.High,
  //         avatarName: avatarId,
  //         knowledgeBase: knowledgeBase.current,
  //         voice: {
  //           voiceId: voiceId,
  //           rate: 1.25,
  //           emotion: VoiceEmotion.EXCITED,
  //         },
  //         language:
  //           languageRef.current !== "he" ? languageRef.current : undefined,
  //         disableIdleTimeout: true,
  //       })
  //       .catch((error) => {
  //         let responseData: any = {};
  //         try {
  //           if (error.responseText) {
  //             responseData = JSON.parse(error.responseText);
  //           }
  //         } catch (e) {
  //           console.error("Error parsing error response:", e);
  //         }

  //         if (responseData.code === "quota_not_enough") {
  //           toast.error(tError("quotaNotEnough"));
  //         } else {
  //           console.error("Avatar creation error:", error);
  //           toast.error(tError("somethingWentWrong"));
  //         }
  //         rest(
  //           interviewType === "interview"
  //             ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${interviewId}`
  //             : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`,
  //           {
  //             status: "Not Started",
  //           },
  //           {
  //             method: "PATCH",
  //           }
  //         );
  //         if (interviewType === "interview") router.push("/dashboard");
  //         else router.push("/careercounselling");

  //         throw error;
  //       })
  //       .then(() => {
  //         // if (languageRef.current !== "he") {
  //         //   avatar.current?.startVoiceChat({
  //         //     useSilencePrompt: true,
  //         //   });
  //         // }
  //         setIsConnected(true);
  //         interviewStartTime.current = Date.now();
  //         rest(
  //           interviewType === "interview"
  //             ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${interviewId}`
  //             : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`,
  //           {
  //             status: "In Progress",
  //           },
  //           {
  //             method: "PATCH",
  //           }
  //         );
  //       });
  //   });
  // }, [
  //   fetchAccessToken,
  //   avatarId,
  //   voiceId,
  //   isConnected,
  //   endSession,
  //   insertMessage,
  //   interviewId,
  //   interviewType,
  // ]);


  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  useEffect(() => {
    if (getPlanStatus(user as User) === "freeTrial_expired") {
      toast.error(tError("freeTrialExpired"));
      router.push("/settings?value=Billing");
      return;
    } else if (getPlanStatus(user as User) === "subscription_expired") {
      toast.error(tError("subscriptionExpired"));
      router.push("/settings?value=Billing");
      return;
    }
    if (props?.agentConfiguration?.systemPrompt) {
      // Load opencv.js only on the client
      if (interviewType === "interview") {
        loadOpenCv()
          .then()
          .catch((err) => {
            console.error(err);
          });
      }
      // startSession();
    }
  }, [interviewType, user]);

  const disconnectConversation = useCallback(async () => {
    if (isConnected) {
      setIsConnected(false);
      await endSession();

      // if (languageRef.current === "he") {
      const wavRecorder = wavRecorderRef.current;
      await wavRecorder.end();

      const wavStreamPlayer = wavStreamPlayerRef.current;
      await wavStreamPlayer.interrupt();
      // }
    }
  }, [isConnected, endSession]);

  const connectConversation = useCallback(async () => {
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    let helloMessage = "";
    if (languageRef.current === "he") helloMessage = "שלום";
    else if (languageRef.current === "en") helloMessage = "Hello";
    else if (languageRef.current === "zh") helloMessage = "你好";
    else if (languageRef.current === "ru") helloMessage = "Привет";

    // Set state variables
    setIsConnected(true);

    // Connect to microphone
    await wavRecorder.begin();

    // Connect to audio output
    await wavStreamPlayer.connect();

    // Connect to realtime API
    // await client.connect();

    // client.sendUserMessageContent([
    //   {
    //     type: `input_text`,
    //     text: helloMessage,
    //   },
    // ]);

    // if (client.getTurnDetectionType() === "server_vad") {
    //   await wavRecorder.record((data) => {
    //     if (client.isConnected()) {
    //       client.appendInputAudio(data.mono);
    //     }
    //   });
    // }
  }, []);

  const getGptResponse = async () => {
    const wavStreamPlayer = wavStreamPlayerRef.current;
    // const client = clientRef.current;
    // Set instructions
    // client.updateSession({
    //   instructions: knowledgeBase.current || "",
    //   input_audio_transcription: { model: "whisper-1" },
    //   // temperature: 1.5,
    //   // voice: "sage",
    //   turn_detection: {
    //     // type: "semantic_vad",
    //     // eagerness: "low" | "medium" | "high" | "auto", // optional
    //     // create_response: true, // only in conversation mode
    //     // interrupt_response: true, // only in conversation mode
    //     type: "server_vad",
    //     silence_duration_ms: 1500,
    //   },
    //   modalities: ["text"],
    // });

    // handle realtime events from client + server for event logging
    // client.on("realtime.event", (realtimeEvent: RealtimeEvent) => {
    //   console.log("💡", realtimeEvent);
    // });
    // client.on(
    //   "realtime.event",
    //   ({
    //     time,
    //     source,
    //     event,
    //   }: {
    //     time: string;
    //     source: "client" | "server";
    //     event: Record<string, any>;
    //   }) => {
    //     if (source === "server") {
    //       if (event.type === "input_audio_buffer.speech_started") {
    //         currentStartMessageTimeStamp.current = event.audio_start_ms;
    //       }
    //       if (event.type === "input_audio_buffer.speech_stopped") {
    //         currentEndMessageTimeStamp.current = event.audio_end_ms;
    //       }
    //     }
    //   }
    // );

    // client.on("error", (event: any) => console.error(event));
    // client.on("conversation.interrupted", async () => {
    //   const trackSampleOffset = await wavStreamPlayer.interrupt();
    //   if (trackSampleOffset?.trackId) {
    //     const { trackId, offset } = trackSampleOffset;
    //     await client.cancelResponse(trackId, offset);
    //   }
    // });
    // client.on(
    //   "conversation.updated",
    //   async ({ item, delta }: { item: ItemType; delta: any }) => {
    // if (avatar.current) {
    //   const response = item.formatted.text || item.formatted.transcript;
    //   if (
    //     item.role === "user" && // @ts-ignore
    //     item.status === "completed" &&
    //     response
    //   ) {
    //     console.log(response);
    //     insertMessage("interviewee", {
    //       detail: { task_id: "", message: response },
    //     });
    //   }
    //   if (
    //     item.role === "assistant" && // @ts-ignore
    //     item.status === "completed" &&
    //     response
    //   ) {
    //     avatar.current.speak({
    //       text: response,
    //       taskType: TaskType.REPEAT,
    //     });
    //   }
    // }
    // if (delta?.audio) {
    //   wavStreamPlayer.add16BitPCM(delta.audio, item.id);
    // }
    // @ts-ignore
    //     if (item.status === "completed" && item.formatted.audio?.length) {
    //       const wavFile = await WavRecorder.decode(
    //         item.formatted.audio,
    //         24000,
    //         24000
    //       );
    //       item.formatted.file = wavFile;
    //     }
    //   }
    // );

    return () => {
      // cleanup; resets to defaults
      // client.reset();
    };
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      {stream ? (
        <div className="relative flex flex-col h-full items-center p-20 bg-white rounded-lg">
          {/* <div className="w-full min-h-24 overflow-y-auto text-">
            {conversation.map((message, index) => (
              <p key={index}>
                <span className="text-blue-500">{message.role}</span>
                {message.text}
              </p>
            ))}
          </div> */}
          <video
            ref={mediaStream}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "16px",
            }}
          >
            <track kind="captions" />
          </video>
          <div className="absolute bottom-24 right-24 w-[25%] h-[25%] rounded-lg overflow-hidden shadow-lg">
            <UserCamera
              isCameraOn={isCameraOn}
              interviewId={interviewId}
              interviewType={interviewType as string}
            />
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4">
            {languageRef.current !== "he" ? (
              isAvatarTalking ? (
                <Image
                  src="/Icons/sound.gif"
                  alt="sound"
                  width={54}
                  height={54}
                />
              ) : (
                <button
                  className={cn(
                    "flex flex-row p-2 rounded-full bg-primary items-center text-white",
                    {
                      "animate-pulse gap-2": whoTalked === "user",
                    },
                    {
                      "gap-2": conversation.length === 0,
                    }
                  )}
                >
                  {conversation.length === 0 ? (
                    <Image
                      src="/Icons/loading.svg"
                      alt="loading"
                      width={30}
                      height={30}
                    />
                  ) : whoTalked === "user" ? (
                    <Brain size={30} />
                  ) : (
                    <Image
                      src="/Icons/headphones.gif"
                      alt="loading"
                      width={34}
                      height={34}
                    />
                  )}
                  <span>
                    {conversation.length === 0
                      ? `Loading interview...`
                      : whoTalked === "user" && `Thinking...`}
                  </span>
                </button>
              )
            ) : isAvatarTalking ? (
              <Image
                src="/Icons/sound.gif"
                alt="sound"
                width={54}
                height={54}
              />
            ) : (
              <button
                className={cn(
                  "flex flex-row p-2 gap-2 rounded-full bg-primary items-center text-white",
                  {
                    "animate-pulse": conversation.length > 0,
                  }
                )}
              >
                {conversation.length === 0 ? (
                  <Image
                    src="/Icons/loading.svg"
                    alt="loading"
                    width={30}
                    height={30}
                  />
                ) : (
                  <Brain size={30} />
                )}
                <span>
                  {conversation.length === 0
                    ? `Loading interview...`
                    : `Thinking...`}
                </span>
              </button>
            )}
            {isConnected ? (
              <button
                className="flex flex-row p-2 gap-2 bg-red-500 items-center rounded-full text-white hover:bg-red-600"
                onClick={disconnectConversation}
              >
                <LogOut size={30} />
                <span>End Session</span>
              </button>
            ) : (
              <button
                className="p-2 bg-green-500/60 rounded-full text-white hover:bg-green-600/60"
                onClick={disconnectConversation}
              >
                <Loader2Icon className="animate-spin" size={30} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <Loading text="Please wait while your session is being prepared." />
      )}
    </div>
  );
}
