"use client";

import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    cocoSsd: any;
  }
}

interface ComputerVisionStats {
  currentPeople: number;
  currentPhones: number;
  multiplePersonIncidents: number;
  phoneDetections: number;
  violations: Array<{
    type: string;
    timestamp: Date;
    count: number;
  }>;
}

interface ComputerVisionHook {
  stats: ComputerVisionStats;
  isModelLoaded: boolean;
  isVideoReady: boolean;
  isLoading: boolean;
  initializeComputerVision: (videoElement: HTMLVideoElement) => void;
  cleanup: () => void;
}

export const useComputerVision = (): ComputerVisionHook => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [model, setModel] = useState<any>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const detectionRef = useRef<number>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stats, setStats] = useState<ComputerVisionStats>({
    currentPeople: 0,
    currentPhones: 0,
    multiplePersonIncidents: 0,
    phoneDetections: 0,
    violations: [],
  });

  // Load TensorFlow.js and COCO-SSD model
  useEffect(() => {
    const loadScripts = async (retryCount = 0) => {
      try {
        // Check if scripts are already loaded (for page reloads)
        if (window.tf && window.cocoSsd) {
          console.log('[PROCTORING] Scripts already loaded, initializing...');
          setScriptLoaded(true);
          setIsLoading(false);
          return;
        }

        console.log(`[PROCTORING] Loading computer vision scripts (attempt ${retryCount + 1})...`);

        // First, ensure TensorFlow.js is loaded
        if (!window.tf) {
          await new Promise((resolve, reject) => {
            const tfScript = document.createElement('script');
            tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.15.0/dist/tf.min.js';
            tfScript.crossOrigin = 'anonymous';
            tfScript.async = true;
            tfScript.defer = true;
            
            const timeout = setTimeout(() => {
              console.error('[PROCTORING] TensorFlow.js loading timeout');
              reject(new Error('TensorFlow.js loading timeout'));
            }, 10000); // 10 second timeout
            
            tfScript.onload = () => {
              clearTimeout(timeout);
              console.log('[PROCTORING] TensorFlow.js initialized');
              resolve(true);
            };
            
            tfScript.onerror = () => {
              clearTimeout(timeout);
              console.error('[PROCTORING] Failed to load TensorFlow.js, trying fallback...');
              // Try fallback URL
              const fallbackScript = document.createElement('script');
              fallbackScript.src = 'https://unpkg.com/@tensorflow/tfjs@4.15.0/dist/tf.min.js';
              fallbackScript.crossOrigin = 'anonymous';
              fallbackScript.async = true;
              fallbackScript.defer = true;
              
              fallbackScript.onload = () => {
                console.log('[PROCTORING] TensorFlow.js loaded from fallback');
                resolve(true);
              };
              
              fallbackScript.onerror = () => {
                console.error('[PROCTORING] All TensorFlow.js sources failed');
                reject(new Error('Failed to load TensorFlow.js from all sources'));
              };
              
              document.head.appendChild(fallbackScript);
            };
            
            document.head.appendChild(tfScript);
          });
        }

        // Wait a bit for TensorFlow to fully initialize
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Then load COCO-SSD model
        if (!window.cocoSsd) {
          await new Promise((resolve, reject) => {
            const cocoSsdScript = document.createElement('script');
            cocoSsdScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js';
            cocoSsdScript.crossOrigin = 'anonymous';
            cocoSsdScript.async = true;
            cocoSsdScript.defer = true;
            
            const timeout = setTimeout(() => {
              console.error('[PROCTORING] COCO-SSD loading timeout');
              reject(new Error('COCO-SSD loading timeout'));
            }, 15000); // 15 second timeout
            
            cocoSsdScript.onload = () => {
              clearTimeout(timeout);
              console.log('[PROCTORING] Computer vision model loaded');
              setScriptLoaded(true);
              setIsLoading(false);
              resolve(true);
            };
            
            cocoSsdScript.onerror = () => {
              clearTimeout(timeout);
              console.error('[PROCTORING] Failed to load COCO-SSD model, trying fallback...');
              // Try fallback URL
              const fallbackScript = document.createElement('script');
              fallbackScript.src = 'https://unpkg.com/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js';
              fallbackScript.crossOrigin = 'anonymous';
              fallbackScript.async = true;
              fallbackScript.defer = true;
              
              fallbackScript.onload = () => {
                console.log('[PROCTORING] COCO-SSD loaded from fallback');
                setScriptLoaded(true);
                setIsLoading(false);
                resolve(true);
              };
              
              fallbackScript.onerror = () => {
                console.error('[PROCTORING] All COCO-SSD sources failed');
                reject(new Error('Failed to load COCO-SSD model from all sources'));
              };
              
              document.head.appendChild(fallbackScript);
            };
            
            document.head.appendChild(cocoSsdScript);
          });
        } else {
          setScriptLoaded(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[PROCTORING] Error loading computer vision scripts:', error);
        
        // Retry up to 3 times with increasing delay
        if (retryCount < 3) {
          const delay = (retryCount + 1) * 2000; // 2s, 4s, 6s
          console.log(`[PROCTORING] Retrying in ${delay/1000} seconds...`);
          setTimeout(() => {
            loadScripts(retryCount + 1);
          }, delay);
        } else {
          console.error('[PROCTORING] Failed to load computer vision scripts after 3 attempts');
        }
      }
    };

    loadScripts();
  }, []);

  // Load model when script is loaded
  useEffect(() => {
    if (scriptLoaded && window.cocoSsd && window.tf) {
      const loadModel = async () => {
        try {
          console.log('[PROCTORING] Initializing detection model...');
          
          // Ensure TensorFlow.js is ready
          if (!window.tf.ready) {
            console.log('[PROCTORING] Waiting for TensorFlow.js to be ready...');
            await window.tf.ready();
          }
          
          const loadedModel = await window.cocoSsd.load();
          setModel(loadedModel);
          setModelLoaded(true);
          console.log('[PROCTORING] Detection system ready');
        } catch (error) {
          console.error('[PROCTORING] Error loading model:', error);
          // Retry after a delay
          setTimeout(() => {
            if (scriptLoaded && window.cocoSsd && window.tf) {
              loadModel();
            }
          }, 3000);
        }
      };
      loadModel();
    }
  }, [scriptLoaded]);

  // Create canvas element for detection (invisible for professional appearance)
  const createCanvas = useCallback(() => {
    if (!canvasRef.current && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '10';
      canvas.style.opacity = '0'; // Make completely invisible
      canvas.style.visibility = 'hidden'; // Hide from view
      
      // Insert canvas after video element
      videoRef.current.parentElement?.appendChild(canvas);
      canvasRef.current = canvas;
      console.log('[PROCTORING] Detection system initialized');
    }
  }, []);

  // Initialize computer vision with video element
  const initializeComputerVision = useCallback((videoElement: HTMLVideoElement) => {
    // Prevent multiple initializations
    if (isInitialized && videoRef.current === videoElement) {
      console.log('[PROCTORING] Already initialized with this video element');
      return;
    }

    // Clean up previous initialization if exists
    if (videoRef.current && videoRef.current !== videoElement) {
      console.log('[PROCTORING] Cleaning up previous video element');
      cleanup();
    }

    videoRef.current = videoElement;
    setIsInitialized(true);
    
    const handleVideoLoaded = () => {
      // Wait for video to have valid dimensions
      if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
        setVideoReady(true);
        createCanvas();
        
        if (canvasRef.current) {
          canvasRef.current.width = videoElement.videoWidth;
          canvasRef.current.height = videoElement.videoHeight;
          console.log(`[PROCTORING] Video feed ready: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
        }
      } else {
        console.log('[PROCTORING] Waiting for video dimensions...');
        // Try again after a short delay
        setTimeout(() => {
          if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
            setVideoReady(true);
            createCanvas();
            
            if (canvasRef.current) {
              canvasRef.current.width = videoElement.videoWidth;
              canvasRef.current.height = videoElement.videoHeight;
              console.log(`[PROCTORING] Video feed ready (delayed): ${videoElement.videoWidth}x${videoElement.videoHeight}`);
            }
          }
        }, 500);
      }
    };

    const handleLoadedMetadata = () => {
      console.log(`[PROCTORING] Video metadata loaded: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
      handleVideoLoaded();
    };

    // Add multiple event listeners to ensure we catch when video is ready
    videoElement.addEventListener('loadeddata', handleVideoLoaded);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('canplay', handleVideoLoaded);

    // If video is already loaded, call handler immediately
    if (videoElement.readyState >= 2) {
      handleVideoLoaded();
    }

    return () => {
      videoElement.removeEventListener('loadeddata', handleVideoLoaded);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('canplay', handleVideoLoaded);
    };
  }, [createCanvas, isInitialized]);

  // Check for violations
  const checkViolations = useCallback((peopleCount: number, phoneCount: number) => {
    const now = new Date();
    
    if (peopleCount > 1) {
      console.warn(`[PROCTORING] Multiple people detected: ${peopleCount} people at ${now.toLocaleTimeString()}`);
      
      setStats((prev) => {
        // Only update if this is a new incident
        if (prev.multiplePersonIncidents === 0 || peopleCount > prev.multiplePersonIncidents) {
          return {
            ...prev,
            multiplePersonIncidents: prev.multiplePersonIncidents + 1,
            violations: [
              ...prev.violations,
              {
                type: "MULTIPLE_PEOPLE",
                timestamp: now,
                count: peopleCount,
              },
            ],
          };
        }
        return prev;
      });
    }

    if (phoneCount > 0) {
      console.warn(`[PROCTORING] Mobile device detected: ${phoneCount} device(s) at ${now.toLocaleTimeString()}`);
      
      setStats((prev) => {
        // Only update if this is a new detection
        if (prev.phoneDetections === 0 || phoneCount > prev.phoneDetections) {
          return {
            ...prev,
            phoneDetections: prev.phoneDetections + 1,
            violations: [
              ...prev.violations,
              {
                type: "PHONE_DETECTED",
                timestamp: now,
                count: phoneCount,
              },
            ],
          };
        }
        return prev;
      });
    }

    // Log current stats every 30 seconds (less frequent for professional logging)
    if (Math.floor(now.getTime() / 1000) % 30 === 0) {
      console.log('[PROCTORING] Status:', {
        people: peopleCount,
        devices: phoneCount,
        violations: stats.violations.length,
        incidents: stats.multiplePersonIncidents + stats.phoneDetections
      });
    }
  }, [stats.violations.length, stats.multiplePersonIncidents, stats.phoneDetections]);

  // Main detection function
  const detectObjects = useCallback(async () => {
    if (!model || !videoRef.current || !canvasRef.current || !videoReady) {
      detectionRef.current = requestAnimationFrame(detectObjects);
      return;
    }

    // Check if video has valid dimensions
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      detectionRef.current = requestAnimationFrame(detectObjects);
      return;
    }

    // Check if video is playing and has valid stream
    if (video.paused || video.ended || !video.srcObject) {
      detectionRef.current = requestAnimationFrame(detectObjects);
      return;
    }

    try {
      const predictions = await model.detect(video);
      const context = canvasRef.current.getContext("2d");

      if (!context) {
        detectionRef.current = requestAnimationFrame(detectObjects);
        return;
      }

      // Ensure canvas has proper dimensions
      if (canvasRef.current.width !== video.videoWidth || canvasRef.current.height !== video.videoHeight) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
      }

      // Clear canvas (but don't draw anything - keep it invisible)
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      let peopleCount = 0;
      let phoneCount = 0;

      predictions.forEach((prediction: any) => {
        if (prediction.score > 0.6) {
          if (prediction.class === "person") peopleCount++;
          if (prediction.class === "cell phone") phoneCount++;

          // No visual drawing - just detection for professional appearance
          // Detection data is logged to console for debugging
        }
      });

      // Update stats only if values have changed to prevent infinite loops
      setStats((prev) => {
        if (prev.currentPeople !== peopleCount || prev.currentPhones !== phoneCount) {
          return {
            ...prev,
            currentPeople: peopleCount,
            currentPhones: phoneCount,
          };
        }
        return prev;
      });

      // Check for violations
      checkViolations(peopleCount, phoneCount);

    } catch (error) {
      console.error('[PROCTORING] Detection error:', error);
      // If there's an error, wait a bit before trying again
      setTimeout(() => {
        detectionRef.current = requestAnimationFrame(detectObjects);
      }, 1000);
      return;
    }

    detectionRef.current = requestAnimationFrame(detectObjects);
  }, [model, videoReady, checkViolations]);

  // Start detection when everything is ready
  useEffect(() => {
    if (modelLoaded && videoReady && videoRef.current) {
      console.log('[PROCTORING] Detection system active');
      
      // Add a small delay to ensure video is fully ready
      const startDetection = () => {
        if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
          detectObjects();
        } else {
          setTimeout(startDetection, 1000);
        }
      };
      
      startDetection();
    }

    return () => {
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
        console.log('[PROCTORING] Detection system stopped');
      }
    };
  }, [modelLoaded, videoReady, detectObjects]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (detectionRef.current) {
      cancelAnimationFrame(detectionRef.current);
      detectionRef.current = undefined;
    }
    
    if (canvasRef.current) {
      canvasRef.current.remove();
      canvasRef.current = null;
    }
    
    videoRef.current = null;
    setIsInitialized(false);
    setVideoReady(false);
    
    console.log('[PROCTORING] System cleanup completed');
  }, []);

  return {
    stats,
    isModelLoaded: modelLoaded,
    isVideoReady: videoReady,
    isLoading,
    initializeComputerVision,
    cleanup,
  };
};
