"use client";

import { RealtimeProvider, useRealtime } from "@/providers/RealtimeProvider";
import { useRef } from "react";

function RealTimeDemo() {
  const { isRTCConnected,
    isRTCRecording,
    isRTCSpeaking,
    messagesRTC,
    errorRTC,
    connectionStatusRTC,
    allRTCEvents,
    textInputRTC,
    setInputModeRTC,
    setTextInputRTC,
    isSendingTextRTC,
    inputModeRTC,
    vadSettingsRTC,
    startRTCSession,
    stopRTCSession,
    sendTextMessageRTC,
    updateVADSettingsRTC,
    triggerResponseRTC,
    audioElementRefRTC,
  } = useRealtime();

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessageRTC();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">

          <div className="text-sm text-gray-600">
            Status: <span className="font-semibold">{connectionStatusRTC}</span>
          </div>
        </div>

        {errorRTC && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorRTC}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => isRTCConnected ? stopRTCSession() : startRTCSession()}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${isRTCConnected ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                  {isRTCConnected ? "End Interview" : "Start Interview"}
                </button>

                {isRTCConnected && (
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setInputModeRTC("audio")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${inputModeRTC === "audio"
                        ? "bg-white shadow text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                      Voice
                    </button>
                    <button
                      onClick={() => setInputModeRTC("text")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${inputModeRTC === "text"
                        ? "bg-white shadow text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                      Text
                    </button>
                  </div>
                )}

                {isRTCConnected && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${isRTCRecording
                          ? "bg-red-500 animate-pulse"
                          : "bg-gray-400"
                          }`}
                      />
                      <span className="text-sm text-gray-600">
                        {isRTCRecording ? "You're speaking" : "Listening"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${isRTCSpeaking
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gray-400"
                          }`}
                      />
                      <span className="text-sm text-gray-600">
                        {isRTCSpeaking ? "AI is speaking" : "AI ready"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {inputModeRTC === "text" && isRTCConnected && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={textInputRTC}
                      onChange={(e) => setTextInputRTC(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSendingTextRTC}
                    />
                    <button
                      onClick={sendTextMessageRTC}
                      disabled={!textInputRTC.trim() || isSendingTextRTC}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSendingTextRTC ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Conversation Transcript
              </h2>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {messagesRTC.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No messages yet. Start the interview to begin the conversation.
                  </p>
                ) : (
                  messagesRTC.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg ${msg.role === "assistant"
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "bg-gray-50 border-l-4 border-gray-500"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm flex items-center gap-2">
                          {msg.role === "assistant" ? "AI Interviewer" : "You"}
                          {msg.mode && (
                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                              {msg.mode === "audio" ? "Audio" : "Text"}
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-gray-800">{msg.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Debug Info</h2>

              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">WebRTC:</span>
                  <span
                    className={`font-semibold ${pcRef.current ? "text-green-600" : "text-red-600"}`}
                  >
                    {pcRef.current ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Channel:</span>
                  <span
                    className={`font-semibold ${dataChannelRef.current?.readyState === "open"
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {dataChannelRef.current?.readyState || "Closed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Input Mode:</span>
                  <span className="font-semibold">
                    {inputModeRTC === "audio" ? "Voice" : "Text"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Messages:</span>
                  <span className="font-semibold">{messagesRTC.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Events:</span>
                  <span className="font-semibold">{allRTCEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAD Delay:</span>
                  <span className="font-semibold">
                    {vadSettingsRTC.silence_duration_ms}ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Realtime() {
  return (
    <RealtimeProvider>
      <RealTimeDemo />
    </RealtimeProvider>
  )
}
