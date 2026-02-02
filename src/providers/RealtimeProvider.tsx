"use client";

import { useLiveAvatarContext } from "@/components/LiveAvatar/context";
import { AudioProcessor } from "@/utils/AudioProcessor";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  mode?: "audio" | "text";
}

export interface VADSettings {
  threshold: number;
  silence_duration_ms: number;
}

interface RealtimeContextType {
  isRTCConnected: boolean;
  isRTCRecording: boolean;
  isRTCSpeaking: boolean;
  messagesRTC: Message[];
  errorRTC: string | null;
  connectionStatusRTC: string;
  allRTCEvents: any[];
  textInputRTC: string;
  setTextInputRTC: (value: string) => void;
  isSendingTextRTC: boolean;
  inputModeRTC: "audio" | "text";
  setInputModeRTC: (mode: "audio" | "text") => void;
  vadSettingsRTC: VADSettings;
  startRTCSession: (instructions?: string, voice?: string) => Promise<void>;
  stopRTCSession: () => void;
  sendTextMessageRTC: () => Promise<void>;
  updateVADSettingsRTC: (newDuration: number) => void;
  triggerResponseRTC: () => void;
  audioElementRefRTC: React.MutableRefObject<HTMLAudioElement | null>;
  peerConnectionRefRTC: React.MutableRefObject<RTCPeerConnection | null>;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
};

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Not connected");
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isSendingText, setIsSendingText] = useState(false);
  const [inputMode, setInputMode] = useState<"audio" | "text">("audio");
  const [vadSettings, setVadSettings] = useState<VADSettings>({
    threshold: 0.6,
    silence_duration_ms: 3000,
  });

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const { sessionRef } = useLiveAvatarContext();
  const audioProcessorRef = useRef<AudioProcessor | null>(null);

  useEffect(() => {
    return () => {
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (audioElementRef.current) {
        audioElementRef.current.srcObject = null;
      }
    };
  }, []);

  const handleServerEvent = useCallback(
    (event: any) => {
      setAllEvents((prev) => [
        ...prev,
        { type: event.type, data: event, timestamp: new Date() },
      ]);

      switch (event.type) {
        case "session.created":
        case "session.updated":
          break;

        case "input_audio_buffer.speech_started":
          setIsRecording(true);
          setIsSpeaking(false);
          break;

        case "input_audio_buffer.speech_stopped":
          setIsRecording(false);
          break;

        case "conversation.item.created":
          if (event.item.role === "user") {
            setMessages((prev) => {
              const existing = prev.find(
                (m) => m.role === "user" && !m.content,
              );
              if (!existing) {
                return [
                  ...prev,
                  {
                    role: "user",
                    content: "[Speaking...]",
                    timestamp: new Date(),
                    mode: "audio",
                  },
                ];
              }
              return prev;
            });
          }
          break;

        case "conversation.item.input_audio_transcription.completed":
          setMessages((prev) => {
            const userMsgIndex = prev.findIndex(
              (m, idx) =>
                m.role === "user" &&
                (m.content === "[Speaking...]" || idx === prev.length - 1),
            );

            if (userMsgIndex !== -1) {
              const updated = [...prev];
              updated[userMsgIndex] = {
                ...updated[userMsgIndex],
                content: event.transcript,
                mode: "audio",
              };
              return updated;
            } else {
              return [
                ...prev,
                {
                  role: "user",
                  content: event.transcript,
                  timestamp: new Date(),
                  mode: "audio",
                },
              ];
            }
          });
          break;

        case "response.audio.delta":
          if (!isSpeaking) {
            setIsSpeaking(true);
          }
          break;

        case "response.text.delta":
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, content: lastMsg.content + event.delta },
              ];
            } else {
              return [
                ...prev,
                {
                  role: "assistant",
                  content: event.delta,
                  timestamp: new Date(),
                  mode: "text",
                },
              ];
            }
          });
          break;

        case "response.text.done":
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, content: event.text },
              ];
            }
            return prev;
          });
          break;

        case "response.audio_transcript.delta":
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (
              lastMsg &&
              lastMsg.role === "assistant" &&
              lastMsg.content.includes("[AI is speaking")
            ) {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, content: lastMsg.content + event.delta },
              ];
            } else if (!lastMsg || lastMsg.role !== "assistant") {
              return [
                ...prev,
                {
                  role: "assistant",
                  content: event.delta,
                  timestamp: new Date(),
                  mode: "audio",
                },
              ];
            }
            return prev;
          });
          break;

        case "response.audio_transcript.done":
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, content: event.transcript, mode: "audio" },
              ];
            } else {
              return [
                ...prev,
                {
                  role: "assistant",
                  content: event.transcript,
                  timestamp: new Date(),
                  mode: "audio",
                },
              ];
            }
          });
          break;

        case "response.done":
          setIsSpeaking(false);
          break;

        case "error":
          setError(event.error.message || "An error occurred");
          break;
      }
    },
    [isSpeaking],
  );

  const startSession = useCallback(async (instructions?: string, voice?: string) => {
    try {
      setError(null);
      setConnectionStatus("Initializing...");

      const tokenResponse = await fetch("/api/realtime-sessions", {
        method: "POST",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get session token");
      }

      const sessionData = await tokenResponse.json();
      const ephemeralToken = sessionData.client_secret.value;

      setConnectionStatus("Creating peer connection...");
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      setConnectionStatus("Setting up audio...");
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;

      pc.ontrack = (e) => {
        // audioEl.srcObject = e.streams[0];
        setConnectionStatus("Audio track connected");

        if (audioProcessorRef.current) {
          audioProcessorRef.current.stop();
        }

        // Start new processor
        audioProcessorRef.current = new AudioProcessor((base64Audio) => {
          console.log("sending audio to session: ", base64Audio.length);
          sessionRef.current?.repeatAudio(base64Audio);
        });
        audioProcessorRef.current.start(e.streams[0]);
      };

      setConnectionStatus("Requesting microphone...");
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        const audioTrack = mediaStream.getTracks()[0];
        pc.addTrack(audioTrack, mediaStream);
      } catch (micError) {
        throw new Error(
          "Microphone access denied. Please allow microphone access.",
        );
      }

      setConnectionStatus("Creating data channel...");
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.addEventListener("open", () => {
        setIsConnected(true);
        setIsRecording(true);
        setConnectionStatus("Connected - Ready to talk!");

        const sessionUpdate: any = {
          turn_detection: {
            type: "server_vad",
            threshold: vadSettings.threshold,
            prefix_padding_ms: 500,
            silence_duration_ms: vadSettings.silence_duration_ms,
          },
        };

        if (instructions) {
          sessionUpdate.instructions = instructions;
        }
        if (voice) {
          sessionUpdate.voice = voice;
        }

        setTimeout(() => {
          dc.send(
            JSON.stringify({
              type: "session.update",
              session: sessionUpdate,
            }),
          );
          
          dc.send(
            JSON.stringify({
              type: "response.create",
              response: {
                modalities: ["text", "audio"],
              },
            }),
          );
        }, 500);
      });

      dc.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        handleServerEvent(event);
      });

      dc.addEventListener("close", () => {
        setIsConnected(false);
        setIsRecording(false);
        setConnectionStatus("Disconnected");
      });

      dc.addEventListener("error", () => {
        setConnectionStatus("Data channel error");
      });

      setConnectionStatus("Creating WebRTC offer...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      setConnectionStatus("Connecting to OpenAI...");
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`Failed to connect: ${sdpResponse.statusText}`);
      }

      const answerSdp = await sdpResponse.text();

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: answerSdp,
      };
      await pc.setRemoteDescription(answer);

      setConnectionStatus("WebRTC connected - waiting for data channel...");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start interview",
      );
      setIsConnected(false);
      setConnectionStatus("Connection failed");

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    }
  }, [handleServerEvent]);

  const stopSession = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }

    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setConnectionStatus("Not connected");
  }, []);

  const sendTextMessage = useCallback(async () => {
    if (
      !textInput.trim() ||
      !dataChannelRef.current ||
      dataChannelRef.current.readyState !== "open"
    ) {
      return;
    }

    setIsSendingText(true);
    const messageText = textInput.trim();
    setTextInput("");

    try {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: messageText,
          timestamp: new Date(),
          mode: "text",
        },
      ]);

      dataChannelRef.current.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text: messageText,
              },
            ],
          },
        }),
      );

      dataChannelRef.current.send(
        JSON.stringify({
          type: "response.create",
          response: {
            modalities: ["text", "audio"],
          },
        }),
      );
    } catch (err) {
      setError("Failed to send message");
    } finally {
      setIsSendingText(false);
    }
  }, [textInput]);

  const updateVADSettings = useCallback(
    (newDuration: number) => {
      setVadSettings((prev) => ({
        ...prev,
        silence_duration_ms: newDuration,
      }));

      if (dataChannelRef.current?.readyState === "open") {
        dataChannelRef.current.send(
          JSON.stringify({
            type: "session.update",
            session: {
              turn_detection: {
                type: "server_vad",
                threshold: vadSettings.threshold,
                prefix_padding_ms: 500,
                silence_duration_ms: newDuration,
              },
            },
          }),
        );
      }
    },
    [vadSettings.threshold],
  );

  const triggerResponse = useCallback(() => {
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === "open"
    ) {
      dataChannelRef.current.send(
        JSON.stringify({
          type: "response.create",
          response: {
            modalities: ["text", "audio"],
          },
        }),
      );
    }
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        isRTCConnected: isConnected,
        isRTCRecording: isRecording,
        isRTCSpeaking: isSpeaking,
        messagesRTC: messages,
        errorRTC: error,
        connectionStatusRTC: connectionStatus,
        allRTCEvents: allEvents,
        textInputRTC: textInput,
        setTextInputRTC: setTextInput,
        isSendingTextRTC: isSendingText,
        inputModeRTC: inputMode,
        setInputModeRTC: setInputMode,
        vadSettingsRTC: vadSettings,
        startRTCSession: startSession,
        stopRTCSession: stopSession,
        sendTextMessageRTC: sendTextMessage,
        updateVADSettingsRTC: updateVADSettings,
        triggerResponseRTC: triggerResponse,
        audioElementRefRTC: audioElementRef,
        peerConnectionRefRTC: pcRef,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};


