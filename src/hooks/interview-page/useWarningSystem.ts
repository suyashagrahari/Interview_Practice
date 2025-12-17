import { useState, useEffect, useCallback } from "react";
import type { WarningStatus, WarningData } from "@/lib/api/interview-realtime";

export const useWarningSystem = () => {
  // Initialize warning status from localStorage if available
  const getInitialWarningStatus = (): WarningStatus => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("interview-warning-status");
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error("Failed to load warning status:", error);
      }
    }
    return {
      warningCount: 0,
      isTerminated: false,
      canContinue: true,
      lastWarningAt: null,
    };
  };

  // Initialize tab switch count from localStorage if available
  const getInitialTabSwitchCount = (): number => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("interview-tab-switch-count");
        if (stored) {
          return parseInt(stored, 10);
        }
      } catch (error) {
        console.error("Failed to load tab switch count:", error);
      }
    }
    return 0;
  };

  const [warningStatus, setWarningStatus] = useState<WarningStatus>(
    getInitialWarningStatus
  );
  const [warningData, setWarningData] = useState<WarningData>({
    issued: false,
  });
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showInitialWarningModal, setShowInitialWarningModal] = useState(false);
  const [showTabSwitchModal, setShowTabSwitchModal] = useState(false);
  const [warningShownForCurrentCount, setWarningShownForCurrentCount] =
    useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(
    getInitialTabSwitchCount
  );

  // CRITICAL: Immediately save warning status changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "interview-warning-status",
          JSON.stringify(warningStatus)
        );
        localStorage.setItem(
          "interview-warning-count",
          warningStatus.warningCount.toString()
        );
        console.log("💾 Warning status immediately saved to localStorage:", warningStatus);
      } catch (error) {
        console.error("❌ Failed to save warning status to localStorage:", error);
      }
    }
  }, [warningStatus]);

  // CRITICAL: Immediately save tab switch count changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "interview-tab-switch-count",
          tabSwitchCount.toString()
        );
        console.log(
          "💾 Tab switch count immediately saved to localStorage:",
          tabSwitchCount
        );
      } catch (error) {
        console.error(
          "❌ Failed to save tab switch count to localStorage:",
          error
        );
      }
    }
  }, [tabSwitchCount]);

  const updateWarningStatusFromBackend = useCallback((data: {
    warningCount?: number;
    isTerminated?: boolean;
    canContinue?: boolean;
    lastWarningAt?: string | null;
  }) => {
    const newWarningStatus: WarningStatus = {
      warningCount: data.warningCount ?? warningStatus.warningCount,
      isTerminated: data.isTerminated ?? warningStatus.isTerminated,
      canContinue: data.canContinue ?? warningStatus.canContinue,
      lastWarningAt: data.lastWarningAt ?? warningStatus.lastWarningAt,
    };

    setWarningStatus(newWarningStatus);

    // Immediately save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "interview-warning-status",
        JSON.stringify(newWarningStatus)
      );
      if (data.warningCount !== undefined) {
        localStorage.setItem(
          "interview-warning-count",
          data.warningCount.toString()
        );
      }
    }
  }, [warningStatus]);

  return {
    warningStatus,
    setWarningStatus,
    warningData,
    setWarningData,
    showWarningModal,
    setShowWarningModal,
    showInitialWarningModal,
    setShowInitialWarningModal,
    showTabSwitchModal,
    setShowTabSwitchModal,
    warningShownForCurrentCount,
    setWarningShownForCurrentCount,
    tabSwitchCount,
    setTabSwitchCount,
    updateWarningStatusFromBackend,
  };
};
