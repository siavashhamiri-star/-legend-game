import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TranslationDictionary } from '../types/chess.ts';

interface GameOverModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onRematch: () => void;
  onClose: () => void;
  t: TranslationDictionary;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  title,
  message,
  onRematch,
  onClose,
  t,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#241e19] border-2 border-[#f0c04a] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="text-4xl mb-2 select-none">🏆</div>
        <h2 className="text-2xl font-black text-[#f0c04a] mb-2 tracking-wide">
          {title}
        </h2>
        <p className="text-base font-medium text-stone-200 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onRematch}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-500/20 active:scale-98 cursor-pointer"
          >
            {t.rematch}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#3a322b] hover:bg-[#4a3f36] text-stone-300 font-medium text-sm transition-colors cursor-pointer border border-stone-600/50"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
