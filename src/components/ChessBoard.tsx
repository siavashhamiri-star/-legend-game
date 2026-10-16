import React from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPiece } from './ChessPiece.tsx';
import { BoardTheme, PieceStyle, Color } from '../types/chess.ts';

interface ChessBoardProps {
  game: Chess;
  selectedSquare: Square | null;
  validTargets: Square[];
  lastMove: { from: Square; to: Square } | null;
  flipped: boolean;
  theme: BoardTheme;
  pieceStyle: PieceStyle;
  onSquareClick: (square: Square) => void;
  isGameOver: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const THEMES: Record<BoardTheme, { light: string; dark: string; border: string }> = {
  walnut: {
    light: '#e8d4a8',
    dark: '#a8774a',
    border: '#5a4630'
  },
  emerald: {
    light: '#eeeed2',
    dark: '#769656',
    border: '#455933'
  },
  slate: {
    light: '#e2e8f0',
    dark: '#64748b',
    border: '#334155'
  },
  amber: {
    light: '#fef3c7',
    dark: '#d97706',
    border: '#78350f'
  },
  apadana: {
    light: '#ccfbf1',
    dark: '#0f766e',
    border: '#b45309'
  },
  persepolis: {
    light: '#e7e5e4',
    dark: '#78350f',
    border: '#451a03'
  },
  camelot: {
    light: '#f1f5f9',
    dark: '#1e3a8a',
    border: '#172554'
  },
  colosseum: {
    light: '#fef3c7',
    dark: '#881337',
    border: '#4c0519'
  },
  olympus: {
    light: '#e0f2fe',
    dark: '#0284c7',
    border: '#0369a1'
  },
  pyramids: {
    light: '#fef9c3',
    dark: '#854d0e',
    border: '#713f12'
  },
  sakura: {
    light: '#fff1f2',
    dark: '#881337',
    border: '#4c0519'
  },
  petra: {
    light: '#ffe4e6',
    dark: '#9f1239',
    border: '#4c0519'
  },
  fjords: {
    light: '#e2e8f0',
    dark: '#334155',
    border: '#0f172a'
  },
  topkapi: {
    light: '#f0fdf4',
    dark: '#0f766e',
    border: '#b91c1c'
  },
  forbidden_city: {
    light: '#fef3c7',
    dark: '#991b1b',
    border: '#ca8a04'
  },
  taj_mahal: {
    light: '#f8fafc',
    dark: '#065f46',
    border: '#d97706'
  }
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  selectedSquare,
  validTargets,
  lastMove,
  flipped,
  theme,
  pieceStyle,
  onSquareClick,
  isGameOver,
}) => {
  const currentTheme = THEMES[theme] || THEMES.walnut;
  const board = game.board();
  const inCheck = game.inCheck();
  const currentTurn = game.turn();

  // Find king square if in check
  let checkSquare: Square | null = null;
  if (inCheck) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === currentTurn) {
          checkSquare = (FILES[c] + (8 - r)) as Square;
          break;
        }
      }
      if (checkSquare) break;
    }
  }

  // Create 8x8 squares according to flipped state
  const squares: { r: number; c: number; squareName: Square }[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const r = flipped ? 7 - i : i;
      const c = flipped ? 7 - j : j;
      const squareName = (FILES[c] + (8 - r)) as Square;
      squares.push({ r, c, squareName });
    }
  }

  return (
    <div
      className="relative w-full max-w-[min(92vw,500px)] aspect-square rounded-xl p-2.5 shadow-2xl transition-all duration-300"
      style={{
        backgroundColor: '#241e19',
        border: `4px solid ${currentTheme.border}`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div
        className="w-full h-full grid grid-cols-8 grid-rows-8 rounded overflow-hidden select-none"
        style={{ direction: 'ltr' }}
      >
        {squares.map(({ r, c, squareName }) => {
          const piece = board[r][c];
          const isLight = (r + c) % 2 === 0;
          const isSelected = selectedSquare === squareName;
          const isTarget = validTargets.includes(squareName);
          const isLastMoveSquare =
            lastMove && (lastMove.from === squareName || lastMove.to === squareName);
          const isCheckKing = checkSquare === squareName;

          // Rank / File coordinate labels
          const showFileLabel = flipped ? r === 0 : r === 7;
          const showRankLabel = flipped ? c === 7 : c === 0;

          return (
            <button
              key={squareName}
              type="button"
              onClick={() => onSquareClick(squareName)}
              disabled={isGameOver}
              className={`relative flex items-center justify-center cursor-pointer transition-colors focus:outline-none p-1 ${
                isCheckKing
                  ? '!bg-[#e5483b]'
                  : isSelected
                  ? '!bg-[#f0c04a]'
                  : ''
              } ${
                isLastMoveSquare && !isSelected && !isCheckKing
                  ? 'ring-inset ring-4 ring-[#f0c04a]/75'
                  : ''
              }`}
              style={{
                backgroundColor: isCheckKing
                  ? '#e5483b'
                  : isSelected
                  ? '#f0c04a'
                  : isLight
                  ? currentTheme.light
                  : currentTheme.dark,
              }}
              title={squareName}
              aria-label={`Square ${squareName}${piece ? ` with ${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}` : ''}`}
            >
              {/* File coordinate label */}
              {showFileLabel && (
                <span
                  className="absolute bottom-0.5 right-1 text-[10px] sm:text-[11px] font-bold opacity-60 pointer-events-none select-none"
                  style={{ color: isLight ? currentTheme.dark : currentTheme.light }}
                >
                  {FILES[c]}
                </span>
              )}

              {/* Rank coordinate label */}
              {showRankLabel && (
                <span
                  className="absolute top-0.5 left-1 text-[10px] sm:text-[11px] font-bold opacity-60 pointer-events-none select-none"
                  style={{ color: isLight ? currentTheme.dark : currentTheme.light }}
                >
                  {8 - r}
                </span>
              )}

              {/* Target dot or capture ring */}
              {isTarget && (
                <div
                  className={`absolute z-10 pointer-events-none ${
                    piece
                      ? 'w-full h-full border-4 border-[#f0c04a]/90 rounded-sm'
                      : 'w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black/25 dark:bg-black/35 shadow-inner'
                  }`}
                />
              )}

              {/* Piece */}
              {piece && (
                <div className="w-[82%] h-[82%] flex items-center justify-center z-1">
                  <ChessPiece
                    type={piece.type}
                    color={piece.color}
                    style={pieceStyle}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
