import { useState, useCallback, useRef } from "react";
import { INTERVIEW_CONSTANTS } from "../constants/interview.constants";

export const useCameraManagement = () => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [cameraTested, setCameraTested] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  // Video play queue to prevent concurrent play requests
  const playQueueRef = useRef<boolean>(false);
  const currentPlayPromiseRef = useRef<Promise<void> | null>(null);

  // Safe video play function that handles AbortError and prevents concurrent calls
  const safeVideoPlay = useCallback(
    async (videoElement: HTMLVideoElement): Promise<void> => {
      // If there's already a play request in progress, wait for it to complete
      if (currentPlayPromiseRef.current) {
        try {
          await currentPlayPromiseRef.current;
        } catch (error) {
          console.log(
            "Previous play request completed with error (this is normal)"
          );
        }
      }

      // If video is already playing, don't try to play again
      if (!videoElement.paused) {
        return;
      }

      try {
        playQueueRef.current = true;
        const playPromise = videoElement.play();
        currentPlayPromiseRef.current = playPromise;

        await playPromise;
        console.log("🎥 Video playing successfully");
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.log(
              "🎥 Video play request was aborted (this is normal when switching streams)"
            );
          } else if (error.name === "NotAllowedError") {
            console.log(
              "🎥 Video play was blocked by browser policy (user interaction required)"
            );
          } else {
            console.error("🎥 Video play failed:", error);
          }
        } else {
          console.error("🎥 Video play failed with unknown error:", error);
        }
      } finally {
        playQueueRef.current = false;
        currentPlayPromiseRef.current = null;
      }
    },
    []
  );

  const requestCameraPermission = useCallback(
    async (permissionsAlreadyGranted: boolean = false) => {
      try {
        // Skip pending state if permissions were already granted for faster startup
        if (!permissionsAlreadyGranted) {
          setCameraPermission("pending");
        }
        console.log("🎥 Requesting camera permission...");

        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera not supported in this browser");
        }

        // Reduced timeout for faster startup
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error("Camera request timeout")),
            INTERVIEW_CONSTANTS.CAMERA.TIMEOUT
          );
        });

        const streamPromise = navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: INTERVIEW_CONSTANTS.CAMERA.VIDEO_WIDTH },
            height: { ideal: INTERVIEW_CONSTANTS.CAMERA.VIDEO_HEIGHT },
            facingMode: INTERVIEW_CONSTANTS.CAMERA.FACING_MODE,
          },
          audio: true,
        });

        const stream = (await Promise.race([
          streamPromise,
          timeoutPromise,
        ])) as MediaStream;
        console.log("🎥 Camera permission granted, stream received:", stream);

        setCameraStream(stream);
        setCameraPermission("granted");
        setIsVideoOn(true);

        return stream;
      } catch (error) {
        console.error("🎥 Camera permission error:", error);
        setCameraPermission("denied");
        throw error;
      }
    },
    []
  );

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsVideoOn(false);
    }
  }, [cameraStream]);

  const handleToggleVideo = useCallback(() => {
    if (isVideoOn) {
      // Turn off video
      if (cameraStream) {
        const videoTrack = cameraStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = false;
        }
      }
      setIsVideoOn(false);
    } else {
      // Turn on video
      if (cameraStream) {
        const videoTrack = cameraStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = true;
        }
        setIsVideoOn(true);
      } else {
        // Request camera permission if no stream
        requestCameraPermission();
      }
    }
  }, [isVideoOn, cameraStream, requestCameraPermission]);

  return {
    cameraStream,
    setCameraStream,
    cameraPermission,
    setCameraPermission,
    cameraTested,
    setCameraTested,
    isVideoOn,
    setIsVideoOn,
    safeVideoPlay,
    requestCameraPermission,
    stopCamera,
    handleToggleVideo,
  };
};
