import React from 'react';
import { ChessPiece } from './ChessPiece.tsx';
import { PieceType, PieceStyle, Color } from '../types/chess.ts';

interface CapturedPiecesProps {
  capturedWhite: PieceType[]; // pieces captured from White (Black has captured them)
  capturedBlack: PieceType[]; // pieces captured from Black (White has captured them)
  pieceStyle: PieceStyle;
}

const PIECE_WEIGHTS: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  capturedWhite,
  capturedBlack,
  pieceStyle
}) => {
  const whiteScore = capturedBlack.reduce((acc, p) => acc + PIECE_WEIGHTS[p], 0);
  const blackScore = capturedWhite.reduce((acc, p) => acc + PIECE_WEIGHTS[p], 0);
  const whiteAdvantage = whiteScore - blackScore;

  // Sort pieces by value
  const sortPieces = (pieces: PieceType[]) =>
    [...pieces].sort((a, b) => PIECE_WEIGHTS[b] - PIECE_WEIGHTS[a]);

  return (
    <div className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-[#1e1914] border border-[#5a4630]/40 rounded-lg text-xs">
      {/* Captured by White (Black's lost pieces) */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[11px] font-semibold text-stone-400">⚪</span>
        <div className="flex items-center -space-x-1.5">
          {sortPieces(capturedBlack).map((type, idx) => (
            <div key={`b-${type}-${idx}`} className="w-5 h-5 flex-shrink-0">
              <ChessPiece type={type} color="b" style={pieceStyle} />
            </div>
          ))}
        </div>
        {whiteAdvantage > 0 && (
          <span className="text-[11px] font-mono font-bold text-emerald-400">
            +{whiteAdvantage}
          </span>
        )}
      </div>

      {/* Captured by Black (White's lost pieces) */}
      <div className="flex items-center gap-1.5 overflow-x-auto justify-end">
        {whiteAdvantage < 0 && (
          <span className="text-[11px] font-mono font-bold text-amber-400">
            +{Math.abs(whiteAdvantage)}
          </span>
        )}
        <div className="flex items-center -space-x-1.5">
          {sortPieces(capturedWhite).map((type, idx) => (
            <div key={`w-${type}-${idx}`} className="w-5 h-5 flex-shrink-0">
              <ChessPiece type={type} color="w" style={pieceStyle} />
            </div>
          ))}
        </div>
        <span className="text-[11px] font-semibold text-stone-400">⚫</span>
      </div>
    </div>
  );
};
