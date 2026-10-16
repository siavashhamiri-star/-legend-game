export type Color = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type BoosterTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface BoosterState {
  bronze: boolean;
  silver: boolean;
  gold: boolean;
  platinum?: boolean;
}

export interface PlayerVipTools {
  unlockedPlatinum: boolean;
  oracleHintsRemaining: number;
  hasFlagShield: boolean;
}

export interface PlayerBoosters {
  w: BoosterState;
  b: BoosterState;
}

export type GameMode = 'pass-and-play' | 'vs-bot';
export type BotDifficulty = 'easy' | 'medium' | 'hard';
export type BoardTheme =
  | 'walnut'
  | 'emerald'
  | 'slate'
  | 'amber'
  | 'apadana'
  | 'persepolis'
  | 'camelot'
  | 'colosseum'
  | 'olympus'
  | 'pyramids'
  | 'sakura'
  | 'petra'
  | 'fjords'
  | 'topkapi'
  | 'forbidden_city'
  | 'taj_mahal';

export type PieceStyle =
  | 'achaemenid'
  | 'india'
  | 'ottoman'
  | 'china'
  | 'england'
  | 'rome'
  | 'greece'
  | 'egypt'
  | 'japan'
  | 'arabia'
  | 'nordic'
  | 'vector'
  | 'classic';

export interface Civilization {
  id: PieceStyle;
  nameFa: string;
  nameEn: string;
  flag: string;
  country: string;
  kingNameFa: string;
  kingNameEn: string;
  queenNameFa: string;
  queenNameEn: string;
  boardTheme: BoardTheme;
  descriptionFa: string;
  descriptionEn: string;
  bannerColor: string;
}

export interface LeagueTier {
  id: string;
  nameFa: string;
  nameEn: string;
  minRating: number;
  maxRating: number;
  badge: string;
  color: string;
}

export interface PlayerProfile {
  name: string;
  rating: number;
  xp: number;
  league: string;
  coins: number;
  wins: number;
  losses: number;
  unlockedThemes: string[];
}

export interface MoveRecord {
  from: string;
  to: string;
  piece: PieceType;
  color: Color;
  san: string;
  captured?: PieceType;
  promotion?: PieceType;
  boosterUsed?: BoosterTier;
  fen: string;
}

export type Language = 'fa' | 'en';

export interface TranslationDictionary {
  title: string;
  subTitle: string;
  langBtn: string;
  whiteTurn: string;
  blackTurn: string;
  gameOver: string;
  check: string;
  boosterActive: string;
  cardsHeader: string;
  bronze: string;
  silver: string;
  gold: string;
  newGame: string;
  flip: string;
  undo: string;
  whiteWon: string;
  blackWon: string;
  timeOut: string;
  winnerMsg: string;
  checkmate: string;
  stalemate: string;
  draw: string;
  mode: string;
  passAndPlay: string;
  vsBot: string;
  botLevel: string;
  easy: string;
  medium: string;
  hard: string;
  botThinking: string;
  sound: string;
  soundOn: string;
  soundOff: string;
  theme: string;
  walnutTheme: string;
  emeraldTheme: string;
  slateTheme: string;
  amberTheme: string;
  pieceStyle: string;
  vectorStyle: string;
  classicStyle: string;
  moveHistory: string;
  noMoves: string;
  capturedPieces: string;
  promotePawnTitle: string;
  promoteDescription: string;
  baseTimer: string;
  queen: string;
  rook: string;
  bishop: string;
  knight: string;
  rematch: string;
  resigned: string;
  tacticalTip: string;
  achaemenidStyle: string;
  apadanaTheme: string;
  persepolisTheme: string;
  academy: string;
  league: string;
  shop: string;
  disclaimer: string;
  legalNoticeTitle: string;
  officialDisclaimerText: string;
  close: string;
  daricCoins: string;
  watchAdForDarics: string;
  watchAdSuccess: string;
  buyPackage: string;
  myRank: string;
  totalPoints: string;
  chatrangPhilosophyTitle: string;
  chatrangPhilosophyBody: string;
  platinum: string;
  royalUndo: string;
  flagShield: string;
  youtube: string;
}
