import React, { useState } from 'react';
import { TranslationDictionary, Language } from '../types/chess.ts';
import { Send, Instagram, Youtube, Gift, CheckCircle, AlertCircle, Sparkles, X, ExternalLink, ShieldAlert, Eye } from 'lucide-react';

interface CommunityRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoins: (amount: number) => void;
  onUnlockPlatinumBooster?: () => void;
  onUnlockFlagShield?: () => void;
  onUnlockRoyalUndo?: () => void;
  onUnlockApadanaSkin?: () => void;
  t: TranslationDictionary;
  lang: Language;
}

export const CommunityRewardModal: React.FC<CommunityRewardModalProps> = ({
  isOpen,
  onClose,
  onAddCoins,
  onUnlockPlatinumBooster,
  onUnlockFlagShield,
  onUnlockRoyalUndo,
  onUnlockApadanaSkin,
  t,
  lang,
}) => {
  const [promoCode, setPromoCode] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Track claimed status in localStorage
  const [telegramClaimed, setTelegramClaimed] = useState<boolean>(() => {
    return localStorage.getItem('worldplay_telegram_claimed') === 'true';
  });
  const [instagramClaimed, setInstagramClaimed] = useState<boolean>(() => {
    return localStorage.getItem('worldplay_insta_claimed') === 'true';
  });
  const [youtubeClaimed, setYoutubeClaimed] = useState<boolean>(() => {
    return localStorage.getItem('worldplay_youtube_claimed') === 'true';
  });

  if (!isOpen) return null;

  // Social handles (Easily configurable by the user)
  const TELEGRAM_URL = 'https://t.me/worldplay_chess';
  const INSTAGRAM_URL = 'https://instagram.com/worldplay.ir';
  const YOUTUBE_URL = 'https://youtube.com/@worldplay_chess';

  const handleJoinTelegram = () => {
    window.open(TELEGRAM_URL, '_blank');
    if (!telegramClaimed) {
      setTimeout(() => {
        onAddCoins(200);
        if (onUnlockFlagShield) onUnlockFlagShield();
        setTelegramClaimed(true);
        localStorage.setItem('worldplay_telegram_claimed', 'true');
        setStatusMessage({
          text: lang === 'fa' 
            ? 'پاداش تلگرام ثبت شد: ۲۰۰ دریک زرین + فعال‌سازی سپر ۵ ثانیه فرجه اضطراری زمان! 🛡️' 
            : 'Telegram reward claimed: 200 Darics + 5s Emergency Time Shield activated! 🛡️',
          isError: false
        });
      }, 1000);
    }
  };

  const handleFollowInstagram = () => {
    window.open(INSTAGRAM_URL, '_blank');
    if (!instagramClaimed) {
      setTimeout(() => {
        onAddCoins(120);
        if (onUnlockRoyalUndo) onUnlockRoyalUndo();
        if (onUnlockApadanaSkin) onUnlockApadanaSkin();
        setInstagramClaimed(true);
        localStorage.setItem('worldplay_insta_claimed', 'true');
        setStatusMessage({
          text: lang === 'fa' 
            ? 'پاداش اینستاگرام ثبت شد: ۱۲۰ دریک زرین + فعال‌سازی فرمان بازگشت کوروش (لغو اشتباه) + پوسته کاخ آپادانا! 🏛️' 
            : 'Instagram reward claimed: 120 Darics + Royal Undo privilege + Apadana Palace theme unlocked! 🏛️',
          isError: false
        });
      }, 1000);
    }
  };

  const handleSubscribeYouTube = () => {
    window.open(YOUTUBE_URL, '_blank');
    if (!youtubeClaimed) {
      setTimeout(() => {
        onAddCoins(250);
        if (onUnlockPlatinumBooster) onUnlockPlatinumBooster();
        setYoutubeClaimed(true);
        localStorage.setItem('worldplay_youtube_claimed', 'true');
        setStatusMessage({
          text: lang === 'fa' 
            ? 'شاهکار! پاداش یوتیوب ثبت شد: ۲۵۰ دریک زرین + آنلاک دائمی کارت پلاتینیومی ۶۵ ثانیه! 💎' 
            : 'Magnificent! YouTube reward claimed: 250 Darics + Permanent Royal Platinum 65s Booster unlocked! 💎',
          isError: false
        });
      }, 1000);
    }
  };

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.trim(),
          playerId: localStorage.getItem('worldplay_player_id') || 'player_1'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onAddCoins(data.coinsGranted);
        setStatusMessage({
          text: lang === 'fa' ? data.messageFa : data.messageEn,
          isError: false
        });
        setPromoCode('');
      } else {
        setStatusMessage({
          text: lang === 'fa' ? (data.errorFa || 'کد هدیه نامعتبر است.') : (data.errorEn || 'Invalid promo code.'),
          isError: true
        });
      }
    } catch {
      setStatusMessage({
        text: lang === 'fa' ? 'خطا در ارتباط با سرور هدایا' : 'Server error occurred',
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#1e1914] border-2 border-amber-500 rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#5a4630] bg-[#241e19]">
          <div className="flex items-center gap-2">
            <Gift className="text-amber-400" size={24} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#f0c04a]">
                {lang === 'fa' ? 'زرادخانه شاهنشاهی و هدایای هواداران' : 'Imperial Arsenal & Social Perks'}
              </h2>
              <p className="text-[11px] text-stone-400">
                {lang === 'fa' ? 'عضویت در شبکه‌ها = باز شدن ابزارهای فوق‌پیشرفته درون بازی' : 'Follow our channels to unlock exclusive gameplay tools'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#3a322b] hover:bg-[#4a3f36] text-stone-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div className={`p-3 text-xs font-bold flex items-center gap-2 border-b ${
            statusMessage.isError
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            {statusMessage.isError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs text-stone-200">
          {/* YouTube Channel Card (VIP Platinum 65s Booster) */}
          <div className="p-3.5 bg-gradient-to-r from-[#2c0b0e] to-[#1a0f12] border border-red-500/50 rounded-xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/60 flex items-center justify-center text-red-500">
                <Youtube size={22} />
              </div>
              <div>
                <div className="font-bold text-stone-100 flex items-center gap-1.5">
                  <span>{t.youtube}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">+250 🪙</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">💎 کارت پلاتینیوم ۶۵ث</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {lang === 'fa' ? 'سابسکرایب یوتیوب = باز شدن کارت ۴ام زمان ۶۵ ثانیه‌ای در بازی' : 'Subscribe = Unlocks the 4th Royal 65s Platinum Booster'}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubscribeYouTube}
              className="flex items-center gap-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black transition-all shadow cursor-pointer active:scale-95"
            >
              <span>{youtubeClaimed ? (lang === 'fa' ? 'فعال شد' : 'Active') : (lang === 'fa' ? 'سابسکرایب' : 'Subscribe')}</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* Telegram Channel Card (Shield & Darics) */}
          <div className="p-3.5 bg-gradient-to-r from-[#17212b] to-[#202b36] border border-sky-500/40 rounded-xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400">
                <Send size={20} />
              </div>
              <div>
                <div className="font-bold text-stone-100 flex items-center gap-1.5">
                  <span>{lang === 'fa' ? 'کانال رسمی تلگرام همجهان' : 'Official Telegram Channel'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">+200 🪙</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">🛡️ سپر ۵ث فرجه</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {lang === 'fa' ? 'عضویت = دریافت روزانه کدهای هدیه + بیمه سقوط زمان' : 'Join = Daily gift codes + 5s flag-fall buffer'}
                </div>
              </div>
            </div>

            <button
              onClick={handleJoinTelegram}
              className="flex items-center gap-1 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow cursor-pointer active:scale-95"
            >
              <span>{telegramClaimed ? (lang === 'fa' ? 'فعال شد' : 'Active') : (lang === 'fa' ? 'عضویت' : 'Join')}</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* Instagram Follow Card (Royal Undo & Apadana Skin) */}
          <div className="p-3.5 bg-gradient-to-r from-[#2c1328] to-[#1a1224] border border-pink-500/40 rounded-xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/50 flex items-center justify-center text-pink-400">
                <Instagram size={20} />
              </div>
              <div>
                <div className="font-bold text-stone-100 flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'fa' ? 'صفحه اینستاگرام همجهان' : 'Official Instagram Page'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono">+120 🪙</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">🏛️ پوسته آپادانا</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold">🔄 لغو اشتباه</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {lang === 'fa' ? 'فالو پیج = باز شدن رایگان پوسته کاخ آپادانا + فرصت بازگشت حرکت اشتباه' : 'Follow = Free Apadana theme + Royal Undo move reversal'}
                </div>
              </div>
            </div>

            <button
              onClick={handleFollowInstagram}
              className="flex items-center gap-1 py-2 px-3 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold transition-all shadow cursor-pointer active:scale-95"
            >
              <span>{instagramClaimed ? (lang === 'fa' ? 'فعال شد' : 'Active') : (lang === 'fa' ? 'فالو' : 'Follow')}</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* Daily Promo Code Box */}
          <div className="p-3.5 bg-[#241e19] border border-amber-500/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>{lang === 'fa' ? 'ثبت کد هدیه روزانه تلگرام و یوتیوب' : 'Redeem Telegram & YouTube Daily Code'}</span>
              </span>
              <span className="text-[10px] text-stone-400">
                {lang === 'fa' ? '(کدهای روزانه فقط در کانال‌ها منتشر می‌شوند)' : '(Published daily in channels)'}
              </span>
            </div>

            <form onSubmit={handleRedeemCode} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                placeholder={lang === 'fa' ? 'مثال: CYRUS2026 یا YOUTUBE_VIP' : 'e.g. CYRUS2026 or YOUTUBE_VIP'}
                className="flex-1 bg-[#181310] border border-stone-700 rounded-lg px-3 py-2 text-amber-200 placeholder-stone-600 font-mono text-xs uppercase focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={loading || !promoCode.trim()}
                className="py-2 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black transition-all disabled:opacity-40 cursor-pointer shadow"
              >
                {loading ? '...' : (lang === 'fa' ? 'دریافت' : 'Claim')}
              </button>
            </form>

            <div className="text-[10px] text-stone-500 italic">
              {lang === 'fa'
                ? '💡 راهنمایی: کدهای فعال آزمایشی: CYRUS2026 (۱۵۰ دریک) | HAMJAHAN (۱۰۰ دریک) | YOUTUBE_VIP (۲۵۰ دریک)'
                : '💡 Tip: Active test codes: CYRUS2026 (150 Darics) | HAMJAHAN (100 Darics) | YOUTUBE_VIP (250 Darics)'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#241e19] border-t border-[#3a322b] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#3a322b] hover:bg-[#4a3f36] text-stone-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
