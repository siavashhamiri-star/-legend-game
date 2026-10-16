import React from 'react';
import { CIVILIZATIONS } from '../utils/civilizations.ts';
import { PieceStyle, BoardTheme, TranslationDictionary } from '../types/chess.ts';
import { ChessPiece } from './ChessPiece.tsx';
import { Globe2, X, Check, Sparkles } from 'lucide-react';

interface CivilizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPieceStyle: PieceStyle;
  currentBoardTheme: BoardTheme;
  enableMetallurgy?: boolean;
  onToggleMetallurgy?: () => void;
  onSelectCivilization: (pieceStyle: PieceStyle, boardTheme: BoardTheme) => void;
  t: TranslationDictionary;
  lang: 'fa' | 'en';
}

export const CivilizationModal: React.FC<CivilizationModalProps> = ({
  isOpen,
  onClose,
  currentPieceStyle,
  enableMetallurgy = false,
  onToggleMetallurgy,
  onSelectCivilization,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1c1815] border border-amber-500/40 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a322b] bg-gradient-to-r from-[#241e19] to-[#1c1815]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Globe2 size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                <span>{lang === 'fa' ? 'تمدن‌ها و اساطیر جهان' : 'World Civilizations & Mythologies'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  {lang === 'fa' ? 'نسخه بین‌المللی' : 'Global Edition'}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                {lang === 'fa'
                  ? 'تمدن خود را برگزینید تا مهره‌ها، تخته و هویت نبرد تغییر کند'
                  : 'Select your civilization to customize pieces, board, and royal lore'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metallurgy Fusion Showcase Bar */}
        <div className="mx-4 mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-950/60 via-stone-900/90 to-amber-900/50 border border-amber-500/40 shadow-md">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚗️</span>
              <div>
                <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <span>{lang === 'fa' ? 'ادغام عناصر و فلزات کیمیاگری در مهره‌ها' : 'Alchemical Metallurgy Fusion'}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-mono">
                    VIP Mode
                  </span>
                </h4>
                <p className="text-[11px] text-stone-300">
                  {lang === 'fa'
                    ? 'شاه: طلایی | ملکه: نقره‌ای | فیل: برنزی | اسب: چوبی | رخ: آلومینیومی | سرباز: آهنی'
                    : 'King: Gold | Queen: Silver | Bishop: Bronze | Knight: Wood | Rook: Aluminum | Pawn: Iron'}
                </p>
              </div>
            </div>

            {onToggleMetallurgy && (
              <button
                onClick={onToggleMetallurgy}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  enableMetallurgy
                    ? 'bg-amber-500 text-stone-950 shadow-amber-500/30'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600'
                }`}
              >
                <Sparkles size={13} />
                <span>
                  {enableMetallurgy
                    ? (lang === 'fa' ? 'عناصر فعال است ✓' : 'Fused Active ✓')
                    : (lang === 'fa' ? 'فعال‌سازی در تمدن‌ها' : 'Enable Metallurgy')}
                </span>
              </button>
            )}
          </div>

          {/* 6 Preview Pieces */}
          <div className="grid grid-cols-6 gap-1.5 mt-2.5 pt-2 border-t border-amber-500/20">
            <div className="flex flex-col items-center p-1 rounded bg-stone-900/70 border border-amber-500/30">
              <div className="w-7 h-7">
                <ChessPiece type="k" color="w" style="alchemy" enableMetallurgy={true} />
              </div>
              <span className="text-[9px] font-bold text-amber-300 mt-0.5">{lang === 'fa' ? 'طلایی' : 'Gold'}</span>
              <span className="text-[8px] text-stone-400">{lang === 'fa' ? 'شاه' : 'King'}</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-stone-900/70 border border-slate-400/30">
              <div className="w-7 h-7">
                <ChessPiece type="q" color="w" style="alchemy" enableMetallurgy={true} />
              </div>
              <span className="text-[9px] font-bold text-slate-200 mt-0.5">{lang === 'fa' ? 'نقره‌ای' : 'Silver'}</span>
              <span className="text-[8px] text-stone-400">{lang === 'fa' ? 'ملکه' : 'Queen'}</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-stone-900/70 border border-amber-700/30">
              <div className="w-7 h-7">
                <ChessPiece type="b" color="w" style="alchemy" enableMetallurgy={true} />
              </div>
              <span className="text-[9px] font-bold text-amber-500 mt-0.5">{lang === 'fa' ? 'برنزی' : 'Bronze'}</span>
              <span className="text-[8px] text-stone-400">{lang === 'fa' ? 'فیل' : 'Bishop'}</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-stone-900/70 border border-yellow-800/30">
              <div className="w-7 h-7">
                <ChessPiece type="n" color="w" style="alchemy" enableMetallurgy={true} />
              </div>
              <span className="text-[9px] font-bold text-amber-600 mt-0.5">{lang === 'fa' ? 'چوبی' : 'Wood'}</span>
              <span className="text-[8px] text-stone-400">{lang === 'fa' ? 'اسب' : 'Knight'}</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-stone-900/70 border border-slate-300/30">
              <div className="w-7 h-7">
                <ChessPiece type="r" color="w" style="alchemy" enableMetallurgy={true} />
              </div>
              <span className="text-[9px] font-bold text-slate-300 mt-0.5">{lang === 'fa' ? 'آلومینیوم' : 'Alloy'}</span>
              <span className="text-[8px] text-stone-400">{lang === 'fa' ? 'رخ' : 'Rook'}</span>
            </div>
            <div className="flex flex-col items-center p-1 rounded bg-stone-900/70 border border-zinc-500/30">
              <div className="w-7 h-7">
                <ChessPiece type="p" color="w" style="alchemy" enableMetallurgy={true} />
              </div>
              <span className="text-[9px] font-bold text-stone-300 mt-0.5">{lang === 'fa' ? 'آهنی' : 'Iron'}</span>
              <span className="text-[8px] text-stone-400">{lang === 'fa' ? 'پیاده' : 'Pawn'}</span>
            </div>
          </div>
        </div>

        {/* Civilization Cards List */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {CIVILIZATIONS.map(civ => {
            const isSelected = currentPieceStyle === civ.id;

            return (
              <div
                key={civ.id}
                onClick={() => onSelectCivilization(civ.id, civ.boardTheme)}
                className={`relative rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-400/90 shadow-lg shadow-amber-950/50 ring-1 ring-amber-400/50'
                    : 'bg-[#241e19]/90 border-[#3a322b] hover:border-amber-600/60 hover:bg-[#2d251f]'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  {/* Flag & Miniature Piece Preview */}
                  <div className="flex flex-col items-center justify-center gap-1 min-w-[52px]">
                    <span className="text-2xl drop-shadow-md">{civ.flag}</span>
                    <div className="w-10 h-10 rounded-lg bg-stone-900/80 border border-stone-700/60 flex items-center justify-center p-1 shadow-inner">
                      <ChessPiece type="k" color="w" style={civ.id} />
                    </div>
                  </div>

                  {/* Lore Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-sm text-[#f5ecd9] flex items-center gap-1.5">
                        <span>{lang === 'fa' ? civ.nameFa : civ.nameEn}</span>
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
                        {civ.country}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-amber-300/90 font-medium">
                      👑 {lang === 'fa' ? civ.kingNameFa : civ.kingNameEn}
                    </div>

                    <div className="text-[11px] text-stone-300/80">
                      👸 {lang === 'fa' ? civ.queenNameFa : civ.queenNameEn}
                    </div>

                    <p className="mt-1 text-[11px] text-stone-400 leading-relaxed line-clamp-2">
                      {lang === 'fa' ? civ.descriptionFa : civ.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Apply Button & Status */}
                <div className="w-full sm:w-auto flex sm:flex-col items-center justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                  {isSelected ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                      <Check size={14} />
                      <span>{lang === 'fa' ? 'تمدن فعال' : 'Active'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCivilization(civ.id, civ.boardTheme);
                      }}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-amber-950 font-black text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Sparkles size={13} />
                      <span>{lang === 'fa' ? 'انتخاب تمدن' : 'Select'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#3a322b] bg-[#16120f] flex items-center justify-between text-xs text-stone-400">
          <span>
            {lang === 'fa'
              ? `دسترسی کامل به تمام ${CIVILIZATIONS.length} تمدن و امپراتوری کهن جهان`
              : `All ${CIVILIZATIONS.length} Global Mythological Civilizations Unlocked`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#3a322b] hover:bg-[#4a3f36] text-stone-200 font-bold transition-colors cursor-pointer"
          >
            {lang === 'fa' ? 'تایید و بستن' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
