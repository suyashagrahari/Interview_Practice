import React, { RefObject } from "react";
import { VideoOff } from "lucide-react";
import { VideoOverlays } from "./VideoOverlays";
import type { Interviewer } from "@/lib/api/interviewer";
import type {
  AudioData,
  QuestionData,
} from "../../../types/interview-page/interview.types";

interface VideoSectionProps {
  isDarkMode: boolean;
  cameraStream: MediaStream | null;
  cameraPermission: "pending" | "granted" | "denied";
  isVideoOn: boolean;
  videoRef: RefObject<HTMLVideoElement>;
  safeVideoPlay: (video: HTMLVideoElement) => Promise<void>;
  requestCameraPermission: () => Promise<MediaStream>;
  handleToggleVideo: () => void;
  warningStatus: any; // Use proper WarningStatus type
  isRecording: boolean;
  isInterviewStarted: boolean;
  interviewerData: Interviewer | null;
  isLoadingInterviewerData: boolean;
  onInterviewerClick: () => void;
  isSpeechInitializing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isListening: boolean;
  speechRecognitionError: string | null;
  retrySpeechRecognition: () => void;
  showHint: boolean;
  onHintToggle: () => void;
  currentQuestionData: QuestionData;
  isAudioPlaying: boolean;
  currentAudio: AudioData | null;
  selectedAvatarVideoSrc?: string;
  onAvatarClick: () => void;
  isAnalyzing: boolean;
  showSubtitles: boolean;
  webkitInterimTranscript: string;
  speechDisabled: boolean;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  isDarkMode,
  cameraStream,
  cameraPermission,
  isVideoOn,
  videoRef,
  safeVideoPlay,
  requestCameraPermission,
  handleToggleVideo,
  warningStatus,
  ...overlayProps
}) => {
  return (
    <div className="flex-1 mb-6 min-h-0">
      <div
        className={`h-full relative rounded-2xl overflow-hidden shadow-2xl ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
        } ${
          warningStatus.warningCount > 0 && !warningStatus.isTerminated
            ? warningStatus.warningCount === 1
              ? "warning-border-yellow"
              : "warning-border-red"
            : ""
        }`}>
        {cameraStream ? (
          <div className="w-full h-full relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
              onLoadedMetadata={() => {
                console.log("🎥 Video metadata loaded in element");
                if (videoRef.current) {
                  safeVideoPlay(videoRef.current);
                }
              }}
              onCanPlay={() => {
                console.log("🎥 Video can play in element");
                if (videoRef.current) {
                  safeVideoPlay(videoRef.current);
                }
              }}
              onLoadedData={() => {
                console.log("🎥 Video data loaded");
                if (videoRef.current) {
                  safeVideoPlay(videoRef.current);
                }
              }}
              onError={(e) => console.error("🎥 Video error in element:", e)}
            />

            <VideoOverlays
              {...overlayProps}
              isDarkMode={isDarkMode}
              isRecordingState={overlayProps.isRecording}
            />
          </div>
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center ${
              isDarkMode ? "bg-slate-800" : "bg-slate-100"
            }`}>
            {cameraPermission === "denied" ? (
              <>
                <VideoOff
                  className={`w-16 h-16 mb-4 ${
                    isDarkMode ? "text-red-400" : "text-red-500"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                  Camera Access Denied
                </h3>
                <p
                  className={`text-sm text-center mb-4 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                  Please enable camera access to continue with the interview.
                </p>
                <button
                  onClick={() => requestCameraPermission()}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}>
                  Enable Camera
                </button>
              </>
            ) : !isVideoOn ? (
              <>
                <VideoOff
                  className={`w-16 h-16 mb-4 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                  Camera is Off
                </h3>
                <p
                  className={`text-sm text-center mb-4 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                  Click the video button to turn on your camera.
                </p>
                <button
                  onClick={handleToggleVideo}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}>
                  Turn On Camera
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
