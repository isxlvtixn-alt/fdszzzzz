import { useState, useEffect, useCallback, useRef } from "react";

export type TimerState = "ready" | "inspection" | "running" | "stopped";

export interface TimerSettings {
  useInspection: boolean;
  inspectionTime: number;
  stackmatMode: boolean;
  hideTimeWhileSolving: boolean;
}

export interface TimerHookResult {
  time: number;
  inspectionTimeLeft: number | null;
  state: TimerState;
  isSpacePressed: boolean;
  hideTime: boolean;
  handleTimerClick: () => void;
  handleTimerRelease: () => void;
}

export const useTimer = (
  onTimeRecord: (time: number) => void,
  onInspectionTimeout?: () => void,
  timerSettings?: TimerSettings,
  disabled?: boolean
): TimerHookResult => {
  const [time, setTime] = useState(0);
  const [inspectionTimeLeft, setInspectionTime] = useState<number | null>(null);
  const [currentState, setCurrentState] = useState<TimerState>("ready");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const settings: TimerSettings = timerSettings || {
    useInspection: false,
    inspectionTime: 15,
    stackmatMode: false,
    hideTimeWhileSolving: false,
  };

  // Timer update loop
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (currentState === "running" && startTime) {
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else if (currentState === "inspection" && inspectionTimeLeft !== null) {
      intervalRef.current = setInterval(() => {
        setInspectionTime((prev) => {
          if (prev === null) return null;
          if (prev <= 0) {
            setCurrentState("stopped");
            onInspectionTimeout?.();
            return null;
          }
          return prev - 100;
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentState, startTime, inspectionTimeLeft, onInspectionTimeout]);

  // Universal press handler
  const handleTimerPress = useCallback(() => {
    if (currentState === "running") {
      // Stop timer
      setCurrentState("stopped");
      onTimeRecord(time);
    } else if (currentState === "stopped") {
      // Reset timer
      setCurrentState("ready");
      setTime(0);
      setStartTime(null);
      setInspectionTime(null);
    }
  }, [currentState, time, onTimeRecord]);

  // Universal release handler
  const handleTimerRelease = useCallback(() => {
    if (currentState === "ready") {
      if (settings.useInspection) {
        setCurrentState("inspection");
        setInspectionTime(settings.inspectionTime * 1000);
      } else {
        setCurrentState("running");
        const now = Date.now();
        setStartTime(now);
        setTime(0);
      }
    } else if (currentState === "inspection") {
      setCurrentState("running");
      const now = Date.now();
      setStartTime(now);
      setTime(0);
      setInspectionTime(null);
    }
  }, [currentState, settings.useInspection, settings.inspectionTime]);

  // Keyboard controls
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const activeElement = document.activeElement as HTMLElement | null;
        const isInputActive =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA" ||
          activeElement?.isContentEditable;
        const isModalOpen = document.querySelector('[role="dialog"]');

        if (!isInputActive && !isModalOpen) {
          e.preventDefault();
          if (!isSpacePressed) {
            setIsSpacePressed(true);
            handleTimerPress();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const activeElement = document.activeElement as HTMLElement | null;
        const isInputActive =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA" ||
          activeElement?.isContentEditable;
        const isModalOpen = document.querySelector('[role="dialog"]');

        if (!isInputActive && !isModalOpen) {
          e.preventDefault();
          setIsSpacePressed(false);
          handleTimerRelease();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpacePressed, handleTimerPress, handleTimerRelease, disabled]);

  return {
    time,
    inspectionTimeLeft: inspectionTimeLeft ? Math.ceil(inspectionTimeLeft / 1000) : null,
    state: currentState,
    isSpacePressed,
    hideTime: settings.hideTimeWhileSolving,
    handleTimerClick: handleTimerPress,
    handleTimerRelease,
  };
};
