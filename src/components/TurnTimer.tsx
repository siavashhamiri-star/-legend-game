import React from 'react';
import { Color, TranslationDictionary, BoosterTier } from '../types/chess.ts';

interface TurnTimerProps {
  currentTurn: Color;
  remainingSeconds: number;
  totalAllowedSeconds: number;
  isCheck: boolean;
  isGameOver: boolean;
  activeBooster: BoosterTier | null;
  statusMessage: string;
  t: TranslationDictionary;
}

export const TurnTimer: React.FC<TurnTimerProps> = ({
  currentTurn,
  remainingSeconds,
  totalAllowedSeconds,
  isCheck,
  isGameOver,
  activeBooster,
  statusMessage,
  t,
}) => {
  const isLow = remainingSeconds <= 5 && !isGameOver;
  const percentage = isGameOver ? 0 : Math.max(0, Math.min(100, (remainingSeconds / totalAllowedSeconds) * 100));

  const turnLabel = isGameOver
    ? t.gameOver
    : currentTurn === 'w'
    ? t.whiteTurn
    : t.blackTurn;

  return (
    <div className="w-full bg-[#241e19] border border-[#5a4630]/60 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3.5 h-3.5 rounded-full border shadow-sm transition-colors ${
              currentTurn === 'w' ? 'bg-white border-stone-400' : 'bg-stone-900 border-stone-600'
            }`}
          />
          <span className="text-base sm:text-lg font-bold text-stone-100 tracking-wide">
            {turnLabel}
          </span>

          {isCheck && !isGameOver && (
            <span className="text-xs px-2 py-0.5 rounded bg-red-600/90 text-white font-semibold animate-pulse">
              {t.check}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span
            className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums transition-colors duration-150 ${
              isLow ? 'text-red-400 animate-pulse' : 'text-amber-400'
            }`}
            style={{ direction: 'ltr' }}
          >
            {remainingSeconds.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-stone-400">s</span>
        </div>
      </div>

      {/* Progress countdown bar */}
      <div className="h-2.5 bg-[#3a322b] rounded-full mt-2.5 overflow-hidden p-0.5 border border-stone-800">
        <div
          className={`h-full rounded-full transition-all duration-100 ease-linear ${
            isLow
              ? 'bg-gradient-to-r from-red-600 to-rose-500'
              : activeBooster
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {statusMessage && (
        <div className="mt-2 text-center text-xs sm:text-sm font-semibold text-amber-300 min-h-[20px]">
          {statusMessage}
        </div>
      )}
    </div>
  );
};
