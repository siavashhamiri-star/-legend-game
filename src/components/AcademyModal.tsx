import React, { useState } from 'react';
import { TranslationDictionary, Language } from '../types/chess.ts';
import { BookOpen, Shield, Award, Sparkles, Feather, X } from 'lucide-react';

interface AcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
  lang: Language;
}

export const AcademyModal: React.FC<AcademyModalProps> = ({
  isOpen,
  onClose,
  t,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'beginner' | 'pro' | 'ultra' | 'philosophy'>('beginner');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#1e1914] border-2 border-[#f0c04a] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#5a4630] bg-[#241e19]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-lg font-black text-[#f0c04a]">
                {t.academy}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'fa' ? 'مکتب خردورزی، استراتژی و چترنگ کهن پارسی' : 'Academy of Strategic Wisdom & Ancient Persian Chatrang'}
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

        {/* Tab Selector */}
        <div className="flex border-b border-[#3a322b] bg-[#1a1512] overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('beginner')}
            className={`flex-1 py-3 px-3 text-center whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'beginner'
                ? 'border-b-2 border-[#f0c04a] text-[#f0c04a] bg-[#241e19]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen size={14} />
            <span>{lang === 'fa' ? 'سطح ۱: مبتدی' : 'Tier 1: Apprentice'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pro')}
            className={`flex-1 py-3 px-3 text-center whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'pro'
                ? 'border-b-2 border-[#f0c04a] text-[#f0c04a] bg-[#241e19]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield size={14} />
            <span>{lang === 'fa' ? 'سطح ۲: حرفه‌ای' : 'Tier 2: Commander'}</span>
          </button>

          <button
            onClick={() => setActiveTab('ultra')}
            className={`flex-1 py-3 px-3 text-center whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ultra'
                ? 'border-b-2 border-[#f0c04a] text-[#f0c04a] bg-[#241e19]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Award size={14} />
            <span>{lang === 'fa' ? 'سطح ۳: فوق‌حرفه‌ای' : 'Tier 3: Master'}</span>
          </button>

          <button
            onClick={() => setActiveTab('philosophy')}
            className={`flex-1 py-3 px-3 text-center whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'philosophy'
                ? 'border-b-2 border-[#f0c04a] text-[#f0c04a] bg-[#241e19]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Feather size={14} />
            <span>{lang === 'fa' ? 'فلسفه و تاریخ کهن' : 'Cultural Philosophy'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-stone-200">
          {activeTab === 'beginner' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>🛡️</span>
                {lang === 'fa' ? 'آشنایی با مهره‌ها و ساعت سرعتی ۳۰ ثانیه' : 'The Imperial Pieces & 30-Second Turn Clock'}
              </h3>
              <p>
                {lang === 'fa'
                  ? 'در همجهان، هر بازیکن برای اندیشیدن و اجرای حرکت خود دارای یک زمان پایه ۳۰ ثانیه‌ای است. شاه مظهر کوروش بزرگ، ملکه در جایگاه بانو ماندانا، اسب‌ها برآمده از سرستون‌های دو سر تخت جمشید، فیل‌ها از جنس مفرغ‌های کهن و پیاده‌ها نماد سپاه نام‌آور جاویدان هستند.'
                  : 'In Worldplay, each strategist operates under a dynamic 30-second turn clock. The King embodies Cyrus the Great, the Queen reflects Lady Mandana, the Knights depict the fluted capitals of Persepolis, Bishops take form as ancient Persian bronze artifacts, and Pawns stand as the legendary Immortals.'}
              </p>
              <div className="p-3 bg-[#28221b] border border-amber-900/50 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-amber-300">
                  {lang === 'fa' ? 'قانون کارت‌های سه‌گانه زمان:' : 'The Rule of the Three Boosters:'}
                </div>
                <div>🥉 <strong>{t.bronze}:</strong> {lang === 'fa' ? 'تمدید زمان نوبت تا سقف ۴۵ ثانیه' : 'Extends turn allowance to 45 seconds.'}</div>
                <div>🥈 <strong>{t.silver}:</strong> {lang === 'fa' ? 'تمدید زمان نوبت تا سقف ۵۰ ثانیه' : 'Extends turn allowance to 50 seconds.'}</div>
                <div>🥇 <strong>{t.gold}:</strong> {lang === 'fa' ? 'تمدید زمان نوبت تا سقف ۵۵ ثانیه' : 'Extends turn allowance to 55 seconds.'}</div>
              </div>
            </div>
          )}

          {activeTab === 'pro' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>⚔️</span>
                {lang === 'fa' ? 'مدیریت ریتم و روانشناسی کارت‌های زمان' : 'Tempo Management & Booster Psychology'}
              </h3>
              <p>
                {lang === 'fa'
                  ? 'یک فرمانده دانا هرگز کارت‌های تقویتی خود را در گشایش بی‌دلیل مصرف نمی‌کند. کارت‌ها برگ‌های برنده شما در پیچیدگی‌های سنگین وسط‌بازی یا زمانی هستند که حریف با فشردگی زمان مواجه است.'
                  : 'An adept commander never exhausts tactical booster cards in the opening. Save them for intricate middlegame tactical crossroads or critical endgames where every fraction of a second determines the victor.'}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-300">
                <li>{lang === 'fa' ? 'کارت برنزی (۴۵ث) را برای بررسی ساختارهای پیچیده پیاده‌ای نگه دارید.' : 'Deploy Bronze (45s) when calculating multi-piece pawn tension.'}</li>
                <li>{lang === 'fa' ? 'کارت طلایی (۵۵ث) در زمان کمتر از ۵ ثانیه می‌تواند شما را از سقوط پرچم نجات دهد.' : 'Activate Gold (55s) in time scrambles (<5s) to turn impending defeat into triumph.'}</li>
                <li>{lang === 'fa' ? 'فشار روانی سرعت: بازی سریع در نوبت حریف، زمان تصمیم‌گیری او را تحلیل می‌برد.' : 'Pacing pressure: Playing with crisp clarity forces the opponent into clock panic.'}</li>
              </ul>
            </div>
          )}

          {activeTab === 'ultra' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>👑</span>
                {lang === 'fa' ? 'استراتژی‌های پیشرفته و دام‌های سلطنتی' : 'Master Tactics & Imperial Traps'}
              </h3>
              <p>
                {lang === 'fa'
                  ? 'در سطوح استادان همجهان، قربانی مهره‌های سبک برای تصاحب ستون‌های باز یا کشاندن شاه حریف به معرض دید سواران تخت جمشید، کلید برتری قطعی است.'
                  : 'At the Grandmaster echelon, sacrifices of minor pieces to shatter defensive pawn barriers and expose the opponent’s monarch to Persepolis flank attacks create decisive winning advantages.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-[#28221b] rounded-xl border border-stone-700">
                  <div className="font-bold text-amber-400 mb-1">
                    {lang === 'fa' ? 'کمین سواران آپادانا' : 'The Apadana Ambush'}
                  </div>
                  <p className="text-stone-300">
                    {lang === 'fa' ? 'استفاده از اسب در خانه d5 یا e5 برای قطع پیوند رخ‌ها و حمله به وزیر.' : 'Establishing an unassailable knight outpost on d5/e5 to paralyze enemy rooks.'}
                  </p>
                </div>
                <div className="p-3 bg-[#28221b] rounded-xl border border-stone-700">
                  <div className="font-bold text-amber-400 mb-1">
                    {lang === 'fa' ? 'سد جاویدان' : 'The Immortal Rampart'}
                  </div>
                  <p className="text-stone-300">
                    {lang === 'fa' ? 'زنجیره پیاده‌های متصل در مرکز که از پیشروی فیل‌های حریف جلوگیری می‌کند.' : 'A connected pawn phalanx locking center squares against bishop diagonal slices.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'philosophy' && (
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-amber-900/30 to-amber-700/20 border border-amber-500/40 rounded-xl">
                <h4 className="font-bold text-[#f0c04a] text-sm mb-1">
                  {t.chatrangPhilosophyTitle}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {t.chatrangPhilosophyBody}
                </p>
              </div>

              <div className="space-y-2 text-xs text-stone-300">
                <p>
                  {lang === 'fa'
                    ? '«همجهان» یک بازی برای نابودی فیزیکی نیست؛ دعوتی است به زیستِ مسالمت‌آمیز از خلال بازی فکری. منشور کوروش بزرگ در پاسارگاد نخستین سند کرامت انسانی و صلح در جهان است. ما در این برنامه با تلفیق هنر هخامنشی و قوانین پویای زمان، تجلی این اندیشه را بازآفریده‌ایم.'
                    : '"Worldplay" is not designed for physical annihilation; it is an open invitation to peaceful coexistence through intellectual duel. The Cyrus Cylinder stands as humanity’s premier charter of human dignity and peace. In this game, we unite Achaemenid heritage with dynamic speed rules to celebrate this timeless legacy.'}
                </p>
              </div>
            </div>
          )}
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
