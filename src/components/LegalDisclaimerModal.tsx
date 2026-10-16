import React from 'react';
import { TranslationDictionary, Language } from '../types/chess.ts';
import { Scale, CheckCircle2, X } from 'lucide-react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
  lang: Language;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({
  isOpen,
  onClose,
  t,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#1e1914] border-2 border-amber-600 rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#5a4630] bg-[#241e19]">
          <div className="flex items-center gap-2">
            <Scale className="text-amber-500" size={24} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-400">
                {t.legalNoticeTitle}
              </h2>
              <p className="text-[11px] text-stone-400">
                {lang === 'fa' ? 'خطاب به فدراسیون شطرنج و نهادهای ناظر' : 'Official Notice to Chess Federations & Governing Bodies'}
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

        {/* Official Body Text */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-stone-200 leading-relaxed">
          <div className="p-4 bg-[#282019] border-r-4 border-amber-500 rounded-lg text-justify font-serif text-amber-100 shadow-inner">
            {t.officialDisclaimerText}
          </div>

          <div className="space-y-2 text-xs text-stone-400">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                {lang === 'fa'
                  ? 'این اثر یک بازی ویدئویی مستقل با مکانیک نوآورانه کارت‌های تمدید زمان و هویت تاریخی ایران باستان است.'
                  : 'This application is an independent artistic project featuring innovative turn-booster game mechanics and ancient Persian heritage.'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                {lang === 'fa'
                  ? 'تمامی حقوق معنوی هویت بصری، کارت‌ها و نام «همجهان» محفوظ است.'
                  : 'All intellectual property and artistic representations of Worldplay are preserved.'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#241e19] border-t border-[#3a322b] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs font-bold transition-all cursor-pointer shadow"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
