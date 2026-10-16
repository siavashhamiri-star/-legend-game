/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import {
  Language,
  Color,
  PieceType,
  BoosterTier,
  PlayerBoosters,
  GameMode,
  BotDifficulty,
  BoardTheme,
  PieceStyle,
  MoveRecord
} from './types/chess.ts';
import { translations } from './utils/i18n.ts';
import {
  playMoveSound,
  playCaptureSound,
  playCheckSound,
  playBoosterSound,
  playLowTimeTick,
  playVictoryFanfare
} from './utils/audio.ts';
import { chooseBotMove, shouldBotUseBooster } from './utils/ai.ts';
import { ChessBoard } from './components/ChessBoard.tsx';
import { TurnTimer } from './components/TurnTimer.tsx';
import { BoosterCards } from './components/BoosterCards.tsx';
import { CapturedPieces } from './components/CapturedPieces.tsx';
import { MoveHistory } from './components/MoveHistory.tsx';
import { PromotionModal } from './components/PromotionModal.tsx';
import { GameOverModal } from './components/GameOverModal.tsx';
import { AcademyModal } from './components/AcademyModal.tsx';
import { LeagueModal } from './components/LeagueModal.tsx';
import { TreasuryModal } from './components/TreasuryModal.tsx';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal.tsx';
import { CommunityRewardModal } from './components/CommunityRewardModal.tsx';
import { CivilizationModal } from './components/CivilizationModal.tsx';
import { AndroidBuildModal } from './components/AndroidBuildModal.tsx';
import { CIVILIZATIONS } from './utils/civilizations.ts';
import {
  RotateCcw,
  RefreshCw,
  Undo2,
  Volume2,
  VolumeX,
  Settings,
  Trophy,
  BookOpen,
  Coins,
  Scale,
  Gift,
  Globe2,
  Smartphone,
  Sparkles
} from 'lucide-react';

const BOOSTERS_CONFIG: Record<BoosterTier, number> = {
  bronze: 45,
  silver: 50,
  gold: 55,
  platinum: 65,
};

export default function App() {
  // Localization
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('worldplay_lang') as Language) || 'fa';
  });
  const t = translations[lang];

  // Base turn & custom settings
  const [baseTurnSeconds, setBaseTurnSeconds] = useState<number>(30);
  const [gameMode, setGameMode] = useState<GameMode>('pass-and-play');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('apadana');
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>('achaemenid');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [enableMetallurgy, setEnableMetallurgy] = useState<boolean>(() => {
    return localStorage.getItem('worldplay_enable_metallurgy') === 'true';
  });

  const handleToggleMetallurgy = () => {
    setEnableMetallurgy(prev => {
      const next = !prev;
      localStorage.setItem('worldplay_enable_metallurgy', String(next));
      return next;
    });
  };

  // Player Profile & Economy (Connected to /api/scores, /api/claim-reward, /api/verify-purchase)
  const [playerName] = useState<string>(() => localStorage.getItem('worldplay_player_name') || 'فرمانده_پارس');
  const [playerRating, setPlayerRating] = useState<number>(() => parseInt(localStorage.getItem('worldplay_rating') || '1420', 10));
  const [playerXP, setPlayerXP] = useState<number>(() => parseInt(localStorage.getItem('worldplay_xp') || '1150', 10));
  const [coins, setCoins] = useState<number>(() => parseInt(localStorage.getItem('worldplay_coins') || '250', 10));
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('worldplay_unlocked_themes') || '["walnut", "emerald", "slate", "amber", "apadana"]');
    } catch {
      return ["walnut", "emerald", "slate", "amber", "apadana"];
    }
  });

  // Modal Dialogs
  const [showAcademy, setShowAcademy] = useState<boolean>(false);
  const [showLeague, setShowLeague] = useState<boolean>(false);
  const [showTreasury, setShowTreasury] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [showCommunity, setShowCommunity] = useState<boolean>(false);
  const [showCivilizations, setShowCivilizations] = useState<boolean>(false);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAiTip, setLoadingAiTip] = useState<boolean>(false);

  // VIP In-Game Perks unlocked via Socials
  const [unlockedPlatinum, setUnlockedPlatinum] = useState<boolean>(() => {
    return localStorage.getItem('worldplay_unlocked_platinum') === 'true';
  });
  const [hasFlagShield, setHasFlagShield] = useState<boolean>(() => {
    return localStorage.getItem('worldplay_flag_shield') === 'true';
  });
  const [shieldUsedThisMatch, setShieldUsedThisMatch] = useState<boolean>(false);
  const [hasRoyalUndo, setHasRoyalUndo] = useState<boolean>(() => {
    return localStorage.getItem('worldplay_royal_undo') === 'true';
  });

  // Chess game instance
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validTargets, setValidTargets] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);

  // Captured pieces
  const [capturedWhite, setCapturedWhite] = useState<PieceType[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<PieceType[]>([]);

  // Pending promotion
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Boosters state
  const [boostersUsed, setBoostersUsed] = useState<PlayerBoosters>({
    w: { bronze: false, silver: false, gold: false },
    b: { bronze: false, silver: false, gold: false }
  });
  const [activeBooster, setActiveBooster] = useState<BoosterTier | null>(null);

  // Timer & Clock
  const [turnStartMs, setTurnStartMs] = useState<number>(() => Date.now());
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(false);
  const [botThinking, setBotThinking] = useState<boolean>(false);

  // Keep track of low-time tick threshold
  const lastTickSecond = useRef<number>(-1);

  // Sync HTML lang and dir attribute
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    localStorage.setItem('worldplay_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'fa' ? 'en' : 'fa'));
  };

  const totalAllowed = activeBooster ? BOOSTERS_CONFIG[activeBooster] : baseTurnSeconds;

  const calculateRemaining = useCallback(() => {
    const elapsed = (Date.now() - turnStartMs) / 1000;
    return Math.max(0, totalAllowed - elapsed);
  }, [turnStartMs, totalAllowed]);

  // Submit Match Scores to Secure API
  const submitGameScore = useCallback(async (res: 'win' | 'loss' | 'draw') => {
    try {
      const elapsedSeconds = Math.max(0, Math.floor(totalAllowed - remainingSeconds));
      const usedCount =
        (boostersUsed.w.bronze ? 1 : 0) +
        (boostersUsed.w.silver ? 1 : 0) +
        (boostersUsed.w.gold ? 1 : 0);

      const resp = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName,
          result: res,
          timeSpent: elapsedSeconds,
          boostersUsedCount: usedCount
        })
      });
      const data = await resp.json();
      if (data.success && data.player) {
        setPlayerRating(data.player.rating);
        setPlayerXP(data.player.xp);
        localStorage.setItem('worldplay_rating', String(data.player.rating));
        localStorage.setItem('worldplay_xp', String(data.player.xp));
      }
    } catch {
      // Local fallback in offline mode
    }
  }, [playerName, totalAllowed, remainingSeconds, boostersUsed]);

  // Handle Flag Fall / Timeout
  const handleTimeout = useCallback(() => {
    if (isGameOver) return;

    // Check if player has unlocked Imperial Flag Shield
    if (hasFlagShield && !shieldUsedThisMatch && game.turn() === 'w') {
      setShieldUsedThisMatch(true);
      setTurnStartMs(Date.now() - (totalAllowed - 5) * 1000);
      setRemainingSeconds(5);
      setResultMessage(lang === 'fa' ? '🛡️ سپر زمان شاهنشاهی فعال شد! ۵ ثانیه فرجه اضطراری برای نجات پرچم!' : '🛡️ Imperial Shield activated! 5s emergency grace period!');
      playCheckSound(!soundEnabled);
      return;
    }

    setIsGameOver(true);
    setRemainingSeconds(0);

    const loser = game.turn();
    const loserName = loser === 'w' ? t.whiteWon : t.blackWon;
    const winnerName = loser === 'w' ? t.blackWon : t.whiteWon;
    const msg = `${loserName}${t.timeOut}${winnerName}${t.winnerMsg}`;
    setResultMessage(msg);
    setGameOverModalOpen(true);
    playVictoryFanfare(!soundEnabled);

    // Record score
    submitGameScore(loser === 'b' ? 'win' : 'loss');
  }, [isGameOver, hasFlagShield, shieldUsedThisMatch, game, totalAllowed, lang, soundEnabled, t, submitGameScore]);

  // Main turn countdown timer loop
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      const rem = calculateRemaining();
      setRemainingSeconds(rem);

      // Warning ticks when < 5 seconds
      if (rem <= 5 && rem > 0) {
        const floorSec = Math.floor(rem);
        if (floorSec !== lastTickSecond.current) {
          lastTickSecond.current = floorSec;
          playLowTimeTick(!soundEnabled);
        }
      }

      if (rem <= 0) {
        clearInterval(interval);
        handleTimeout();
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isGameOver, calculateRemaining, handleTimeout, soundEnabled]);

  // Reset/Start new turn
  const startNewTurn = useCallback(() => {
    setTurnStartMs(Date.now());
    setActiveBooster(null);
    lastTickSecond.current = -1;
  }, []);

  // New Game initialization
  const handleNewGame = useCallback(() => {
    const newG = new Chess();
    setGame(newG);
    setSelectedSquare(null);
    setValidTargets([]);
    setLastMove(null);
    setMoveHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setPendingPromotion(null);
    setBoostersUsed({
      w: { bronze: false, silver: false, gold: false, platinum: false },
      b: { bronze: false, silver: false, gold: false, platinum: false }
    });
    setActiveBooster(null);
    setShieldUsedThisMatch(false);
    setIsGameOver(false);
    setResultMessage('');
    setGameOverModalOpen(false);
    setBotThinking(false);
    setTurnStartMs(Date.now());
    setRemainingSeconds(baseTurnSeconds);
    lastTickSecond.current = -1;
  }, [baseTurnSeconds]);

  // Activate Booster
  const handleActivateBooster = useCallback((tier: BoosterTier) => {
    if (isGameOver || activeBooster || remainingSeconds <= 0) return;
    const currentTurn = game.turn();

    if (boostersUsed[currentTurn][tier]) return;

    setBoostersUsed(prev => ({
      ...prev,
      [currentTurn]: {
        ...prev[currentTurn],
        [tier]: true
      }
    }));
    setActiveBooster(tier);
    playBoosterSound(tier, !soundEnabled);
  }, [isGameOver, activeBooster, remainingSeconds, game, boostersUsed, soundEnabled]);

  // Execute a move on the board
  const executeMove = useCallback((from: Square, to: Square, promotionPiece: PieceType = 'q') => {
    if (remainingSeconds <= 0) {
      handleTimeout();
      return false;
    }

    try {
      const targetPiece = game.get(to);
      const movingPiece = game.get(from);
      if (!movingPiece) return false;

      const moveRes = game.move({
        from,
        to,
        promotion: promotionPiece
      });

      if (!moveRes) return false;

      // Update captured pieces
      if (moveRes.captured) {
        if (moveRes.color === 'w') {
          // White captured a black piece
          setCapturedBlack(prev => [...prev, moveRes.captured as PieceType]);
        } else {
          // Black captured a white piece
          setCapturedWhite(prev => [...prev, moveRes.captured as PieceType]);
        }
        playCaptureSound(!soundEnabled);
      } else {
        playMoveSound(!soundEnabled);
      }

      // Add to move history
      const record: MoveRecord = {
        from,
        to,
        piece: movingPiece.type,
        color: moveRes.color,
        san: moveRes.san,
        captured: moveRes.captured ? (moveRes.captured as PieceType) : undefined,
        promotion: moveRes.promotion ? (moveRes.promotion as PieceType) : undefined,
        boosterUsed: activeBooster || undefined,
        fen: game.fen()
      };
      setMoveHistory(prev => [...prev, record]);

      setLastMove({ from, to });
      setSelectedSquare(null);
      setValidTargets([]);

      // Check game-ending states
      if (game.isCheckmate()) {
        setIsGameOver(true);
        const winnerName = moveRes.color === 'w' ? t.whiteWon : t.blackWon;
        const msg = `${t.checkmate} ${winnerName}${t.winnerMsg}`;
        setResultMessage(msg);
        setGameOverModalOpen(true);
        playVictoryFanfare(!soundEnabled);
        submitGameScore(moveRes.color === 'w' ? 'win' : 'loss');
      } else if (game.isStalemate()) {
        setIsGameOver(true);
        setResultMessage(t.stalemate);
        setGameOverModalOpen(true);
        submitGameScore('draw');
      } else if (game.isDraw()) {
        setIsGameOver(true);
        setResultMessage(t.draw);
        setGameOverModalOpen(true);
        submitGameScore('draw');
      } else {
        if (game.inCheck()) {
          playCheckSound(!soundEnabled);
        }
        startNewTurn();
      }

      // Re-render board state
      setGame(new Chess(game.fen()));
      return true;
    } catch {
      setSelectedSquare(null);
      setValidTargets([]);
      return false;
    }
  }, [remainingSeconds, handleTimeout, game, soundEnabled, activeBooster, t, startNewTurn, submitGameScore]);

  // Handle square clicks
  const handleSquareClick = useCallback((square: Square) => {
    if (isGameOver || botThinking) return;

    const currentTurn = game.turn();
    if (gameMode === 'vs-bot' && currentTurn === 'b') {
      return; // Bot's turn
    }

    // If already selected and clicking a valid target
    if (selectedSquare && validTargets.includes(square)) {
      const piece = game.get(selectedSquare);
      // Check if this is a pawn promotion move
      const isPawnPromotion =
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && square[1] === '8') ||
          (piece.color === 'b' && square[1] === '1'));

      if (isPawnPromotion) {
        setPendingPromotion({ from: selectedSquare, to: square });
        return;
      }

      executeMove(selectedSquare, square);
      return;
    }

    // Select new piece
    const piece = game.get(square);
    if (piece && piece.color === currentTurn) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidTargets(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setValidTargets([]);
    }
  }, [isGameOver, botThinking, game, gameMode, selectedSquare, validTargets, executeMove]);

  // Complete pawn promotion
  const handlePromotionSelect = (promoPiece: PieceType) => {
    if (pendingPromotion) {
      executeMove(pendingPromotion.from, pendingPromotion.to, promoPiece);
      setPendingPromotion(null);
    }
  };

  // Bot Turn Automation
  useEffect(() => {
    if (isGameOver || gameMode !== 'vs-bot') return;

    if (game.turn() === 'b') {
      setBotThinking(true);

      // Check if bot needs to use a booster
      const boosterToUse = shouldBotUseBooster(
        remainingSeconds,
        boostersUsed.b,
        activeBooster
      );
      if (boosterToUse) {
        handleActivateBooster(boosterToUse);
      }

      const botDelay = botDifficulty === 'easy' ? 400 : botDifficulty === 'medium' ? 600 : 750;
      const timer = setTimeout(() => {
        const botMove = chooseBotMove(game.fen(), botDifficulty);
        if (botMove) {
          executeMove(botMove.from as Square, botMove.to as Square, (botMove.promotion as PieceType) || 'q');
        }
        setBotThinking(false);
      }, botDelay);

      return () => clearTimeout(timer);
    }
  }, [
    game,
    gameMode,
    isGameOver,
    remainingSeconds,
    boostersUsed.b,
    activeBooster,
    botDifficulty,
    executeMove,
    handleActivateBooster
  ]);

  // Undo move
  const handleUndo = () => {
    if (isGameOver || botThinking) return;

    const stepsToUndo = gameMode === 'vs-bot' && game.turn() === 'w' && moveHistory.length >= 2 ? 2 : 1;

    let undoneHistory = [...moveHistory];
    for (let i = 0; i < stepsToUndo; i++) {
      const undone = game.undo();
      if (!undone) break;

      const lastRecord = undoneHistory.pop();
      if (lastRecord?.boosterUsed) {
        const side = lastRecord.color;
        const tier = lastRecord.boosterUsed;
        setBoostersUsed(prev => ({
          ...prev,
          [side]: {
            ...prev[side],
            [tier]: false
          }
        }));
      }

      // Restore captured pieces
      if (undone.captured) {
        if (undone.color === 'w') {
          setCapturedBlack(prev => prev.slice(0, -1));
        } else {
          setCapturedWhite(prev => prev.slice(0, -1));
        }
      }
    }

    setMoveHistory(undoneHistory);
    setSelectedSquare(null);
    setValidTargets([]);
    const prevMove = undoneHistory[undoneHistory.length - 1];
    setLastMove(prevMove ? { from: prevMove.from as Square, to: prevMove.to as Square } : null);
    setIsGameOver(false);
    setResultMessage('');
    setGameOverModalOpen(false);
    setActiveBooster(null);
    setTurnStartMs(Date.now());
    setRemainingSeconds(baseTurnSeconds);
    setGame(new Chess(game.fen()));
  };

  // Flip board perspective
  const handleFlip = () => {
    setFlipped(prev => !prev);
  };

  // Automated AI Strategy Advisor (Powered by server-side Gemini 2.5 Flash)
  const handleConsultAiOracle = async () => {
    if (loadingAiTip) return;
    setLoadingAiTip(true);
    try {
      const res = await fetch('/api/ai-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: game.fen(),
          civilization: pieceStyle,
          lastMove: lastMove ? `${lastMove.from} -> ${lastMove.to}` : 'opening',
          lang
        })
      });
      const data = await res.json();
      if (data?.tip) {
        setAiTip(data.tip);
      }
    } catch {
      setAiTip(
        lang === 'fa'
          ? 'مشاور خردمند: مرکز میدان را با سربازان مهار کنید و از جناحین غافل نشوید.'
          : 'Wise Advisor: Control the center squares and keep your king safeguarded.'
      );
    } finally {
      setLoadingAiTip(false);
    }
  };

  // Economy Helpers
  const handleAddCoins = (amount: number) => {
    const updated = Math.max(0, coins + amount);
    setCoins(updated);
    localStorage.setItem('worldplay_coins', String(updated));
  };

  const handleUnlockTheme = (themeKey: string) => {
    if (!unlockedThemes.includes(themeKey)) {
      const updated = [...unlockedThemes, themeKey];
      setUnlockedThemes(updated);
      localStorage.setItem('worldplay_unlocked_themes', JSON.stringify(updated));
    }
    setBoardTheme(themeKey as BoardTheme);
  };

  const handleSelectCivilization = (selectedStyle: PieceStyle, selectedTheme: BoardTheme) => {
    setPieceStyle(selectedStyle);
    setBoardTheme(selectedTheme);
    localStorage.setItem('worldplay_piece_style', selectedStyle);
    localStorage.setItem('worldplay_board_theme', selectedTheme);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (e.key === 'f' || e.key === 'F') {
        handleFlip();
      } else if (e.key === 'u' || e.key === 'U') {
        handleUndo();
      } else if (e.key === 'n' || e.key === 'N') {
        handleNewGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleNewGame]);

  const currentTurn = game.turn();
  const currentTurnUsed = boostersUsed[currentTurn];

  let statusMsg = resultMessage;
  if (!isGameOver) {
    if (botThinking) {
      statusMsg = `🤖 ${t.botThinking}`;
    } else if (game.inCheck()) {
      statusMsg = t.check;
    } else if (activeBooster) {
      statusMsg = `⚡ ${t.boosterActive} (+${BOOSTERS_CONFIG[activeBooster]}s)`;
    }
  }

  return (
    <div className="min-h-screen bg-[#14110f] text-[#f5ecd9] flex flex-col items-center p-2.5 sm:p-5 select-none transition-colors">
      <div className="w-full max-w-[540px] flex flex-col gap-2.5">
        {/* Top Header Row */}
        <header className="flex items-center justify-between pb-1.5 border-b border-[#3a322b]">
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none">👑</span>
            <div>
              <h1 className="text-xl font-black text-[#f0c04a] tracking-tight leading-none flex items-center gap-1.5">
                <span>{t.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {playerRating} ELO
                </span>
              </h1>
              <p className="text-[10px] text-stone-400 font-medium hidden sm:block mt-0.5">
                {t.subTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* World Civilizations Selector */}
            <button
              onClick={() => setShowCivilizations(true)}
              className="p-1.5 rounded-lg bg-gradient-to-r from-amber-900/70 to-amber-700/70 hover:from-amber-800 hover:to-amber-600 border border-amber-500/80 text-amber-200 transition-all cursor-pointer shadow-md flex items-center gap-1"
              title={lang === 'fa' ? 'تمدن‌ها و اساطیر جهان (ایران، روم، یونان، انگلیس، مصر، ژاپن...)' : 'World Civilizations & Empires'}
              aria-label="Civilizations"
            >
              <Globe2 size={16} />
              <span className="text-[11px] font-bold hidden sm:inline">
                {lang === 'fa' ? 'تمدن‌ها' : 'Empires'}
              </span>
            </button>

            {/* Academy Button */}
            <button
              onClick={() => setShowAcademy(true)}
              className="p-1.5 rounded-lg bg-[#241e19] hover:bg-[#342c24] border border-[#5a4630]/60 text-amber-300 transition-colors cursor-pointer"
              title={t.academy}
              aria-label={t.academy}
            >
              <BookOpen size={16} />
            </button>

            {/* World Civilizations Selector Button */}
            <button
              onClick={() => setShowCivilizations(true)}
              className="p-1.5 px-2.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-500/80 text-amber-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm ring-1 ring-amber-500/40"
              title={t.civilizationsBtn}
              aria-label={t.civilizationsBtn}
            >
              <span className="text-base leading-none">
                {CIVILIZATIONS.find(c => c.id === pieceStyle)?.flag || '🌍'}
              </span>
              <span className="font-bold text-xs hidden xs:inline">
                {t.civilizationsBtn}
              </span>
            </button>

            {/* Android APK & Release Hub Button */}
            <button
              onClick={() => setShowAndroidModal(true)}
              className="p-1.5 px-2 rounded-lg bg-[#12281d] hover:bg-[#1a3c2c] border border-emerald-500/70 text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title={t.androidApkBtn}
              aria-label={t.androidApkBtn}
            >
              <Smartphone size={15} className="text-emerald-400" />
              <span className="font-bold text-xs hidden sm:inline">
                APK & Gradle
              </span>
            </button>

            {/* Leagues Button */}
            <button
              onClick={() => setShowLeague(true)}
              className="p-1.5 rounded-lg bg-[#241e19] hover:bg-[#342c24] border border-[#5a4630]/60 text-[#f0c04a] transition-colors cursor-pointer"
              title={t.league}
              aria-label={t.league}
            >
              <Trophy size={16} />
            </button>

            {/* Treasury Shop Button */}
            <button
              onClick={() => setShowTreasury(true)}
              className="p-1.5 rounded-lg bg-[#241e19] hover:bg-[#342c24] border border-[#5a4630]/60 text-yellow-400 transition-colors cursor-pointer flex items-center gap-1"
              title={t.shop}
              aria-label={t.shop}
            >
              <Coins size={16} />
              <span className="font-mono text-xs hidden sm:inline">{coins}</span>
            </button>

            {/* Social Rewards & Promo Codes Button */}
            <button
              onClick={() => setShowCommunity(true)}
              className="relative p-1.5 rounded-lg bg-[#241e19] hover:bg-[#342c24] border border-amber-500/50 text-amber-400 transition-colors cursor-pointer"
              title={lang === 'fa' ? 'هدایای تلگرام و اینستاگرام' : 'Social Gifts & Codes'}
              aria-label="Community Gifts"
            >
              <Gift size={16} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </button>

            {/* Legal Disclaimer Button */}
            <button
              onClick={() => setShowDisclaimer(true)}
              className="p-1.5 rounded-lg bg-[#241e19] hover:bg-[#342c24] border border-[#5a4630]/60 text-amber-400/80 transition-colors cursor-pointer"
              title={t.disclaimer}
              aria-label={t.disclaimer}
            >
              <Scale size={16} />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className="p-1.5 rounded-lg bg-[#241e19] hover:bg-[#342c24] border border-[#5a4630]/60 text-stone-300 transition-colors cursor-pointer"
              title={soundEnabled ? t.soundOn : t.soundOff}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
            </button>

            {/* Settings Toggle */}
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="p-1.5 rounded-lg bg-[#241e19] hover:bg-[#342c24] border border-[#5a4630]/60 text-stone-300 transition-colors cursor-pointer"
              title="Settings"
              aria-label="Open settings"
            >
              <Settings size={16} />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="py-1 px-2 rounded-lg bg-[#3a322b] hover:bg-[#4a3f36] border border-[#5a4630] text-[#f5ecd9] font-medium text-xs transition-colors cursor-pointer"
            >
              {t.langBtn}
            </button>
          </div>
        </header>

        {/* Settings Tray (Collapsible) */}
        {showSettings && (
          <div className="bg-[#1e1914] border border-[#5a4630]/70 rounded-xl p-3 shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs animate-in slide-in-from-top-2 duration-150">
            <div>
              <label className="block text-stone-400 text-[10px] uppercase font-bold mb-1">
                {t.mode}
              </label>
              <select
                value={gameMode}
                onChange={e => {
                  setGameMode(e.target.value as GameMode);
                  handleNewGame();
                }}
                className="w-full bg-[#2a231d] border border-stone-700 rounded-md p-1.5 text-stone-200 cursor-pointer focus:outline-none"
              >
                <option value="pass-and-play">{t.passAndPlay}</option>
                <option value="vs-bot">{t.vsBot}</option>
              </select>
            </div>

            {gameMode === 'vs-bot' && (
              <div>
                <label className="block text-stone-400 text-[10px] uppercase font-bold mb-1">
                  {t.botLevel}
                </label>
                <select
                  value={botDifficulty}
                  onChange={e => setBotDifficulty(e.target.value as BotDifficulty)}
                  className="w-full bg-[#2a231d] border border-stone-700 rounded-md p-1.5 text-stone-200 cursor-pointer focus:outline-none"
                >
                  <option value="easy">{t.easy}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="hard">{t.hard}</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-stone-400 text-[10px] uppercase font-bold mb-1">
                {t.theme}
              </label>
              <select
                value={boardTheme}
                onChange={e => setBoardTheme(e.target.value as BoardTheme)}
                className="w-full bg-[#2a231d] border border-stone-700 rounded-md p-1.5 text-stone-200 cursor-pointer focus:outline-none"
              >
                <option value="taj_mahal">{t.tajMahalTheme}</option>
                <option value="hermitage">{t.hermitageTheme}</option>
                <option value="topkapi">{t.topkapiTheme}</option>
                <option value="forbidden_city">{t.forbiddenCityTheme}</option>
                <option value="apadana">{t.apadanaTheme}</option>
                <option value="persepolis">{t.persepolisTheme}</option>
                <option value="camelot">{t.windsorTheme}</option>
                <option value="colosseum">{t.colosseumTheme}</option>
                <option value="olympus">{t.parthenonTheme}</option>
                <option value="pyramids">{t.pyramidsTheme}</option>
                <option value="sakura">{t.sakuraTheme}</option>
                <option value="petra">{t.petraTheme}</option>
                <option value="fjords">{t.fjordsTheme}</option>
                <option value="walnut">{t.walnutTheme}</option>
                <option value="emerald">{t.emeraldTheme}</option>
                <option value="slate">{t.slateTheme}</option>
                <option value="amber">{t.amberTheme}</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 text-[10px] uppercase font-bold mb-1">
                {t.pieceStyle}
              </label>
              <select
                value={pieceStyle}
                onChange={e => setPieceStyle(e.target.value as PieceStyle)}
                className="w-full bg-[#2a231d] border border-stone-700 rounded-md p-1.5 text-stone-200 cursor-pointer focus:outline-none"
              >
                <option value="india">{t.indiaStyle}</option>
                <option value="russia">{t.russiaStyle}</option>
                <option value="achaemenid">{t.achaemenidStyle}</option>
                <option value="ottoman">{t.ottomanStyle}</option>
                <option value="alchemy">{t.alchemyStyle}</option>
                <option value="china">{t.chinaStyle}</option>
                <option value="england">{t.englandStyle}</option>
                <option value="rome">{t.romeStyle}</option>
                <option value="greece">{t.greeceStyle}</option>
                <option value="egypt">{t.egyptStyle}</option>
                <option value="japan">{t.japanStyle}</option>
                <option value="arabia">{t.arabiaStyle}</option>
                <option value="nordic">{t.nordicStyle}</option>
                <option value="vector">{t.vectorStyle}</option>
                <option value="classic">{t.classicStyle}</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 text-[10px] uppercase font-bold mb-1">
                {t.baseTimer}
              </label>
              <select
                value={baseTurnSeconds}
                onChange={e => {
                  const val = parseInt(e.target.value, 10);
                  setBaseTurnSeconds(val);
                  setRemainingSeconds(val);
                }}
                className="w-full bg-[#2a231d] border border-stone-700 rounded-md p-1.5 text-stone-200 cursor-pointer focus:outline-none"
              >
                <option value={15}>15s (Blitz)</option>
                <option value={30}>30s (Rapid - Default)</option>
                <option value={45}>45s (Standard)</option>
                <option value={60}>60s (Relaxed)</option>
              </select>
            </div>

            {/* Alchemical Metallurgy Switcher */}
            <div className="col-span-2 sm:col-span-4 flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-amber-900/30 border border-amber-700/40 mt-1">
              <div className="flex items-center gap-2">
                <span className="text-base">⚗️</span>
                <div>
                  <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <span>{t.metallurgyFusion}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      شاه طلا، ملکه نقره، فیل برنز، اسب چوب، رخ آلومینیوم، پیاده آهن
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {t.metallurgyDesc}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleMetallurgy}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enableMetallurgy ? 'bg-amber-500' : 'bg-stone-700'
                }`}
                role="switch"
                aria-checked={enableMetallurgy}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    enableMetallurgy ? (lang === 'fa' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Turn & Countdown Timer Bar */}
        <TurnTimer
          currentTurn={currentTurn}
          remainingSeconds={remainingSeconds}
          totalAllowedSeconds={totalAllowed}
          isCheck={game.inCheck()}
          isGameOver={isGameOver}
          activeBooster={activeBooster}
          statusMessage={statusMsg}
          t={t}
        />

        {/* Captured Pieces Bar */}
        <CapturedPieces
          capturedWhite={capturedWhite}
          capturedBlack={capturedBlack}
          pieceStyle={pieceStyle}
          enableMetallurgy={enableMetallurgy}
        />

        {/* Chess Board Container */}
        <div className="flex justify-center w-full">
          <ChessBoard
            game={game}
            selectedSquare={selectedSquare}
            validTargets={validTargets}
            lastMove={lastMove}
            flipped={flipped}
            theme={boardTheme}
            pieceStyle={pieceStyle}
            enableMetallurgy={enableMetallurgy}
            onSquareClick={handleSquareClick}
            isGameOver={isGameOver}
          />
        </div>

        {/* Booster Cards Panel */}
        <BoosterCards
          currentTurn={currentTurn}
          usedBoosters={currentTurnUsed}
          activeBooster={activeBooster}
          isGameOver={isGameOver}
          unlockedPlatinum={unlockedPlatinum}
          onActivate={handleActivateBooster}
          t={t}
        />

        {/* Game Action Buttons */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <button
            onClick={handleNewGame}
            className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#3a322b] hover:bg-[#4a3f36] border border-[#5a4630]/60 text-[#f5ecd9] font-bold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer shadow-md"
            title="Reset board (N)"
          >
            <RefreshCw size={15} />
            <span>{t.newGame}</span>
          </button>

          <button
            onClick={handleFlip}
            className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#3a322b] hover:bg-[#4a3f36] border border-[#5a4630]/60 text-[#f5ecd9] font-bold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer shadow-md"
            title="Flip board perspective (F)"
          >
            <RotateCcw size={15} />
            <span>{t.flip}</span>
          </button>

          <button
            onClick={handleUndo}
            disabled={moveHistory.length === 0 || isGameOver || botThinking}
            className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border transition-all active:scale-98 cursor-pointer shadow-md ${
              hasRoyalUndo
                ? 'bg-gradient-to-r from-amber-800 to-[#3a322b] border-amber-400 text-amber-200 shadow-amber-950/40'
                : 'bg-[#3a322b] hover:bg-[#4a3f36] border-[#5a4630]/60 text-[#f5ecd9]'
            } disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-bold`}
            title={hasRoyalUndo ? t.royalUndo : t.undo}
          >
            <Undo2 size={15} />
            <span>{hasRoyalUndo ? (lang === 'fa' ? 'فرمان لغو 👑' : 'Royal Undo 👑') : t.undo}</span>
          </button>
        </div>

        {/* Automated AI Strategy Advisor (Powered by Gemini) */}
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleConsultAiOracle}
              disabled={loadingAiTip || isGameOver}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-950 via-[#1c271e] to-amber-950/80 hover:from-emerald-900 hover:to-amber-900 border border-emerald-500/60 text-emerald-200 text-xs font-bold shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={14} className={loadingAiTip ? 'animate-spin text-amber-400' : 'text-emerald-400'} />
              <span>
                {loadingAiTip
                  ? (lang === 'fa' ? 'در حال مشورت با هوش مصنوعی (Gemini)...' : 'Consulting AI Oracle...')
                  : (lang === 'fa' ? 'پیشنهاد و تدبیر هوش مصنوعی (Gemini AI)' : 'Consult AI Oracle')}
              </span>
            </button>
            {aiTip && (
              <button
                onClick={() => setAiTip(null)}
                className="px-2.5 py-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white text-xs border border-stone-800 cursor-pointer"
                title={lang === 'fa' ? 'بستن' : 'Dismiss'}
              >
                ✕
              </button>
            )}
          </div>

          {aiTip && (
            <div className="p-3 rounded-xl bg-[#162218] border border-emerald-500/50 text-xs text-emerald-100 shadow-md flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <span className="text-base leading-none">🔮</span>
              <div className="leading-relaxed flex-1">
                <span className="text-amber-300 font-bold block mb-0.5">
                  {lang === 'fa' ? 'دیدگاه استراتژیک هوش مصنوعی:' : 'Strategic Oracle Advice:'}
                </span>
                {aiTip}
              </div>
            </div>
          )}
        </div>

        {/* Move History */}
        <MoveHistory history={moveHistory} t={t} />

        {/* Tactical Footer Note */}
        <footer className="text-center text-[11px] text-stone-500 py-2 border-t border-stone-800/60 flex items-center justify-center gap-2">
          <span>{t.tacticalTip}</span>
        </footer>
      </div>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={game.turn()}
          pieceStyle={pieceStyle}
          onSelect={handlePromotionSelect}
          t={t}
        />
      )}

      {/* Game Over Victory Modal */}
      <GameOverModal
        isOpen={gameOverModalOpen}
        title={t.gameOver}
        message={resultMessage}
        onRematch={handleNewGame}
        onClose={() => setGameOverModalOpen(false)}
        t={t}
      />

      {/* Academy & Ancient Philosophy Modal */}
      <AcademyModal
        isOpen={showAcademy}
        onClose={() => setShowAcademy(false)}
        t={t}
        lang={lang}
      />

      {/* League & Leaderboard Modal */}
      <LeagueModal
        isOpen={showLeague}
        onClose={() => setShowLeague(false)}
        playerName={playerName}
        playerRating={playerRating}
        playerXP={playerXP}
        t={t}
        lang={lang}
      />

      {/* Treasury & In-App Purchase Shop Modal */}
      <TreasuryModal
        isOpen={showTreasury}
        onClose={() => setShowTreasury(false)}
        coins={coins}
        onAddCoins={handleAddCoins}
        onUnlockTheme={handleUnlockTheme}
        unlockedThemes={unlockedThemes}
        t={t}
        lang={lang}
      />

      {/* Official Legal Disclaimer Modal */}
      <LegalDisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        t={t}
        lang={lang}
      />

      {/* Community Rewards & Telegram/Instagram/YouTube Growth Modal */}
      <CommunityRewardModal
        isOpen={showCommunity}
        onClose={() => setShowCommunity(false)}
        onAddCoins={handleAddCoins}
        onUnlockPlatinumBooster={() => {
          setUnlockedPlatinum(true);
          localStorage.setItem('worldplay_unlocked_platinum', 'true');
        }}
        onUnlockFlagShield={() => {
          setHasFlagShield(true);
          localStorage.setItem('worldplay_flag_shield', 'true');
        }}
        onUnlockRoyalUndo={() => {
          setHasRoyalUndo(true);
          localStorage.setItem('worldplay_royal_undo', 'true');
        }}
        onUnlockApadanaSkin={() => handleUnlockTheme('apadana')}
        t={t}
        lang={lang}
      />

      {/* World Civilizations Selector Modal */}
      <CivilizationModal
        isOpen={showCivilizations}
        onClose={() => setShowCivilizations(false)}
        currentPieceStyle={pieceStyle}
        currentBoardTheme={boardTheme}
        enableMetallurgy={enableMetallurgy}
        onToggleMetallurgy={handleToggleMetallurgy}
        onSelectCivilization={handleSelectCivilization}
        t={t}
        lang={lang}
      />

      {/* Android APK & Release Center Modal */}
      <AndroidBuildModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        lang={lang}
      />
    </div>
  );
}
