import React from "react";

interface MainTimerProps {
  time: number;
  inspectionTimeLeft: number | null;
  state: "stopped" | "inspection" | "ready" | "running";
  isSpacePressed: boolean;
  hideTime: boolean;
  onTimerClick: () => void;
  onTimerRelease: () => void;
  disabled?: boolean;
  showActions?: boolean;
  onPlusTwo?: () => void;
  onDNF?: () => void;
  onDelete?: () => void;
  onFavorite?: (comment: string) => void;
}

export const MainTimer: React.FC<MainTimerProps> = ({
  time,
  inspectionTimeLeft,
  state,
  isSpacePressed,
  hideTime,
  onTimerClick,
  onTimerRelease,
  disabled,
  showActions,
  onPlusTwo,
  onDNF,
  onDelete,
  onFavorite,
}) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes > 0 ? minutes + ":" : ""}${seconds.toString().padStart(2, "0")}.${centiseconds
      .toString()
      .padStart(2, "0")}`;
  };

  const displayTime =
    state === "inspection" && inspectionTimeLeft !== null
      ? inspectionTimeLeft.toString()
      : hideTime && state === "running"
      ? ""
      : formatTime(time);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full select-none"
      onMouseDown={!disabled ? onTimerClick : undefined}
      onMouseUp={!disabled ? onTimerRelease : undefined}
      onTouchStart={!disabled ? onTimerClick : undefined}
      onTouchEnd={!disabled ? onTimerRelease : undefined}
    >
      <div
        className={`text-6xl font-mono transition-colors ${
          state === "ready" ? "text-green-500" : ""
        } ${isSpacePressed ? "opacity-80" : ""}`}
      >
        {displayTime}
      </div>

      {showActions && (
        <div className="flex gap-2 mt-4 text-sm">
          {onPlusTwo && (
            <button onClick={onPlusTwo} className="px-2 py-1 rounded bg-blue-500 text-white">
              +2
            </button>
          )}
          {onDNF && (
            <button onClick={onDNF} className="px-2 py-1 rounded bg-red-500 text-white">
              DNF
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="px-2 py-1 rounded bg-gray-500 text-white">
              Delete
            </button>
          )}
          {onFavorite && (
            <button
              onClick={() => onFavorite("My favorite solve")}
              className="px-2 py-1 rounded bg-yellow-500 text-black"
            >
              ★
            </button>
          )}
        </div>
      )}
    </div>
  );
};
