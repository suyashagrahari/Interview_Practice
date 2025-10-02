"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ProctoringData {
  tabSwitches: number;
  copyPasteCount: number;
  faceDetection: boolean;
  mobileDetection: boolean;
  laptopDetection: boolean;
  zoomIn: boolean;
  zoomOut: boolean;
  startTime: Date | null;
  endTime: Date | null;
  timeSpent: number;
}

interface UseProctoringReturn {
  proctoringData: ProctoringData;
  startProctoring: () => void;
  stopProctoring: () => void;
  resetProctoring: () => void;
  isProctoring: boolean;
}

export const useProctoring = (): UseProctoringReturn => {
  // Try to restore proctoring violations from localStorage on mount
  const getInitialProctoringData = (): ProctoringData => {
    if (typeof window === 'undefined') {
      return {
        tabSwitches: 0,
        copyPasteCount: 0,
        faceDetection: false,
        mobileDetection: false,
        laptopDetection: false,
        zoomIn: false,
        zoomOut: false,
        startTime: null,
        endTime: null,
        timeSpent: 0,
      };
    }

    try {
      const storedViolations = localStorage.getItem('interview-proctoring-violations');
      if (storedViolations) {
        const violations = JSON.parse(storedViolations);
        return {
          tabSwitches: violations.tabSwitches || 0,
          copyPasteCount: violations.copyPasteCount || 0,
          faceDetection: false,
          mobileDetection: false,
          laptopDetection: false,
          zoomIn: false,
          zoomOut: false,
          startTime: null,
          endTime: null,
          timeSpent: 0,
        };
      }
    } catch (error) {
      console.error('Failed to restore proctoring data:', error);
    }

    return {
      tabSwitches: 0,
      copyPasteCount: 0,
      faceDetection: false,
      mobileDetection: false,
      laptopDetection: false,
      zoomIn: false,
      zoomOut: false,
      startTime: null,
      endTime: null,
      timeSpent: 0,
    };
  };

  const [proctoringData, setProctoringData] = useState<ProctoringData>(getInitialProctoringData);

  const [isProctoring, setIsProctoring] = useState(false);
  const startTimeRef = useRef<Date | null>(null);
  const tabSwitchCountRef = useRef(proctoringData.tabSwitches);
  const copyPasteCountRef = useRef(proctoringData.copyPasteCount);
  const lastFocusTimeRef = useRef<Date | null>(null);

  // Detect tab switches
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      tabSwitchCountRef.current += 1;
      setProctoringData(prev => ({
        ...prev,
        tabSwitches: tabSwitchCountRef.current,
      }));
    } else {
      lastFocusTimeRef.current = new Date();
    }
  }, []);

  // Detect copy/paste events
  const handleCopyPaste = useCallback((e: ClipboardEvent) => {
    if (isProctoring) {
      copyPasteCountRef.current += 1;
      setProctoringData(prev => ({
        ...prev,
        copyPasteCount: copyPasteCountRef.current,
      }));
    }
  }, [isProctoring]);

  // Detect zoom events
  const handleZoom = useCallback(() => {
    const zoomLevel = window.devicePixelRatio;
    setProctoringData(prev => ({
      ...prev,
      zoomIn: zoomLevel > 1.5,
      zoomOut: zoomLevel < 0.8,
    }));
  }, []);

  // Detect device type
  const detectDevice = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isLaptop = /windows|macintosh|linux/i.test(userAgent) && !isMobile;
    
    setProctoringData(prev => ({
      ...prev,
      mobileDetection: isMobile,
      laptopDetection: isLaptop,
    }));
  }, []);

  // Simulate face detection (in real implementation, this would use camera API)
  const simulateFaceDetection = useCallback(() => {
    // This is a placeholder - in real implementation, you'd use camera API
    const hasFace = Math.random() > 0.1; // 90% chance of face detection
    setProctoringData(prev => ({
      ...prev,
      faceDetection: hasFace,
    }));
  }, []);

  // Start proctoring
  const startProctoring = useCallback(() => {
    setIsProctoring(true);
    startTimeRef.current = new Date();
    lastFocusTimeRef.current = new Date();
    
    setProctoringData(prev => ({
      ...prev,
      startTime: startTimeRef.current,
      tabSwitches: 0,
      copyPasteCount: 0,
    }));

    // Reset counters
    tabSwitchCountRef.current = 0;
    copyPasteCountRef.current = 0;

    // Detect device type
    detectDevice();
    
    // Simulate face detection
    simulateFaceDetection();
  }, [detectDevice, simulateFaceDetection]);

  // Stop proctoring
  const stopProctoring = useCallback(() => {
    setIsProctoring(false);
    const endTime = new Date();
    const timeSpent = startTimeRef.current 
      ? Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000)
      : 0;

    setProctoringData(prev => ({
      ...prev,
      endTime,
      timeSpent,
    }));
  }, []);

  // Reset proctoring data
  const resetProctoring = useCallback(() => {
    setIsProctoring(false);
    startTimeRef.current = null;
    lastFocusTimeRef.current = null;
    tabSwitchCountRef.current = 0;
    copyPasteCountRef.current = 0;

    setProctoringData({
      tabSwitches: 0,
      copyPasteCount: 0,
      faceDetection: false,
      mobileDetection: false,
      laptopDetection: false,
      zoomIn: false,
      zoomOut: false,
      startTime: null,
      endTime: null,
      timeSpent: 0,
    });
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (isProctoring) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("copy", handleCopyPaste);
      document.addEventListener("paste", handleCopyPaste);
      window.addEventListener("resize", handleZoom);

      // Check zoom level periodically
      const zoomInterval = setInterval(handleZoom, 1000);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        document.removeEventListener("copy", handleCopyPaste);
        document.removeEventListener("paste", handleCopyPaste);
        window.removeEventListener("resize", handleZoom);
        clearInterval(zoomInterval);
      };
    }
  }, [isProctoring, handleVisibilityChange, handleCopyPaste, handleZoom]);

  // Update time spent periodically
  useEffect(() => {
    if (isProctoring && startTimeRef.current) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeSpent = Math.floor((now.getTime() - startTimeRef.current!.getTime()) / 1000);
        setProctoringData(prev => ({
          ...prev,
          timeSpent,
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isProctoring]);

  return {
    proctoringData,
    startProctoring,
    stopProctoring,
    resetProctoring,
    isProctoring,
  };
};


