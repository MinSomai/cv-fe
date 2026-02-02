"use client";

import React, { useState, useEffect } from "react";
import { LiveAvatarContextProvider } from "@/components/LiveAvatar";
import { RealtimeProvider } from "@/providers/RealtimeProvider";
import Interview from "./InterviewNew";
import { InterviewContext } from "./page";

export default function InterviewInit(props: InterviewContext) {
  const [sessionToken, setSessionToken] = useState("");
  const [mode, setMode] = useState<"FULL" | "CUSTOM">("FULL");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const shouldSkipLoader = process.env.NEXT_PUBLIC_SKIP_LOADER === "true";
  const autoStartMode = process.env.NEXT_PUBLIC_AUTO_START_MODE as
    | "FULL"
    | "CUSTOM"
    | undefined;

  useEffect(() => {
    // Auto-trigger session start if env is configured
    if (shouldSkipLoader && autoStartMode) {
      if (autoStartMode === "CUSTOM") {
        handleStartCustom();
      } else if (autoStartMode === "FULL") {
        handleStart();
      }
    }
  }, []);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/start-session", {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        setError(error.error);
        return;
      }
      const { session_token } = await res.json();
      setSessionToken(session_token);
      setMode("FULL");
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCustom = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/start-custom-session", {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        setError(error.error);
        return;
      }
      const { session_token } = await res.json();
      setSessionToken(session_token);
      setMode("CUSTOM");
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSessionStopped = () => {
    setSessionToken("");
  };

  // Show loading state if auto-starting
  if (shouldSkipLoader && !sessionToken && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Starting session...
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!sessionToken ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
              {"Error getting session token: " + error}
            </div>
          )}
          {!shouldSkipLoader && (
            <div className="flex gap-4">
              <button
                onClick={handleStart}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {isLoading ? "Starting..." : "Start Full Avatar Session"}
              </button>
              <button
                onClick={handleStartCustom}
                disabled={isLoading}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {isLoading ? "Starting..." : "Start Custom Avatar Session"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <LiveAvatarSession
          mode={mode}
          sessionAccessToken={sessionToken}
          onSessionStopped={onSessionStopped}
          interviewInfo={props}
        />
      )}
    </>
  );
}

const LiveAvatarSession: React.FC<{
  mode: "FULL" | "CUSTOM";
  sessionAccessToken: string;
  onSessionStopped: () => void;
  interviewInfo: InterviewContext;
}> = ({ mode, sessionAccessToken, onSessionStopped, interviewInfo }) => {
  return (
    <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
      <RealtimeProvider>
        <Interview
          mode={mode}
          onSessionStopped={onSessionStopped}
          interviewInfo={interviewInfo}
        />
      </RealtimeProvider>
    </LiveAvatarContextProvider>
  );
};
