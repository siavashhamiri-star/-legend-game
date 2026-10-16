import React, { useRef, useEffect } from 'react';
import { MoveRecord, TranslationDictionary } from '../types/chess.ts';

interface MoveHistoryProps {
  history: MoveRecord[];
  t: TranslationDictionary;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history, t }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Group into pairs (White move, Black move)
  const movePairs: { num: number; white: MoveRecord; black?: MoveRecord }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1]
    });
  }

  return (
    <div className="w-full bg-[#1e1914] border border-[#5a4630]/40 rounded-xl p-3 shadow-md flex flex-col">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-800 text-xs text-stone-400 font-semibold">
        <span>📜 {t.moveHistory}</span>
        <span className="font-mono text-[11px] text-amber-400">
          {history.length} {history.length === 1 ? 'ply' : 'plies'}
        </span>
      </div>

      <div
        ref={containerRef}
        className="max-h-36 overflow-y-auto space-y-1 font-mono text-xs pr-1"
        style={{ direction: 'ltr' }}
      >
        {movePairs.length === 0 ? (
          <div className="text-center py-4 text-stone-500 italic text-[11px]">
            {t.noMoves}
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.num}
              className="flex items-center justify-between px-2 py-1 rounded bg-[#28221b] hover:bg-[#342c23] transition-colors text-stone-200"
            >
              <span className="w-6 text-stone-500 font-semibold">{pair.num}.</span>
              <div className="flex-1 flex items-center gap-1 font-semibold text-amber-100">
                <span>{pair.white.san}</span>
                {pair.white.boosterUsed && (
                  <span className="text-[10px]" title={`Booster: ${pair.white.boosterUsed}`}>
                    {pair.white.boosterUsed === 'bronze' ? '🥉' : pair.white.boosterUsed === 'silver' ? '🥈' : '🥇'}
                  </span>
                )}
              </div>
              <div className="flex-1 flex items-center gap-1 font-semibold text-stone-400 justify-end">
                {pair.black ? (
                  <>
                    <span>{pair.black.san}</span>
                    {pair.black.boosterUsed && (
                      <span className="text-[10px]" title={`Booster: ${pair.black.boosterUsed}`}>
                        {pair.black.boosterUsed === 'bronze' ? '🥉' : pair.black.boosterUsed === 'silver' ? '🥈' : '🥇'}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-stone-600">-</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
