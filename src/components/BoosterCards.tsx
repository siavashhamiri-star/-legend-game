import React from 'react';
import { BoosterTier, BoosterState, Color, TranslationDictionary } from '../types/chess.ts';

interface BoosterCardsProps {
  currentTurn: Color;
  usedBoosters: BoosterState;
  activeBooster: BoosterTier | null;
  isGameOver: boolean;
  unlockedPlatinum?: boolean;
  onActivate: (tier: BoosterTier) => void;
  t: TranslationDictionary;
}

export const BoosterCards: React.FC<BoosterCardsProps> = ({
  currentTurn,
  usedBoosters,
  activeBooster,
  isGameOver,
  unlockedPlatinum = false,
  onActivate,
  t,
}) => {
  const cards: { id: BoosterTier; label: string; icon: string; bgClass: string; duration: number }[] = [
    {
      id: 'bronze',
      label: t.bronze,
      icon: '🥉',
      bgClass: 'from-amber-700 via-amber-600 to-amber-800 text-amber-100 border-amber-500/40 shadow-amber-950/40',
      duration: 45
    },
    {
      id: 'silver',
      label: t.silver,
      icon: '🥈',
      bgClass: 'from-slate-300 via-gray-200 to-slate-400 text-slate-900 border-slate-300 shadow-slate-950/40',
      duration: 50
    },
    {
      id: 'gold',
      label: t.gold,
      icon: '🥇',
      bgClass: 'from-yellow-400 via-amber-300 to-yellow-500 text-amber-950 border-amber-300 shadow-yellow-950/40',
      duration: 55
    }
  ];

  if (unlockedPlatinum) {
    cards.push({
      id: 'platinum',
      label: t.platinum,
      icon: '💎',
      bgClass: 'from-cyan-300 via-sky-200 to-indigo-400 text-slate-950 border-cyan-200 shadow-cyan-950/40 font-black',
      duration: 65
    });
  }

  return (
    <div className="w-full bg-[#241e19] border border-[#5a4630]/60 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-stone-300">
            {t.cardsHeader}
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-stone-800/80 text-amber-300/90 font-mono">
            {currentTurn === 'w' ? 'White' : 'Black'}
          </span>
        </div>
        {activeBooster && (
          <span className="text-xs font-bold text-amber-400 animate-pulse flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {t.boosterActive}
          </span>
        )}
      </div>

      <div className={`grid gap-2 ${unlockedPlatinum ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {cards.map((card) => {
          const isUsed = usedBoosters[card.id];
          const isActive = activeBooster === card.id;
          const isDisabled = isGameOver || isUsed || !!activeBooster;

          return (
            <button
              key={card.id}
              onClick={() => onActivate(card.id)}
              disabled={isDisabled}
              className={`relative overflow-hidden group flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg font-bold text-[11px] sm:text-xs border transition-all duration-200 ${
                card.bgClass
              } ${
                isActive
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-[#241e19] scale-[1.02] shadow-xl'
                  : 'shadow-md'
              } ${
                isDisabled
                  ? 'opacity-35 cursor-not-allowed saturate-50'
                  : 'cursor-pointer hover:scale-[1.03] active:scale-[0.98]'
              }`}
              title={`${card.label} (+${card.duration}s)`}
            >
              {/* Subtle metallic shine highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-sm select-none">{card.icon}</span>
                <span className="tracking-tight whitespace-nowrap">{card.label}</span>
              </div>

              <div className="text-[10px] font-mono opacity-85">
                {isUsed ? (
                  <span className="line-through text-red-950 font-semibold">SPENT</span>
                ) : (
                  <span>+{card.duration}s</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
