var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var port = parseInt(process.env.PORT || "3000", 10);
app.use(import_express.default.json({ limit: "1mb" }));
var leaderboard = [
  { id: "1", name: "\u06A9\u0648\u0631\u0648\u0634_\u0627\u06CC\u0631\u0627\u0646", rating: 2140, xp: 9800, league: "Cyrus", wins: 84, losses: 12, avatar: "\u{1F451}", country: "IR" },
  { id: "2", name: "Mandana_Queen", rating: 1980, xp: 8200, league: "Mandana", wins: 71, losses: 19, avatar: "\u{1F478}", country: "IR" },
  { id: "3", name: "Aryo_Barzan", rating: 1890, xp: 7400, league: "Darius", wins: 62, losses: 23, avatar: "\u{1F6E1}\uFE0F", country: "IR" },
  { id: "4", name: "Apadana_Master", rating: 1750, xp: 6100, league: "Apadana", wins: 53, losses: 28, avatar: "\u{1F3DB}\uFE0F", country: "FR" },
  { id: "5", name: "Pasargad_Knight", rating: 1620, xp: 4800, league: "Pasargadae", wins: 41, losses: 30, avatar: "\u{1F40E}", country: "DE" }
];
var LEAGUES = [
  { id: "pasargadae", nameFa: "\u0644\u06CC\u06AF \u067E\u0627\u0633\u0627\u0631\u06AF\u0627\u062F", nameEn: "Pasargadae League", minRating: 1e3, maxRating: 1399, badge: "\u{1F949}", color: "#cd7f32" },
  { id: "apadana", nameFa: "\u0644\u06CC\u06AF \u0622\u067E\u0627\u062F\u0627\u0646\u0627", nameEn: "Apadana League", minRating: 1400, maxRating: 1699, badge: "\u{1F3DB}\uFE0F", color: "#38bdf8" },
  { id: "mandana", nameFa: "\u0644\u06CC\u06AF \u0645\u0627\u0646\u062F\u0627\u0646\u0627", nameEn: "Mandana League", minRating: 1700, maxRating: 1899, badge: "\u{1F948}", color: "#c0c0c0" },
  { id: "darius", nameFa: "\u0644\u06CC\u06AF \u062F\u0627\u0631\u06CC\u0648\u0634", nameEn: "Darius League", minRating: 1900, maxRating: 2099, badge: "\u2694\uFE0F", color: "#f59e0b" },
  { id: "cyrus", nameFa: "\u0644\u06CC\u06AF \u06A9\u0648\u0631\u0648\u0634 \u0628\u0632\u0631\u06AF", nameEn: "Cyrus the Great League", minRating: 2100, maxRating: 3e3, badge: "\u{1F451}", color: "#f0c04a" }
];
var requestCounts = /* @__PURE__ */ new Map();
function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1e3;
  const maxReq = 120;
  const current = requestCounts.get(ip);
  if (!current || now > current.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }
  if (current.count >= maxReq) {
    return res.status(429).json({ error: "Too many requests. Please slow down." });
  }
  current.count++;
  next();
}
app.use("/api", rateLimitMiddleware);
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    game: "Worldplay - Hamjahan",
    version: "1.4.0",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/leagues", (_req, res) => {
  res.json({ leagues: LEAGUES });
});
app.get("/api/leaderboard", (_req, res) => {
  res.json({ leaderboard: [...leaderboard].sort((a, b) => b.rating - a.rating) });
});
app.post("/api/scores", (req, res) => {
  const { playerName, result, timeSpent, boostersUsedCount } = req.body;
  if (!playerName || typeof playerName !== "string") {
    return res.status(400).json({ error: "Player name is required" });
  }
  const safeName = playerName.trim().substring(0, 30);
  const isWin = result === "win";
  const isDraw = result === "draw";
  const baseXP = isWin ? 100 : isDraw ? 40 : 20;
  const speedBonus = Math.max(0, Math.floor((30 - (timeSpent || 15)) * 2));
  const efficiencyBonus = Math.max(0, (3 - (boostersUsedCount || 0)) * 15);
  const totalEarnedXP = baseXP + speedBonus + efficiencyBonus;
  const ratingDelta = isWin ? 25 : isDraw ? 5 : -15;
  let player = leaderboard.find((p) => p.name.toLowerCase() === safeName.toLowerCase());
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
      league: "Pasargadae",
      wins: isWin ? 1 : 0,
      losses: isWin || isDraw ? 0 : 1,
      avatar: "\u{1F6E1}\uFE0F",
      country: "IR"
    };
    leaderboard.push(player);
  }
  const matchedLeague = [...LEAGUES].reverse().find((l) => player.rating >= l.minRating) || LEAGUES[0];
  player.league = matchedLeague.id;
  res.json({
    success: true,
    player,
    earnedXP: totalEarnedXP,
    ratingDelta,
    currentLeague: matchedLeague
  });
});
app.post("/api/claim-reward", (req, res) => {
  const { rewardType, verificationToken } = req.body;
  if (!verificationToken || typeof verificationToken !== "string") {
    return res.status(400).json({ error: "Invalid reward token" });
  }
  res.json({
    success: true,
    rewardType: rewardType || "coins",
    amount: rewardType === "booster" ? 1 : 50,
    messageFa: "\u067E\u0627\u062F\u0627\u0634 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0647 \u062D\u0633\u0627\u0628 \u0634\u0645\u0627 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F! \u06F5\u06F0 \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646",
    messageEn: "Reward successfully claimed! 50 Golden Darics"
  });
});
var VALID_PROMO_CODES = {
  "CYRUS2026": { coins: 150, messageFa: "\u06A9\u062F \u0647\u062F\u06CC\u0647 \u06A9\u0648\u0631\u0648\u0634 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F! (+\u06F1\u06F5\u06F0 \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646)", messageEn: "Cyrus Gift Code activated! (+150 Darics)" },
  "HAMJAHAN": { coins: 100, messageFa: "\u06A9\u062F \u0648\u0631\u0648\u062F \u0628\u0647 \u0647\u0645\u062C\u0647\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F! (+\u06F1\u06F0\u06F0 \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646)", messageEn: "Welcome code activated! (+100 Darics)" },
  "TELEGRAM_VIP": { coins: 200, messageFa: "\u067E\u0627\u062F\u0627\u0634 \u0639\u0636\u0648\u06CC\u062A \u062F\u0631 \u06A9\u0627\u0646\u0627\u0644 \u062A\u0644\u06AF\u0631\u0627\u0645 \u062B\u0628\u062A \u0634\u062F! (+\u06F2\u06F0\u06F0 \u062F\u0631\u06CC\u06A9)", messageEn: "Telegram VIP reward claimed! (+200 Darics)" },
  "INSTA_FAMILY": { coins: 120, messageFa: "\u067E\u0627\u062F\u0627\u0634 \u0647\u0645\u0631\u0627\u0647\u06CC \u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645 \u062B\u0628\u062A \u0634\u062F! (+\u06F1\u06F2\u06F0 \u062F\u0631\u06CC\u06A9)", messageEn: "Instagram follow reward claimed! (+120 Darics)" },
  "YOUTUBE_VIP": { coins: 250, messageFa: "\u067E\u0627\u062F\u0627\u0634 \u0633\u0627\u0628\u0633\u06A9\u0631\u0627\u06CC\u0628 \u06CC\u0648\u062A\u06CC\u0648\u0628 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F! (+\u06F2\u06F5\u06F0 \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646 + \u06A9\u0627\u0631\u062A \u067E\u0644\u0627\u062A\u06CC\u0646\u06CC\u0648\u0645 \u06F6\u06F5\u062B)", messageEn: "YouTube VIP reward claimed! (+250 Darics + Platinum Booster)" }
};
var redeemedUserCodes = /* @__PURE__ */ new Set();
app.post("/api/redeem-code", (req, res) => {
  const { code, playerId } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Promo code required" });
  }
  const cleanCode = code.trim().toUpperCase();
  const reward = VALID_PROMO_CODES[cleanCode];
  if (!reward) {
    return res.status(404).json({ errorFa: "\u06A9\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A \u06CC\u0627 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A.", errorEn: "Invalid or expired code." });
  }
  const userKey = `${playerId || "guest"}_${cleanCode}`;
  if (redeemedUserCodes.has(userKey)) {
    return res.status(400).json({ errorFa: "\u0627\u06CC\u0646 \u06A9\u062F \u0642\u0628\u0644\u0627\u064B \u062A\u0648\u0633\u0637 \u0634\u0645\u0627 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A.", errorEn: "Code already redeemed." });
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
app.post("/api/verify-purchase", (req, res) => {
  const { packageId, receiptToken } = req.body;
  if (!packageId) {
    return res.status(400).json({ error: "Package ID required" });
  }
  const PACKAGES = {
    "daric_pack_small": { coins: 250, name: "\u06A9\u06CC\u0633\u0647 \u062F\u0631\u06CC\u06A9 \u0647\u062E\u0627\u0645\u0646\u0634\u06CC (\u06F2\u06F5\u06F0 \u0633\u06A9\u0647)" },
    "daric_pack_royal": { coins: 1e3, name: "\u0635\u0646\u062F\u0648\u0642\u0686\u0647 \u0633\u0644\u0637\u0646\u062A\u06CC \u06A9\u0648\u0631\u0648\u0634 (\u06F1\u06F0\u06F0\u06F0 \u0633\u06A9\u0647)" },
    "booster_bundle": { coins: 0, name: "\u0628\u0633\u062A\u0647 \u06F3\u06F0 \u062A\u0627\u06CC\u06CC \u06A9\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u0632\u0645\u0627\u0646" },
    "skin_apadana": { coins: 0, name: "\u067E\u0648\u0633\u062A\u0647 \u06A9\u0627\u062E \u0622\u067E\u0627\u062F\u0627\u0646\u0627" }
  };
  const selected = PACKAGES[packageId];
  if (!selected) {
    return res.status(404).json({ error: "Unknown package" });
  }
  res.json({
    success: true,
    packageId,
    receiptToken: receiptToken || `tok_${Date.now()}`,
    unlockedItem: selected.name,
    coinsGranted: selected.coins
  });
});
var aiClient = null;
try {
  aiClient = new import_genai.GoogleGenAI();
} catch (e) {
  console.log("[AI Oracle] Initialized with automatic credentials");
}
app.post("/api/ai-oracle", async (req, res) => {
  const { fen, civilization, lastMove, lang } = req.body;
  const isFa = lang !== "en";
  if (!aiClient) {
    try {
      aiClient = new import_genai.GoogleGenAI();
    } catch {
    }
  }
  if (!aiClient) {
    return res.json({
      success: true,
      tip: isFa ? "\u0645\u0631\u06A9\u0632 \u0635\u0641\u062D\u0647 \u0631\u0627 \u0628\u0627 \u067E\u06CC\u0627\u062F\u0647\u200C\u0647\u0627 \u06A9\u0646\u062A\u0631\u0644 \u06A9\u0646\u06CC\u062F \u0648 \u0627\u0633\u0628\u200C\u0647\u0627\u06CC \u062E\u0648\u062F \u0631\u0627 \u0628\u0647 \u0633\u0645\u062A \u062E\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u06A9\u0644\u06CC\u062F\u06CC \u06AF\u0633\u062A\u0631\u0634 \u062F\u0647\u06CC\u062F." : "Control the center with your pawns and develop your knights to active squares."
    });
  }
  try {
    const prompt = `You are the legendary historical grand strategist of the "${civilization || "achaemenid"}" civilization in Worldplay Cultural Chess.
The current board FEN is: "${fen || "start"}". The last move played was: "${lastMove || "opening"}".
Provide a brief, inspiring 1-2 sentence tactical recommendation and royal lore insight for the current player.
Answer strictly in ${isFa ? "Persian (Farsi)" : "English"}. No markdown bullets, keep it under 35 words.`;
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const tip = response.text?.trim() || (isFa ? "\u0628\u0627 \u062E\u0631\u062F \u0648 \u0634\u062C\u0627\u0639\u062A \u06AF\u0627\u0645 \u0628\u0631\u062F\u0627\u0631\u06CC\u062F\u061B \u06A9\u0646\u062A\u0631\u0644 \u0645\u0631\u06A9\u0632 \u06A9\u0644\u06CC\u062F \u067E\u06CC\u0631\u0648\u0632\u06CC \u0627\u0633\u062A." : "Control the center and guard your king.");
    res.json({
      success: true,
      tip
    });
  } catch (err) {
    console.error("[AI Oracle] Automated Gemini fallback:", err?.message || err);
    res.json({
      success: true,
      tip: isFa ? "\u062F\u06CC\u062F\u0647\u200C\u0628\u0627\u0646\u06CC \u0647\u0648\u0634\u0645\u0646\u062F: \u0627\u0632 \u0645\u0647\u0631\u0647\u200C\u0647\u0627\u06CC \u0633\u0628\u06A9 \u0628\u0631\u0627\u06CC \u062A\u0635\u0627\u062D\u0628 \u062E\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u0645\u06CC\u0627\u0646\u06CC \u0628\u0647\u0631\u0647 \u0628\u06AF\u06CC\u0631\u06CC\u062F \u0648 \u0634\u0627\u0647 \u0631\u0627 \u0628\u0627 \u0642\u0644\u0639\u0647\u200C\u0631\u0641\u062A\u0646 \u0645\u062D\u0627\u0641\u0638\u062A \u06A9\u0646\u06CC\u062F." : "Tactical hint: Secure the king via castling and keep knight outpost active."
    });
  }
});
async function setupServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(__dirname, "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.resolve(distPath, "index.html"));
    });
  }
  app.listen(port, "0.0.0.0", () => {
    console.log(`[Worldplay Engine] Server running on http://0.0.0.0:${port}`);
  });
}
setupServer().catch((err) => {
  console.error("[Worldplay Engine] Startup error:", err);
});
