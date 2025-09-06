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
  const [currentState, setCurrentState] = useState<TimerState>("stopped");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastStartRef = useRef<number>(Date.now()); // блокировка после stop
  const inspectionStartRef = useRef<number | null>(null); // блокировка на 1 сек при инспекции

  const settings: TimerSettings = timerSettings || {
    useInspection: false,
    inspectionTime: 15,
    stackmatMode: false,
    hideTimeWhileSolving: false,
  };

  // Таймер обновления
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

  // Обработчик нажатия (start/stop)
  const handleTimerPress = useCallback(() => {
    const now = Date.now();

    if (currentState === "running") {
      // стоп таймера с задержкой <0.5 сек блокируется
      if (time < 100) return;
      setCurrentState("stopped");
      onTimeRecord(time);
      lastStartRef.current = now;
    } else if (currentState === "stopped") {
      // сброс таймера
      if (now - lastStartRef.current < 500) return; // блок 0.5 сек после стопа
      setCurrentState("ready");
      setTime(0);
      setStartTime(null);
      setInspectionTime(null);
    } else if (currentState === "ready") {
      // блокировка старта таймера на 0.5 сек после stop
      if (now - lastStartRef.current < 500) return;

      if (settings.useInspection) {
        setCurrentState("inspection");
        setInspectionTime(15 * 1000);
        inspectionStartRef.current = now;
      } else {
        setCurrentState("running");
        setStartTime(now);
        setTime(0);
      }
    }
  }, [currentState, time, onTimeRecord, settings.useInspection, settings.inspectionTime]);

  // Обработчик отпускания таймера (run после inspection)
  const handleTimerRelease = useCallback(() => {
    const now = Date.now();

    if (currentState === "ready") {
      if (settings.useInspection) {
        setCurrentState("inspection");
        setInspectionTime(settings.inspectionTime * 1000);
        inspectionStartRef.current = now;
      } else {
        setCurrentState("running");
        setStartTime(now);
        setTime(0);
      }
    } else if (currentState === "inspection") {
      // блокировка на первую секунду инспекции
      if (inspectionStartRef.current && now - inspectionStartRef.current < 1000) return;

      setCurrentState("running");
      setStartTime(now);
      setTime(0);
      setInspectionTime(null);
      inspectionStartRef.current = null;
    }
  }, [currentState, settings.useInspection, settings.inspectionTime]);

  // Контрол клавиатуры
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
