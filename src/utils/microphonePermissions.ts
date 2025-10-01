/**
 * Utility functions for handling microphone permissions and speech recognition setup
 */

export interface MicrophonePermissionResult {
  granted: boolean;
  error?: string;
  canRetry: boolean;
}

/**
 * Request microphone permission from the user
 */
export const requestMicrophonePermission = async (): Promise<MicrophonePermissionResult> => {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        granted: false,
        error: "Microphone access is not supported in this browser",
        canRetry: false,
      };
    }

    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: true,
      video: false 
    });
    
    // Stop the stream immediately as we only needed permission
    stream.getTracks().forEach(track => track.stop());
    
    console.log("🎤 Microphone permission granted");
    return {
      granted: true,
      canRetry: true,
    };
    
  } catch (error) {
    console.error("🎤 Microphone permission denied:", error);
    
    let errorMessage = "Microphone access denied";
    let canRetry = true;
    
    if (error instanceof Error) {
      switch (error.name) {
        case "NotAllowedError":
          errorMessage = "Microphone access was denied. Please allow microphone access in your browser settings and refresh the page.";
          canRetry = true;
          break;
        case "NotFoundError":
          errorMessage = "No microphone found. Please connect a microphone and try again.";
          canRetry = true;
          break;
        case "NotReadableError":
          errorMessage = "Microphone is being used by another application. Please close other applications using the microphone.";
          canRetry = true;
          break;
        case "OverconstrainedError":
          errorMessage = "Microphone constraints cannot be satisfied.";
          canRetry = false;
          break;
        case "SecurityError":
          errorMessage = "Microphone access blocked due to security restrictions.";
          canRetry = false;
          break;
        default:
          errorMessage = `Microphone error: ${error.message}`;
          canRetry = true;
      }
    }
    
    return {
      granted: false,
      error: errorMessage,
      canRetry,
    };
  }
};

/**
 * Request camera permission from the user
 */
export const requestCameraPermission = async (): Promise<MicrophonePermissionResult> => {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        granted: false,
        error: "Camera access is not supported in this browser",
        canRetry: false,
      };
    }

    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true,
      audio: false 
    });
    
    // Stop the stream immediately as we only needed permission
    stream.getTracks().forEach(track => track.stop());
    
    console.log("📷 Camera permission granted");
    return {
      granted: true,
      canRetry: true,
    };
    
  } catch (error) {
    console.error("📷 Camera permission denied:", error);
    
    let errorMessage = "Camera access denied";
    let canRetry = true;
    
    if (error instanceof Error) {
      switch (error.name) {
        case "NotAllowedError":
          errorMessage = "Camera access was denied. Please allow camera access in your browser settings and refresh the page.";
          canRetry = true;
          break;
        case "NotFoundError":
          errorMessage = "No camera found. Please connect a camera and try again.";
          canRetry = true;
          break;
        case "NotReadableError":
          errorMessage = "Camera is being used by another application. Please close other applications using the camera.";
          canRetry = true;
          break;
        case "OverconstrainedError":
          errorMessage = "Camera constraints cannot be satisfied.";
          canRetry = false;
          break;
        case "SecurityError":
          errorMessage = "Camera access blocked due to security restrictions.";
          canRetry = false;
          break;
        default:
          errorMessage = `Camera error: ${error.message}`;
          canRetry = true;
      }
    }
    
    return {
      granted: false,
      error: errorMessage,
      canRetry,
    };
  }
};

/**
 * Check if microphone permission is already granted
 */
export const checkMicrophonePermission = async (): Promise<boolean> => {
  try {
    if (!navigator.permissions) {
      // Fallback: try to access microphone directly
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    }
    
    const permission = await navigator.permissions.query({ name: "microphone" as PermissionName });
    return permission.state === "granted";
  } catch (error) {
    console.error("🎤 Error checking microphone permission:", error);
    return false;
  }
};

/**
 * Check if speech recognition is supported in the current browser
 */
export const isSpeechRecognitionSupported = (): boolean => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Get the appropriate SpeechRecognition constructor for the current browser
 */
export const getSpeechRecognition = (): typeof SpeechRecognition | null => {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

/**
 * Get browser-specific error messages for speech recognition
 */
export const getBrowserCompatibilityMessage = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome')) {
    return "Chrome detected - Full speech recognition support available";
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return "Safari detected - Speech recognition support available";
  } else if (userAgent.includes('edge')) {
    return "Edge detected - Speech recognition support available";
  } else if (userAgent.includes('firefox')) {
    return "Firefox detected - Limited speech recognition support. For best experience, use Chrome, Edge, or Safari.";
  } else {
    return "Browser compatibility unknown. For best speech recognition experience, use Chrome, Edge, or Safari.";
  }
};

/**
 * Request both camera and microphone permissions
 */
export const requestMediaPermissions = async (): Promise<{
  camera: MicrophonePermissionResult;
  microphone: MicrophonePermissionResult;
  allGranted: boolean;
}> => {
  console.log("🎥🎤 Requesting camera and microphone permissions...");
  
  const [cameraResult, microphoneResult] = await Promise.all([
    requestCameraPermission(),
    requestMicrophonePermission()
  ]);
  
  const allGranted = cameraResult.granted && microphoneResult.granted;
  
  console.log("🎥 Camera permission:", cameraResult.granted ? "✅ Granted" : "❌ Denied");
  console.log("🎤 Microphone permission:", microphoneResult.granted ? "✅ Granted" : "❌ Denied");
  
  return {
    camera: cameraResult,
    microphone: microphoneResult,
    allGranted
  };
};

/**
 * Initialize speech recognition with proper error handling
 */
export const initializeSpeechRecognition = async (): Promise<{
  success: boolean;
  error?: string;
  SpeechRecognition?: typeof SpeechRecognition;
}> => {
  try {
    // Check browser support
    if (!isSpeechRecognitionSupported()) {
      return {
        success: false,
        error: "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
      };
    }

    // Check microphone permission
    const permissionResult = await requestMicrophonePermission();
    if (!permissionResult.granted) {
      return {
        success: false,
        error: permissionResult.error || "Microphone permission required for speech recognition",
      };
    }

    // Get SpeechRecognition constructor
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      return {
        success: false,
        error: "Speech recognition API not available",
      };
    }

    console.log("🎤 Speech recognition initialized successfully");
    return {
      success: true,
      SpeechRecognition,
    };
    
  } catch (error) {
    console.error("🎤 Failed to initialize speech recognition:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
