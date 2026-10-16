import { Chess, Square } from 'chess.js';
import { BotDifficulty, BoosterTier } from '../types/chess.ts';

// Piece values in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Simplified piece-square tables (from white perspective)
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_PST = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_PST = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_PST_MID = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

function getSquareIndex(square: Square, color: 'w' | 'b'): number {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square[1], 10) - 1;
  // If white, rank 7 is top of board in array (index 0..7)
  const r = color === 'w' ? 7 - rank : rank;
  return r * 8 + file;
}

function evaluateBoard(game: Chess): number {
  let score = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type] || 0;
      let pst = 0;
      const sq = (String.fromCharCode('a'.charCodeAt(0) + c) + (8 - r)) as Square;
      const idx = getSquareIndex(sq, piece.color);

      switch (piece.type) {
        case 'p': pst = PAWN_PST[idx] || 0; break;
        case 'n': pst = KNIGHT_PST[idx] || 0; break;
        case 'b': pst = BISHOP_PST[idx] || 0; break;
        case 'r': pst = ROOK_PST[idx] || 0; break;
        case 'q': pst = QUEEN_PST[idx] || 0; break;
        case 'k': pst = KING_PST_MID[idx] || 0; break;
      }

      const totalVal = val + pst;
      if (piece.color === 'w') {
        score += totalVal;
      } else {
        score -= totalVal;
      }
    }
  }

  return score;
}

export function chooseBotMove(
  fen: string,
  difficulty: BotDifficulty
): { from: string; to: string; promotion?: string } | null {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Easy mode: Choose random or simple capture
  if (difficulty === 'easy') {
    const captures = moves.filter(m => m.captured);
    if (captures.length > 0 && Math.random() < 0.6) {
      const randomCapture = captures[Math.floor(Math.random() * captures.length)];
      return { from: randomCapture.from, to: randomCapture.to, promotion: 'q' };
    }
    const randMove = moves[Math.floor(Math.random() * moves.length)];
    return { from: randMove.from, to: randMove.to, promotion: 'q' };
  }

  const isMaximizing = game.turn() === 'w';
  const depth = difficulty === 'medium' ? 2 : 3;

  let bestMove = moves[0];
  let bestScore = isMaximizing ? -Infinity : Infinity;

  // Prioritize captures and checks for faster alpha-beta pruning
  const sortedMoves = [...moves].sort((a, b) => {
    const aScore = (a.captured ? 10 : 0) + (a.san.includes('+') ? 5 : 0);
    const bScore = (b.captured ? 10 : 0) + (b.san.includes('+') ? 5 : 0);
    return bScore - aScore;
  });

  for (const move of sortedMoves) {
    game.move(move);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return { from: bestMove.from, to: bestMove.to, promotion: 'q' };
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    if (game.isCheckmate()) {
      return isMaximizing ? -50000 : 50000;
    }
    if (game.isDraw()) {
      return 0;
    }
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return evaluateBoard(game);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Check if bot should trigger a tactical booster
export function shouldBotUseBooster(
  remainingSec: number,
  usedBoosters: { bronze: boolean; silver: boolean; gold: boolean },
  activeBooster: BoosterTier | null
): BoosterTier | null {
  if (activeBooster !== null) return null;

  // If time is below 5s, try gold -> silver -> bronze
  if (remainingSec <= 5) {
    if (!usedBoosters.gold) return 'gold';
    if (!usedBoosters.silver) return 'silver';
    if (!usedBoosters.bronze) return 'bronze';
  } else if (remainingSec <= 10) {
    // If under 10s and has bronze or silver
    if (!usedBoosters.bronze) return 'bronze';
    if (!usedBoosters.silver) return 'silver';
  }

  return null;
}
