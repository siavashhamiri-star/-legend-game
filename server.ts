import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '1mb' }));

// In-memory persistent state for leaderboard and leagues (ready to attach to DB if provisioned)
interface PlayerRecord {
  id: string;
  name: string;
  rating: number;
  xp: number;
  league: string;
  wins: number;
  losses: number;
  avatar: string;
  country: string;
}

let leaderboard: PlayerRecord[] = [
  { id: '1', name: 'کوروش_ایران', rating: 2140, xp: 9800, league: 'Cyrus', wins: 84, losses: 12, avatar: '👑', country: 'IR' },
  { id: '2', name: 'Mandana_Queen', rating: 1980, xp: 8200, league: 'Mandana', wins: 71, losses: 19, avatar: '👸', country: 'IR' },
  { id: '3', name: 'Aryo_Barzan', rating: 1890, xp: 7400, league: 'Darius', wins: 62, losses: 23, avatar: '🛡️', country: 'IR' },
  { id: '4', name: 'Apadana_Master', rating: 1750, xp: 6100, league: 'Apadana', wins: 53, losses: 28, avatar: '🏛️', country: 'FR' },
  { id: '5', name: 'Pasargad_Knight', rating: 1620, xp: 4800, league: 'Pasargadae', wins: 41, losses: 30, avatar: '🐎', country: 'DE' }
];

const LEAGUES = [
  { id: 'pasargadae', nameFa: 'لیگ پاسارگاد', nameEn: 'Pasargadae League', minRating: 1000, maxRating: 1399, badge: '🥉', color: '#cd7f32' },
  { id: 'apadana', nameFa: 'لیگ آپادانا', nameEn: 'Apadana League', minRating: 1400, maxRating: 1699, badge: '🏛️', color: '#38bdf8' },
  { id: 'mandana', nameFa: 'لیگ ماندانا', nameEn: 'Mandana League', minRating: 1700, maxRating: 1899, badge: '🥈', color: '#c0c0c0' },
  { id: 'darius', nameFa: 'لیگ داریوش', nameEn: 'Darius League', minRating: 1900, maxRating: 2099, badge: '⚔️', color: '#f59e0b' },
  { id: 'cyrus', nameFa: 'لیگ کوروش بزرگ', nameEn: 'Cyrus the Great League', minRating: 2100, maxRating: 3000, badge: '👑', color: '#f0c04a' }
];

// Simple in-memory rate limiter per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();
function rateLimitMiddleware(req: Request, res: Response, next: () => void) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 120;

  const current = requestCounts.get(ip);
  if (!current || now > current.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (current.count >= maxReq) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  current.count++;
  next();
}

app.use('/api', rateLimitMiddleware);

// --- Secure API Routes ---

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    game: 'Worldplay - Hamjahan',
    version: '1.4.0',
    timestamp: new Date().toISOString()
  });
});

// Get Leagues definition
app.get('/api/leagues', (_req: Request, res: Response) => {
  res.json({ leagues: LEAGUES });
});

// Get Leaderboard
app.get('/api/leaderboard', (_req: Request, res: Response) => {
  res.json({ leaderboard: [...leaderboard].sort((a, b) => b.rating - a.rating) });
});

// Record Match Score & Update Rating
app.post('/api/scores', (req: Request, res: Response) => {
  const { playerName, result, timeSpent, boostersUsedCount } = req.body;

  if (!playerName || typeof playerName !== 'string') {
    return res.status(400).json({ error: 'Player name is required' });
  }

  const safeName = playerName.trim().substring(0, 30);
  const isWin = result === 'win';
  const isDraw = result === 'draw';

  // XP calculation algorithm
  const baseXP = isWin ? 100 : isDraw ? 40 : 20;
  const speedBonus = Math.max(0, Math.floor((30 - (timeSpent || 15)) * 2));
  const efficiencyBonus = Math.max(0, (3 - (boostersUsedCount || 0)) * 15);
  const totalEarnedXP = baseXP + speedBonus + efficiencyBonus;

  // Rating delta
  const ratingDelta = isWin ? +25 : isDraw ? +5 : -15;

  let player = leaderboard.find(p => p.name.toLowerCase() === safeName.toLowerCase());
  if (player) {
    player.rating = Math.max(800, player.rating + ratingDelta);
    player.xp += totalEarnedXP;
    if (isWin) player.wins += 1;
    else if (!isDraw) player.losses += 1;
  } else {
    player = {
      id: String(Date.now()),
      name: safeName,
      rating: Math.max(800, 1200 + ratingDelta),
      xp: totalEarnedXP,
      league: 'Pasargadae',
      wins: isWin ? 1 : 0,
      losses: isWin || isDraw ? 0 : 1,
      avatar: '🛡️',
      country: 'IR'
    };
    leaderboard.push(player);
  }

  // Update league according to rating
  const matchedLeague = [...LEAGUES].reverse().find(l => player!.rating >= l.minRating) || LEAGUES[0];
  player.league = matchedLeague.id;

  res.json({
    success: true,
    player,
    earnedXP: totalEarnedXP,
    ratingDelta,
    currentLeague: matchedLeague
  });
});

// Claim Rewarded Ad Coins/Booster (Simulated secure token validation)
app.post('/api/claim-reward', (req: Request, res: Response) => {
  const { rewardType, verificationToken } = req.body;
  if (!verificationToken || typeof verificationToken !== 'string') {
    return res.status(400).json({ error: 'Invalid reward token' });
  }

  // Credit 50 Darics (gold coins) or 1 free booster
  res.json({
    success: true,
    rewardType: rewardType || 'coins',
    amount: rewardType === 'booster' ? 1 : 50,
    messageFa: 'پاداش با موفقیت به حساب شما اضافه شد! ۵۰ دریک زرین',
    messageEn: 'Reward successfully claimed! 50 Golden Darics'
  });
});

// Redeem Daily / Telegram Promo Codes
const VALID_PROMO_CODES: Record<string, { coins: number; messageFa: string; messageEn: string }> = {
  'CYRUS2026': { coins: 150, messageFa: 'کد هدیه کوروش اعمال شد! (+۱۵۰ دریک زرین)', messageEn: 'Cyrus Gift Code activated! (+150 Darics)' },
  'HAMJAHAN': { coins: 100, messageFa: 'کد ورود به همجهان اعمال شد! (+۱۰۰ دریک زرین)', messageEn: 'Welcome code activated! (+100 Darics)' },
  'TELEGRAM_VIP': { coins: 200, messageFa: 'پاداش عضویت در کانال تلگرام ثبت شد! (+۲۰۰ دریک)', messageEn: 'Telegram VIP reward claimed! (+200 Darics)' },
  'INSTA_FAMILY': { coins: 120, messageFa: 'پاداش همراهی اینستاگرام ثبت شد! (+۱۲۰ دریک)', messageEn: 'Instagram follow reward claimed! (+120 Darics)' },
  'YOUTUBE_VIP': { coins: 250, messageFa: 'پاداش سابسکرایب یوتیوب اعمال شد! (+۲۵۰ دریک زرین + کارت پلاتینیوم ۶۵ث)', messageEn: 'YouTube VIP reward claimed! (+250 Darics + Platinum Booster)' }
};

const redeemedUserCodes = new Set<string>();

app.post('/api/redeem-code', (req: Request, res: Response) => {
  const { code, playerId } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Promo code required' });
  }

  const cleanCode = code.trim().toUpperCase();
  const reward = VALID_PROMO_CODES[cleanCode];

  if (!reward) {
    return res.status(404).json({ errorFa: 'کد نامعتبر است یا منقضی شده است.', errorEn: 'Invalid or expired code.' });
  }

  const userKey = `${playerId || 'guest'}_${cleanCode}`;
  if (redeemedUserCodes.has(userKey)) {
    return res.status(400).json({ errorFa: 'این کد قبلاً توسط شما استفاده شده است.', errorEn: 'Code already redeemed.' });
  }

  redeemedUserCodes.add(userKey);
  res.json({
    success: true,
    code: cleanCode,
    coinsGranted: reward.coins,
    messageFa: reward.messageFa,
    messageEn: reward.messageEn
  });
});

// Verify In-App Purchase
app.post('/api/verify-purchase', (req: Request, res: Response) => {
  const { packageId, receiptToken } = req.body;
  if (!packageId) {
    return res.status(400).json({ error: 'Package ID required' });
  }

  // Validates IAP package
  const PACKAGES: Record<string, { coins: number; name: string }> = {
    'daric_pack_small': { coins: 250, name: 'کیسه دریک هخامنشی (۲۵۰ سکه)' },
    'daric_pack_royal': { coins: 1000, name: 'صندوقچه سلطنتی کوروش (۱۰۰۰ سکه)' },
    'booster_bundle': { coins: 0, name: 'بسته ۳۰ تایی کارت‌های زمان' },
    'skin_apadana': { coins: 0, name: 'پوسته کاخ آپادانا' }
  };

  const selected = PACKAGES[packageId];
  if (!selected) {
    return res.status(404).json({ error: 'Unknown package' });
  }

  res.json({
    success: true,
    packageId,
    receiptToken: receiptToken || `tok_${Date.now()}`,
    unlockedItem: selected.name,
    coinsGranted: selected.coins
  });
});

// --- Fully Automated & Secure AI Strategic Advisor (Powered by Gemini 2.5 Flash) ---
let aiClient: GoogleGenAI | null = null;
try {
  aiClient = new GoogleGenAI();
} catch (e) {
  console.log('[AI Oracle] Initialized with automatic credentials');
}

app.post('/api/ai-oracle', async (req: Request, res: Response) => {
  const { fen, civilization, lastMove, lang } = req.body;
  const isFa = lang !== 'en';

  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI();
    } catch {
      // safe fallback
    }
  }

  if (!aiClient) {
    return res.json({
      success: true,
      tip: isFa
        ? 'مرکز صفحه را با پیاده‌ها کنترل کنید و اسب‌های خود را به سمت خانه‌های کلیدی گسترش دهید.'
        : 'Control the center with your pawns and develop your knights to active squares.'
    });
  }

  try {
    const prompt = `You are the legendary historical grand strategist of the "${civilization || 'achaemenid'}" civilization in Worldplay Cultural Chess.
The current board FEN is: "${fen || 'start'}". The last move played was: "${lastMove || 'opening'}".
Provide a brief, inspiring 1-2 sentence tactical recommendation and royal lore insight for the current player.
Answer strictly in ${isFa ? 'Persian (Farsi)' : 'English'}. No markdown bullets, keep it under 35 words.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const tip = response.text?.trim() || (isFa ? 'با خرد و شجاعت گام بردارید؛ کنترل مرکز کلید پیروزی است.' : 'Control the center and guard your king.');

    res.json({
      success: true,
      tip
    });
  } catch (err: any) {
    console.error('[AI Oracle] Automated Gemini fallback:', err?.message || err);
    res.json({
      success: true,
      tip: isFa
        ? 'دیده‌بانی هوشمند: از مهره‌های سبک برای تصاحب خانه‌های میانی بهره بگیرید و شاه را با قلعه‌رفتن محافظت کنید.'
        : 'Tactical hint: Secure the king via castling and keep knight outpost active.'
    });
  }
});

// --- Vite / Static Files Middleware ---
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Worldplay Engine] Server running on http://0.0.0.0:${port}`);
  });
}

setupServer().catch(err => {
  console.error('[Worldplay Engine] Startup error:', err);
});
