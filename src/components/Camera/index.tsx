import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSocket } from "@/providers/SocketProvider";
import { useAuth } from "@/providers/Auth";
import { Heartbeat } from "@/lib/heartbeat";
import { useTranslations } from "next-intl";

const HAARCASCADE_URI = "/haarcascade_frontalface_alt.xml";

const CameraStream: React.FC<{
  isCameraOn: boolean;
  interviewId: string;
  interviewType: string;
}> = ({ isCameraOn, interviewId, interviewType }) => {
  const { user } = useAuth();
  const t = useTranslations("camera");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const { socket } = useSocket();
  const heartbeatInstance = useRef<Heartbeat | null>(null);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.play();
      }

      if (interviewType === "interview") {
        heartbeatInstance.current = new Heartbeat(
          videoRef.current,
          HAARCASCADE_URI,
          30,
          6,
          250
        );
        heartbeatInstance.current.init();
      }

      // Start recording and streaming as soon as the stream is available
      startRecording(mediaStream);
    } catch (err) {
      console.error("Error accessing camera and microphone:", err);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    stopRecording();

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (heartbeatInstance.current) {
      const heartbeat = heartbeatInstance.current.stop();

      console.log(heartbeat);
    }
  };

  const startRecording = (mediaStream: MediaStream) => {
    if (!socket) {
      console.error("Socket is not available");
      return;
    }

    const recorder = new MediaRecorder(mediaStream, { mimeType: "video/webm" });
    setMediaRecorder(recorder);

    console.log("Socket.io connection established for streaming");
    setIsUploading(true);

    // Send a message to the server to indicate the start of streaming
    socket.emit("start-streaming", {
      userId: user?.id,
      interviewId: interviewId,
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        // Send the chunk to the server
        socket.emit("stream-data", event.data);
      }
    };

    recorder.start(1000); // Collect data every 1 second
    toast.success(t("recordingStarted"));
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();

      if (!socket) {
        console.error("Socket is not available");
        return;
      }

      socket.emit("end-streaming");
      console.log("Socket.io connection closed");
      setIsUploading(false);

      toast.success(t("recordingStopped"));
    }
  };

  useEffect(() => {
    if (isCameraOn) {
      startVideo();
    } else {
      stopVideo();
    }
  }, [isCameraOn]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default CameraStream;
