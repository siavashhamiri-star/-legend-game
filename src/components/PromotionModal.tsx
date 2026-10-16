import React from 'react';
import { Color, PieceType, PieceStyle, TranslationDictionary } from '../types/chess.ts';
import { ChessPiece } from './ChessPiece.tsx';

interface PromotionModalProps {
  color: Color;
  pieceStyle: PieceStyle;
  onSelect: (piece: PieceType) => void;
  t: TranslationDictionary;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  color,
  pieceStyle,
  onSelect,
  t
}) => {
  const options: { type: PieceType; label: string }[] = [
    { type: 'q', label: t.queen },
    { type: 'r', label: t.rook },
    { type: 'b', label: t.bishop },
    { type: 'n', label: t.knight }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#241e19] border-2 border-[#f0c04a] rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <h3 className="text-lg font-bold text-[#f0c04a] mb-1">
          👑 {t.promotePawnTitle}
        </h3>
        <p className="text-xs text-stone-300 mb-4">
          {t.promoteDescription}
        </p>

        <div className="grid grid-cols-4 gap-2.5">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              className="group flex flex-col items-center justify-center p-3 rounded-xl bg-[#3a322b] hover:bg-[#5a4630] border border-stone-600 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              <div className="w-10 h-10 mb-1 flex items-center justify-center">
                <ChessPiece type={opt.type} color={color} style={pieceStyle} />
              </div>
              <span className="text-xs font-semibold text-stone-200 group-hover:text-amber-300">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
