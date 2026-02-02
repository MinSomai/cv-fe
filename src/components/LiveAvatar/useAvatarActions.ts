import { useCallback } from "react";
import { useLiveAvatarContext } from "./context";
import { useRealtime } from "@/providers/RealtimeProvider";

export const useAvatarActions = (mode: "FULL" | "CUSTOM") => {
  const { sessionRef } = useLiveAvatarContext();
  const realtime = useRealtime();

  const interrupt = useCallback(() => {
    return sessionRef.current!.interrupt();
  }, [sessionRef]);

  const repeat = useCallback(
    async (message: string) => {
      if (mode === "FULL") {
        return sessionRef.current!.repeat(message);
      } else if (mode === "CUSTOM") {
        const res = await fetch("/api/elevenlabs-text-to-speech", {
          method: "POST",
          body: JSON.stringify({ text: message }),
        });

        // if (realtime.peerConnectionRefRTC?.current) {
        //   realtime.peerConnectionRefRTC.current.ontrack = (e) => {
        //     console.log("ontrack speaking AI: ", e.streams[0]);
        //   };
        // }

        const { audio } = await res.json();
        return sessionRef.current!.repeatAudio(audio);
      }
    },
    [sessionRef, mode],
  );

  const startListening = useCallback(() => {
    return sessionRef.current!.startListening();
  }, [sessionRef]);

  const stopListening = useCallback(() => {
    return sessionRef.current!.stopListening();
  }, [sessionRef]);

  return {
    interrupt,
    repeat,
    startListening,
    stopListening,
  };
};
