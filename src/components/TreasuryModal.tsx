import React, { useState } from 'react';
import { TranslationDictionary, Language } from '../types/chess.ts';
import { Coins, Sparkles, Tv, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface TreasuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onAddCoins: (amount: number) => void;
  onUnlockTheme: (themeKey: string) => void;
  unlockedThemes: string[];
  t: TranslationDictionary;
  lang: Language;
}

export const TreasuryModal: React.FC<TreasuryModalProps> = ({
  isOpen,
  onClose,
  coins,
  onAddCoins,
  onUnlockTheme,
  unlockedThemes,
  t,
  lang,
}) => {
  const [adWatching, setAdWatching] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  if (!isOpen) return null;

  // Rewarded Ad Simulation (Calls secure backend endpoint /api/claim-reward)
  const handleWatchAd = async () => {
    setAdWatching(true);
    setMessage('');

    setTimeout(async () => {
      try {
        const res = await fetch('/api/claim-reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rewardType: 'coins',
            verificationToken: `ad_token_${Date.now()}`
          })
        });
        const data = await res.json();
        if (data.success) {
          onAddCoins(data.amount || 50);
          setMessage(lang === 'fa' ? data.messageFa : data.messageEn);
        }
      } catch {
        onAddCoins(50);
        setMessage(t.watchAdSuccess);
      } finally {
        setAdWatching(false);
      }
    }, 1500);
  };

  // In-App Purchase Simulation (Calls secure backend endpoint /api/verify-purchase)
  const handleBuyPackage = async (pkgId: string, costInDarics: number, themeToUnlock?: string) => {
    setPurchasing(pkgId);
    setMessage('');

    try {
      if (themeToUnlock) {
        if (coins < costInDarics) {
          setMessage(lang === 'fa' ? 'دریک زرین کافی در خزانه موجود نیست!' : 'Insufficient Golden Darics in treasury!');
          setPurchasing(null);
          return;
        }
        onAddCoins(-costInDarics);
        onUnlockTheme(themeToUnlock);
        setMessage(lang === 'fa' ? 'پوسته با موفقیت آزاد شد!' : 'Palace theme successfully unlocked!');
      } else {
        // Direct cash/daric pack
        const res = await fetch('/api/verify-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packageId: pkgId,
            receiptToken: `rcpt_${Date.now()}`
          })
        });
        const data = await res.json();
        if (data.success && data.coinsGranted) {
          onAddCoins(data.coinsGranted);
          setMessage(lang === 'fa' ? `بسته ${data.unlockedItem} فعال شد!` : `Pack activated!`);
        }
      }
    } catch {
      setMessage(lang === 'fa' ? 'خطا در ثبت تراکنش' : 'Transaction error');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#1e1914] border-2 border-[#f0c04a] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#5a4630] bg-[#241e19]">
          <div className="flex items-center gap-2">
            <Coins className="text-yellow-400" size={24} />
            <div>
              <h2 className="text-lg font-black text-[#f0c04a]">
                {t.shop}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'fa' ? 'خرید بسته‌های دریک زرین، پوسته‌های شاهنشاهی و پاداش‌ها' : 'Imperial Darics, Palace Themes & Rewarded Boosters'}
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

        {/* Treasury Balance Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/60 via-[#261d15] to-amber-950/60 border-b border-[#5a4630] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🪙</span>
            <div>
              <span className="text-xs text-stone-400 font-semibold">{t.daricCoins}</span>
              <div className="text-2xl font-black text-yellow-400 font-mono tabular-nums leading-none">
                {coins}
              </div>
            </div>
          </div>

          {/* Rewarded Ad Action */}
          <button
            onClick={handleWatchAd}
            disabled={adWatching}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Tv size={16} />
            <span>{adWatching ? (lang === 'fa' ? 'در حال پخش درفش...' : 'Streaming...') : t.watchAdForDarics}</span>
          </button>
        </div>

        {message && (
          <div className="p-2.5 bg-amber-500/10 border-b border-amber-500/30 text-center text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={15} />
            <span>{message}</span>
          </div>
        )}

        {/* Shop Items Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-stone-200">
          <div>
            <h3 className="font-bold text-amber-300 uppercase mb-2 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>{lang === 'fa' ? 'بسته‌های سکه دریک زرین' : 'Golden Daric Coin Bundles'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#241e19] border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-100">{lang === 'fa' ? 'کیسه دریک هخامنشی' : 'Imperial Purse'}</div>
                  <div className="text-[11px] text-amber-400 font-mono font-bold">+250 {t.daricCoins}</div>
                </div>
                <button
                  onClick={() => handleBuyPackage('daric_pack_small', 0)}
                  disabled={purchasing === 'daric_pack_small'}
                  className="py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-all cursor-pointer shadow"
                >
                  {purchasing === 'daric_pack_small' ? '...' : (lang === 'fa' ? '۲۹,۰۰۰ ت' : '$0.99')}
                </button>
              </div>

              <div className="p-3 bg-[#241e19] border border-amber-500/40 rounded-xl flex items-center justify-between shadow-md">
                <div>
                  <div className="font-bold text-yellow-300 flex items-center gap-1">
                    <span>👑</span>
                    <span>{lang === 'fa' ? 'صندوقچه سلطنتی کوروش' : 'Royal Treasury Chest'}</span>
                  </div>
                  <div className="text-[11px] text-amber-400 font-mono font-bold">+1000 {t.daricCoins}</div>
                </div>
                <button
                  onClick={() => handleBuyPackage('daric_pack_royal', 0)}
                  disabled={purchasing === 'daric_pack_royal'}
                  className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-stone-950 font-black transition-all cursor-pointer shadow"
                >
                  {purchasing === 'daric_pack_royal' ? '...' : (lang === 'fa' ? '۸۹,۰۰۰ ت' : '$2.99')}
                </button>
              </div>
            </div>
          </div>

          {/* Unlockable Themes */}
          <div>
            <h3 className="font-bold text-amber-300 uppercase mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>{lang === 'fa' ? 'پوسته‌های تزئینی کاخ‌های باستانی' : 'Palace Visual Themes'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#241e19] border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-100">{t.apadanaTheme}</div>
                  <div className="text-[11px] text-stone-400">{lang === 'fa' ? 'کاشی‌کاری فیروزه و طلای هخامنشی' : 'Turquoise and gold glazed palace'}</div>
                </div>
                {unlockedThemes.includes('apadana') ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    {lang === 'fa' ? 'آزاد شده' : 'Unlocked'}
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyPackage('skin_apadana', 150, 'apadana')}
                    className="py-1.5 px-3 rounded-lg bg-[#3a322b] hover:bg-[#4a3f36] text-amber-300 font-bold border border-amber-500/50 transition-all cursor-pointer"
                  >
                    150 🪙
                  </button>
                )}
              </div>

              <div className="p-3 bg-[#241e19] border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-100">{t.persepolisTheme}</div>
                  <div className="text-[11px] text-stone-400">{lang === 'fa' ? 'سنگ بازالت و چوب کهن پارسه' : 'Persepolis Basalt stone & wood'}</div>
                </div>
                {unlockedThemes.includes('persepolis') ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    {lang === 'fa' ? 'آزاد شده' : 'Unlocked'}
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyPackage('skin_persepolis', 200, 'persepolis')}
                    className="py-1.5 px-3 rounded-lg bg-[#3a322b] hover:bg-[#4a3f36] text-amber-300 font-bold border border-amber-500/50 transition-all cursor-pointer"
                  >
                    200 🪙
                  </button>
                )}
              </div>
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
