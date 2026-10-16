import React from 'react';
import { Color, PieceType, PieceStyle } from '../types/chess.ts';

interface ChessPieceProps {
  type: PieceType;
  color: Color;
  style?: PieceStyle;
  className?: string;
  enableMetallurgy?: boolean;
}

const GLYPHS: Record<string, string> = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟'
};

export const ChessPiece: React.FC<ChessPieceProps> = ({
  type,
  color,
  style = 'achaemenid',
  className = '',
  enableMetallurgy = false
}) => {
  const isWhite = color === 'w';

  // 1. Classic Unicode glyphs
  if (style === 'classic') {
    const key = `${color}${type}`;
    const glyph = GLYPHS[key] || '';
    return (
      <span
        className={`inline-block select-none font-serif leading-none transition-transform duration-150 ${
          isWhite
            ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]'
            : 'text-stone-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]'
        } ${className}`}
        style={{ fontSize: 'inherit' }}
      >
        {glyph}
      </span>
    );
  }

  // 2. Modern Vector Staunton Pieces (Standard Tournament)
  if (style === 'vector') {
    const fillColor = isWhite ? '#FFFFFF' : '#262421';
    const strokeColor = isWhite ? '#1c1917' : '#000000';
    const highlightColor = isWhite ? '#f8fafc' : '#44403c';

    return (
      <svg
        viewBox="0 0 45 45"
        className={`w-full h-full select-none pointer-events-none drop-shadow-md transition-transform duration-150 ${className}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === 'p' && (
          <g stroke={strokeColor} strokeWidth="1.5">
            <path
              d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
              fill={fillColor}
            />
            <path d="M12 39.5h21" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M15 35.5h15" stroke={strokeColor} strokeWidth="1.2" />
          </g>
        )}

        {type === 'r' && (
          <g stroke={strokeColor} strokeWidth="1.5">
            <path
              d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1.5-16.5h19l1.5 16.5H14zM11 15h23v-4h-4v2h-4v-2h-7v2h-4v-2h-4v4z"
              fill={fillColor}
            />
            <path d="M14 29.5h17" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M14 16.5h17" stroke={strokeColor} strokeWidth="1.2" />
          </g>
        )}

        {type === 'n' && (
          <g stroke={strokeColor} strokeWidth="1.5">
            <path
              d="M22 10c-3 0-8 2-9 8 0 3 .5 6.5 1.5 8.5-3 .5-4.5 2-4.5 4.5 0 2 2 3.5 4 3.5 1 0 2-.5 2.5-1 1 2 3 3.5 6 3.5 1 0 2-.2 3-.5v2.5h-13v3h27v-3h-3.5c.5-2.5 1.5-6.5 1.5-9.5 0-5-2-9-5-12l-.5-3.5-3-1-2.5-2.5-5 2.5z"
              fill={fillColor}
            />
            <path d="M13.5 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill={isWhite ? '#1c1917' : '#FFFFFF'} />
            <path d="M24 15c2 1 4 3 4 7" stroke={highlightColor} strokeWidth="1.2" />
          </g>
        )}

        {type === 'b' && (
          <g stroke={strokeColor} strokeWidth="1.5">
            <path
              d="M9 39h27v-3H9v3zm3-3v-2.5h21V36H12zm2-2.5c0-4 3-7 5.5-10.5C21 21 22 18.5 22 16c0-2.5-.5-5-2-7 2.5 0 5 2.5 6 5.5 1 2.5.5 6-.5 8.5-2 3.5-4 6.5-4 10.5h-7z"
              fill={fillColor}
            />
            <circle cx="22.5" cy="8" r="2" fill={fillColor} />
            <path d="M20 18h5M22.5 15.5v5" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M15 32.5h15" stroke={strokeColor} strokeWidth="1.2" />
          </g>
        )}

        {type === 'q' && (
          <g stroke={strokeColor} strokeWidth="1.5">
            <path
              d="M9 39h27v-3H9v3zm3-3v-2.5h21V36H12zm1.5-2.5l-3-16 8.5 6.5L22.5 11l3.5 13 8.5-6.5-3 16h-19z"
              fill={fillColor}
            />
            <circle cx="7.5" cy="16.5" r="2" fill={fillColor} />
            <circle cx="15.5" cy="13" r="2" fill={fillColor} />
            <circle cx="22.5" cy="10" r="2" fill={fillColor} />
            <circle cx="29.5" cy="13" r="2" fill={fillColor} />
            <circle cx="37.5" cy="16.5" r="2" fill={fillColor} />
            <path d="M13 29.5h19" stroke={strokeColor} strokeWidth="1.2" />
          </g>
        )}

        {type === 'k' && (
          <g stroke={strokeColor} strokeWidth="1.5">
            <path
              d="M9 39h27v-3H9v3zm3-3v-2.5h21V36H12zm2-2.5c0-4.5 3-8 5-11-2.5-.5-5-2-5-5.5 0-3 2.5-5 5.5-5 1.5 0 3 .5 4 1.5 1-1 2.5-1.5 4-1.5 3 0 5.5 2 5.5 5 0 3.5-2.5 5-5 5.5 2 3 5 6.5 5 11h-19z"
              fill={fillColor}
            />
            <path d="M22.5 5.5v5M20 8h5" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M13 32.5h19" stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="22.5" cy="17" r="1.5" fill={isWhite ? '#1c1917' : '#FFFFFF'} />
          </g>
        )}
      </svg>
    );
  }

  // 3. World Civilization Styles & Alchemical Metallurgy Elements
  // Palette gradients based on chosen civilization or alchemical metallurgy elements
  const isMetallurgy = enableMetallurgy || style === 'alchemy';

  const getThemeGrads = () => {
    // Six Alchemical Metallurgy Materials: Gold King, Silver Queen, Bronze Bishop, Wood Knight, Aluminum Rook, Iron Pawn
    if (isMetallurgy) {
      switch (type) {
        case 'k': // طلای ناب شاهنشاهی (Imperial Pure Gold)
          return {
            primaryLight: ['#fffbeb', '#fde047', '#d97706'],
            primaryDark: ['#fbbf24', '#b45309', '#451a03'],
            crownLight: ['#ffffff', '#fde047', '#b45309'],
            crownDark: ['#fde68a', '#d97706', '#78350f'],
            accent: '#f59e0b',
            strokeLight: '#78350f',
            strokeDark: '#290f02'
          };
        case 'q': // نقره صیقلی، پلاتین و الکتروم ملکه/وزیر (Royal Silver & Platinum)
          return {
            primaryLight: ['#ffffff', '#f1f5f9', '#94a3b8'],
            primaryDark: ['#cbd5e1', '#64748b', '#1e293b'],
            crownLight: ['#ffffff', '#fef08a', '#cbd5e1'],
            crownDark: ['#e2e8f0', '#94a3b8', '#334155'],
            accent: '#38bdf8',
            strokeLight: '#334155',
            strokeDark: '#0f172a'
          };
        case 'b': // برنز کهن و زردرنگ اساطیری فیل (Antique Mythic Bronze)
          return {
            primaryLight: ['#fef3c7', '#d97706', '#92400e'],
            primaryDark: ['#b45309', '#78350f', '#351404'],
            crownLight: ['#fef08a', '#ca8a04', '#78350f'],
            crownDark: ['#d97706', '#92400e', '#451a03'],
            accent: '#10b981',
            strokeLight: '#451a03',
            strokeDark: '#1c0801'
          };
        case 'n': // چوب خراطی‌شده نفیس ساج، آبنوس و گردوی اسب (Carved Artisan Hardwood)
          return {
            primaryLight: ['#fef3c7', '#d97706', '#78350f'],
            primaryDark: ['#78350f', '#451a03', '#1c0701'],
            crownLight: ['#fef3c7', '#d97706', '#b45309'],
            crownDark: ['#92400e', '#542609', '#240d02'],
            accent: '#ca8a04',
            strokeLight: '#451a03',
            strokeDark: '#0f0300'
          };
        case 'r': // آلومینیوم صیقلی، تیتانیوم و آلیاژ فلزی رخ (Brushed Aluminum & Titanium)
          return {
            primaryLight: ['#ffffff', '#f1f5f9', '#cbd5e1'],
            primaryDark: ['#94a3b8', '#475569', '#1e293b'],
            crownLight: ['#ffffff', '#e2e8f0', '#94a3b8'],
            crownDark: ['#cbd5e1', '#64748b', '#334155'],
            accent: '#0284c7',
            strokeLight: '#475569',
            strokeDark: '#0f172a'
          };
        case 'p': // آهن چکش‌خورده دمشقی و فولاد فورج‌شده سرباز (Forged Damascus Iron & Steel)
        default:
          return {
            primaryLight: ['#f1f5f9', '#94a3b8', '#475569'],
            primaryDark: ['#475569', '#1e293b', '#090d16'],
            crownLight: ['#ffffff', '#cbd5e1', '#64748b'],
            crownDark: ['#64748b', '#334155', '#1e293b'],
            accent: '#ef4444',
            strokeLight: '#1e293b',
            strokeDark: '#020617'
          };
      }
    }

    switch (style) {
      case 'england':
        return {
          primaryLight: ['#ffffff', '#fecdd3', '#e11d48'], // English Rose & Crimson
          primaryDark: ['#881337', '#4c0519', '#1e020a'],
          crownLight: ['#fef08a', '#eab308', '#ca8a04'],
          crownDark: ['#854d0e', '#532b05', '#1a0d02'],
          accent: '#e11d48',
          strokeLight: '#3f0611',
          strokeDark: '#120205'
        };
      case 'rome':
        return {
          primaryLight: ['#ffffff', '#f5d0fe', '#a21caf'], // Roman Imperial Purple & Gold
          primaryDark: ['#581c87', '#3b0764', '#17022a'],
          crownLight: ['#fef08a', '#eab308', '#a16207'],
          crownDark: ['#713f12', '#451a03', '#1c0701'],
          accent: '#ca8a04',
          strokeLight: '#2e0854',
          strokeDark: '#0f021c'
        };
      case 'greece':
        return {
          primaryLight: ['#ffffff', '#bae6fd', '#0284c7'], // Olympus Aegean Azure & Marble
          primaryDark: ['#0369a1', '#075985', '#082f49'],
          crownLight: ['#fef08a', '#38bdf8', '#0284c7'],
          crownDark: ['#0284c7', '#0369a1', '#075985'],
          accent: '#38bdf8',
          strokeLight: '#082f49',
          strokeDark: '#031826'
        };
      case 'egypt':
        return {
          primaryLight: ['#ffffff', '#fef08a', '#eab308'], // Pharaoh Gold & Lapis Lazuli
          primaryDark: ['#854d0e', '#451a03', '#1c0b02'],
          crownLight: ['#fde047', '#0284c7', '#ca8a04'],
          crownDark: ['#ca8a04', '#0369a1', '#713f12'],
          accent: '#06b6d4',
          strokeLight: '#451a03',
          strokeDark: '#170901'
        };
      case 'japan':
        return {
          primaryLight: ['#ffffff', '#fbcfe8', '#db2777'], // Sakura Petal & Shogun Gold
          primaryDark: ['#831843', '#500724', '#20010e'],
          crownLight: ['#fde047', '#e11d48', '#b91c1c'],
          crownDark: ['#991b1b', '#7f1d1d', '#450a0a'],
          accent: '#f43f5e',
          strokeLight: '#4c0519',
          strokeDark: '#1f020a'
        };
      case 'arabia':
        return {
          primaryLight: ['#ffffff', '#fed7aa', '#ea580c'], // Desert Sun & Rose-Rock Petra
          primaryDark: ['#9a3412', '#6c2106', '#2d0a02'],
          crownLight: ['#fde047', '#d97706', '#b45309'],
          crownDark: ['#b45309', '#78350f', '#351404'],
          accent: '#f59e0b',
          strokeLight: '#431407',
          strokeDark: '#1a0602'
        };
      case 'nordic':
        return {
          primaryLight: ['#ffffff', '#cbd5e1', '#64748b'], // Scandinavian Frost & Silver
          primaryDark: ['#334155', '#1e293b', '#0f172a'],
          crownLight: ['#e2e8f0', '#38bdf8', '#0284c7'],
          crownDark: ['#475569', '#1e293b', '#0284c7'],
          accent: '#38bdf8',
          strokeLight: '#0f172a',
          strokeDark: '#020617'
        };
      case 'ottoman':
        return {
          primaryLight: ['#ffffff', '#fecdd3', '#e11d48'], // Ottoman White Ceramic & Imperial Crimson
          primaryDark: ['#881337', '#5c071e', '#230209'], // Imperial Ottoman Velvet & Crimson
          crownLight: ['#fde047', '#eab308', '#b91c1c'], // Sultan Suleiman Gold & Ruby
          crownDark: ['#b91c1c', '#7f1d1d', '#450a0a'],
          accent: '#059669', // Haseki Emerald & Iznik Turquoise
          strokeLight: '#3f0611',
          strokeDark: '#190206'
        };
      case 'china':
        return {
          primaryLight: ['#ffffff', '#fef08a', '#eab308'], // Imperial Silk Ivory & Dragon Gold
          primaryDark: ['#991b1b', '#7f1d1d', '#3f0707'], // Cinnabar Red & Imperial Lacquer
          crownLight: ['#facc15', '#f59e0b', '#ca8a04'], // Dragon Emperor Gold
          crownDark: ['#b91c1c', '#854d0e', '#3f0611'],
          accent: '#10b981', // Imperial Jade
          strokeLight: '#450a0a',
          strokeDark: '#1c0404'
        };
      case 'india':
        return {
          primaryLight: ['#ffffff', '#fef3c7', '#f59e0b'], // Mughal Royal Silk & Gold
          primaryDark: ['#047857', '#065f46', '#022c22'], // Imperial Mughal Emerald & Jade
          crownLight: ['#fde047', '#f59e0b', '#b45309'], // Emperor Akbar Sarpech Gold & Ruby
          crownDark: ['#b45309', '#065f46', '#022c22'],
          accent: '#f59e0b', // Imperial Saffron
          strokeLight: '#064e3b',
          strokeDark: '#021b14'
        };
      case 'russia':
        return {
          primaryLight: ['#ffffff', '#f8fafc', '#e2e8f0'], // Imperial Winter Ermine & Diamond
          primaryDark: ['#1e3a8a', '#1e1b4b', '#0f172a'], // Imperial Russian Imperial Navy & Sapphire
          crownLight: ['#fde047', '#eab308', '#ca8a04'], // Romanov Crown Gold
          crownDark: ['#ca8a04', '#991b1b', '#450a0a'],
          accent: '#06b6d4', // St. Petersburg Winter Malachite / Ice
          strokeLight: '#1e3a8a',
          strokeDark: '#0f172a'
        };
      case 'achaemenid':
      default:
        return {
          primaryLight: ['#fff3b0', '#e5a93c', '#a36b12'], // Cyrus Royal Gold & Mandana Silver
          primaryDark: ['#785928', '#453011', '#1f1404'],
          crownLight: ['#fde047', '#f59e0b', '#b45309'],
          crownDark: ['#b45309', '#78350f', '#301303'],
          accent: '#06b6d4',
          strokeLight: '#3d2806',
          strokeDark: '#140c02'
        };
    }
  };

  const themeConfig = getThemeGrads();
  const gradColors = isWhite ? themeConfig.primaryLight : themeConfig.primaryDark;
  const crownColors = isWhite ? themeConfig.crownLight : themeConfig.crownDark;
  const strokeCol = isWhite ? themeConfig.strokeLight : themeConfig.strokeDark;
  const gradId = `civ_grad_${style}_${color}_${type}${isMetallurgy ? '_metal' : ''}`;
  const crownGradId = `civ_crown_${style}_${color}_${type}${isMetallurgy ? '_metal' : ''}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full select-none pointer-events-none drop-shadow-lg transition-transform duration-150 ${className}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradColors[0]} />
          <stop offset="50%" stopColor={gradColors[1]} />
          <stop offset="100%" stopColor={gradColors[2]} />
        </linearGradient>
        <linearGradient id={crownGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={crownColors[0]} />
          <stop offset="50%" stopColor={crownColors[1]} />
          <stop offset="100%" stopColor={crownColors[2]} />
        </linearGradient>
      </defs>

      {/* KING: Mythological Sovereign */}
      {type === 'k' && (
        <g stroke={strokeCol} strokeWidth="2.5">
          {/* Imperial Base */}
          <path d="M20 88 h60 v-8 c-6 -3 -12 -5 -30 -5 s-24 2 -30 5 z" fill={`url(#${gradId})`} />
          <line x1="25" y1="84" x2="75" y2="84" stroke={isWhite ? '#fef08a' : '#92400e'} strokeWidth="1.5" />
          {/* Royal Body */}
          <path d="M28 75 C24 58 35 45 50 45 C65 45 76 58 72 75 Z" fill={`url(#${gradId})`} />
          <circle cx="50" cy="55" r="8" fill="none" stroke={isWhite ? '#fef08a' : '#d97706'} strokeWidth="2" />

          {/* Crown Specific to Civilization */}
          {style === 'england' && (
            // King Arthur Cross Crown
            <g>
              <path d="M28 42 L32 20 L42 26 L50 12 L58 26 L68 20 L72 42 Z" fill={`url(#${crownGradId})`} />
              <path d="M50 6 v10 M46 10 h8" stroke={strokeCol} strokeWidth="2.5" />
              <circle cx="50" cy="20" r="3" fill="#e11d48" />
            </g>
          )}

          {style === 'rome' && (
            // Julius Caesar Golden Laurel Wreath
            <g>
              <ellipse cx="50" cy="30" rx="18" ry="14" fill={`url(#${gradId})`} />
              <path d="M30 35 C32 22 42 16 50 16 C58 16 68 22 70 35" fill="none" stroke="#facc15" strokeWidth="4" />
              <circle cx="50" cy="16" r="3" fill="#ca8a04" />
            </g>
          )}

          {style === 'greece' && (
            // Zeus Thunderbolt Crown
            <g>
              <path d="M28 42 L34 22 L44 30 L50 12 L56 30 L66 22 L72 42 Z" fill={`url(#${crownGradId})`} />
              <path d="M47 8 L54 16 L49 18 L53 26" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <circle cx="50" cy="14" r="3" fill="#38bdf8" />
            </g>
          )}

          {style === 'egypt' && (
            // Pharaoh Nemes Headdress with Cobra (Uraeus)
            <g>
              <path d="M26 44 L30 18 C40 14 60 14 70 18 L74 44 Z" fill={`url(#${crownGradId})`} />
              <line x1="38" y1="20" x2="38" y2="44" stroke="#0284c7" strokeWidth="2" />
              <line x1="50" y1="18" x2="50" y2="44" stroke="#0284c7" strokeWidth="2" />
              <line x1="62" y1="20" x2="62" y2="44" stroke="#0284c7" strokeWidth="2" />
              <circle cx="50" cy="14" r="3.5" fill="#facc15" stroke="#ef4444" strokeWidth="1.5" />
            </g>
          )}

          {style === 'japan' && (
            // Shogun Kabuto Helmet with Golden Crescent (Maedate)
            <g>
              <path d="M26 42 L34 24 L50 20 L66 24 L74 42 Z" fill={`url(#${gradId})`} />
              <path d="M35 18 Q50 6 65 18 Q50 14 35 18 Z" fill="#facc15" stroke={strokeCol} strokeWidth="1.5" />
              <circle cx="50" cy="22" r="3" fill="#e11d48" />
            </g>
          )}

          {style === 'arabia' && (
            // Desert Sheikh Falcon Crown
            <g>
              <ellipse cx="50" cy="32" rx="20" ry="14" fill={`url(#${gradId})`} />
              <path d="M30 38 Q50 24 70 38" stroke={strokeCol} strokeWidth="3" fill="none" />
              <path d="M44 14 L50 20 L56 14 L50 8 Z" fill="#f59e0b" stroke={strokeCol} strokeWidth="1.5" />
            </g>
          )}

          {style === 'nordic' && (
            // Odin Horned & Winged Helm
            <g>
              <path d="M30 42 L34 24 L50 18 L66 24 L70 42 Z" fill={`url(#${gradId})`} />
              <path d="M24 16 Q34 22 36 30" stroke={strokeCol} strokeWidth="3" fill="none" />
              <path d="M76 16 Q66 22 64 30" stroke={strokeCol} strokeWidth="3" fill="none" />
              <circle cx="50" cy="18" r="3" fill="#38bdf8" />
            </g>
          )}

          {style === 'achaemenid' && (
            // Cyrus the Great Stepped Crown (تاج پلکانی هخامنشی)
            <g>
              <path d="M30 40 L35 22 L43 28 L50 14 L57 28 L65 22 L70 40 Z" fill={`url(#${crownGradId})`} />
              <circle cx="50" cy="14" r="5" fill="#facc15" stroke={strokeCol} strokeWidth="1.5" />
              <circle cx="50" cy="14" r="2" fill="#ef4444" />
            </g>
          )}

          {style === 'ottoman' && (
            // Sultan Suleiman the Magnificent (دستار کائوک سلطنتی، پر سرغوج با یاقوت سرخ و طلا)
            <g>
              <ellipse cx="50" cy="28" rx="19" ry="15" fill={`url(#${crownGradId})`} />
              <path d="M31 28 Q50 38 69 28" stroke={strokeCol} strokeWidth="2.5" fill="none" />
              <path d="M34 20 Q50 31 66 20" stroke={strokeCol} strokeWidth="2" fill="none" />
              {/* Imperial Jeweled Plume (سرغوج یاقوت سرخ سلطان) */}
              <path d="M47 13 L50 3 L53 13 Z" fill="#b91c1c" stroke="#facc15" strokeWidth="1.5" />
              <circle cx="50" cy="14" r="3" fill="#facc15" />
              <circle cx="50" cy="14" r="1.5" fill="#059669" />
            </g>
          )}

          {style === 'china' && (
            // Chinese Celestial Emperor (تاج میان با مرواریدهای آویزان امپراتوری)
            <g>
              <rect x="28" y="18" width="44" height="6" rx="2" fill={`url(#${crownGradId})`} stroke={strokeCol} strokeWidth="2" />
              <path d="M38 24 L40 40 L60 40 L62 24 Z" fill={`url(#${gradId})`} />
              <circle cx="33" cy="28" r="2" fill="#facc15" />
              <circle cx="39" cy="30" r="2" fill="#10b981" />
              <circle cx="50" cy="31" r="2.5" fill="#ef4444" />
              <circle cx="61" cy="30" r="2" fill="#10b981" />
              <circle cx="67" cy="28" r="2" fill="#facc15" />
            </g>
          )}

          {style === 'india' && (
            // Emperor Akbar the Great (دستار گورکانی با پر جیغه سلطنتی، مروارید و یاقوت)
            <g>
              <ellipse cx="50" cy="28" rx="18" ry="14" fill={`url(#${crownGradId})`} />
              <path d="M32 29 Q50 38 68 29" stroke={strokeCol} strokeWidth="2.5" fill="none" />
              {/* Royal Mughal Sarpech (جیغه سلطنتی هندی با نگین زمرد و پر سرخ) */}
              <path d="M46 16 Q48 4 56 4 Q53 12 50 16 Z" fill="#ef4444" stroke="#facc15" strokeWidth="1.5" />
              <circle cx="48" cy="16" r="3" fill="#facc15" />
              <circle cx="48" cy="16" r="1.5" fill="#10b981" />
            </g>
          )}

          {style === 'russia' && (
            // Tsar Peter the Great (کلاه مونوماخ و تاج امپراتوری رومانوف با صلیب زرین ارتدکس)
            <g>
              <ellipse cx="50" cy="28" rx="19" ry="14" fill={`url(#${crownGradId})`} />
              <path d="M30 38 Q50 28 70 38" stroke={strokeCol} strokeWidth="2.5" fill="none" />
              {/* Orthodox Imperial Cross */}
              <path d="M50 8 L50 20 M44 13 L56 13 M46 17 L54 18" stroke="#facc15" strokeWidth="2" />
              <circle cx="50" cy="8" r="2" fill="#38bdf8" />
              <circle cx="50" cy="26" r="3" fill="#ef4444" />
            </g>
          )}

          <path d="M45 42 Q50 48 55 42" stroke={strokeCol} strokeWidth="2" />
        </g>
      )}

      {/* QUEEN: Legendary Empress / Queen */}
      {type === 'q' && (
        <g stroke={strokeCol} strokeWidth="2.5">
          <path d="M22 88 h56 v-8 c-5 -3 -12 -5 -28 -5 s-23 2 -28 5 z" fill={`url(#${gradId})`} />
          <path d="M30 75 C26 55 36 42 50 42 C64 42 74 55 70 75 Z" fill={`url(#${gradId})`} />
          {/* Empress / Queen Diadem */}
          {style === 'russia' ? (
            // Empress Catherine the Great (تاج الماس امپراتوری سن پترزبورگ و کوکوشنیک سلطنتی)
            <g>
              <path d="M26 40 C30 10 70 10 74 40 Z" fill={`url(#${crownGradId})`} />
              <path d="M34 26 C44 14 56 14 66 26" stroke="#ffffff" strokeWidth="2" fill="none" />
              <circle cx="50" cy="12" r="3.5" fill="#38bdf8" stroke="#facc15" strokeWidth="1" />
              <circle cx="38" cy="20" r="2.5" fill="#facc15" />
              <circle cx="62" cy="20" r="2.5" fill="#facc15" />
              <circle cx="50" cy="26" r="3" fill="#e11d48" />
            </g>
          ) : style === 'india' ? (
            // Empress Hawa Begum / Jodha (زیور پیشانی منگ‌تیکا و تاج مروارید گورکانی)
            <g>
              <path d="M26 40 C30 14 70 14 74 40 Z" fill={`url(#${crownGradId})`} />
              <path d="M50 14 L50 26" stroke="#facc15" strokeWidth="2" />
              <circle cx="50" cy="27" r="3.5" fill="#ef4444" stroke="#facc15" strokeWidth="1.5" />
              <circle cx="50" cy="14" r="2.5" fill="#10b981" />
              <circle cx="36" cy="30" r="2.5" fill="#facc15" />
              <circle cx="64" cy="30" r="2.5" fill="#facc15" />
            </g>
          ) : style === 'ottoman' ? (
            // Hurrem Sultan Iconic Ottoman Conical Emerald Tiara (تاج مخروطی و زمردین خرم سلطان)
            <g>
              <path d="M28 42 L34 8 L50 4 L66 8 L72 42 Z" fill={`url(#${crownGradId})`} />
              <circle cx="50" cy="12" r="4" fill="#059669" stroke="#facc15" strokeWidth="1.5" />
              <circle cx="40" cy="22" r="3" fill="#e11d48" />
              <circle cx="60" cy="22" r="3" fill="#e11d48" />
              <circle cx="50" cy="30" r="3.5" fill="#059669" />
            </g>
          ) : style === 'china' ? (
            // Empress Dowager Phoenix Crown (تاج ققنوس ملکه چین)
            <g>
              <path d="M26 40 Q50 18 74 40 Z" fill={`url(#${crownGradId})`} />
              <path d="M24 22 Q36 10 50 14 Q64 10 76 22" stroke="#facc15" strokeWidth="3" fill="none" />
              <circle cx="50" cy="10" r="3.5" fill="#10b981" />
              <circle cx="34" cy="16" r="2.5" fill="#ef4444" />
              <circle cx="66" cy="16" r="2.5" fill="#ef4444" />
            </g>
          ) : (
            <g>
              <path d="M26 40 L30 18 L40 26 L50 12 L60 26 L70 18 L74 40 Z" fill={`url(#${crownGradId})`} />
              <circle cx="30" cy="18" r="3" fill={themeConfig.accent} stroke={strokeCol} strokeWidth="1" />
              <circle cx="50" cy="12" r="4" fill={themeConfig.accent} stroke={strokeCol} strokeWidth="1" />
              <circle cx="70" cy="18" r="3" fill={themeConfig.accent} stroke={strokeCol} strokeWidth="1" />
            </g>
          )}
        </g>
      )}

      {/* ROOK: Citadel Fortress / Landmark */}
      {type === 'r' && (
        <g stroke={strokeCol} strokeWidth="2.5">
          <path d="M24 88 h52 v-8 c-4 -3 -10 -5 -26 -5 s-22 2 -26 5 z" fill={`url(#${gradId})`} />
          <path d="M32 75 L35 34 h30 L68 75 Z" fill={`url(#${gradId})`} />
          <path d="M28 34 h44 v-16 h-8 v6 h-8 v-6 h-12 v6 h-8 v-6 h-8 z" fill={`url(#${crownGradId})`} />
          <line x1="33" y1="44" x2="67" y2="44" stroke={strokeCol} strokeWidth="2" />
          <line x1="34" y1="58" x2="66" y2="58" stroke={strokeCol} strokeWidth="2" />
          <rect x="46" y="48" width="8" height="12" rx="3" fill="#140c02" />
        </g>
      )}

      {/* KNIGHT: Imperial Steed / Mythical Companion */}
      {type === 'n' && (
        <g stroke={strokeCol} strokeWidth="2.5">
          <path d="M24 88 h52 v-8 c-4 -3 -10 -5 -26 -5 s-22 2 -26 5 z" fill={`url(#${gradId})`} />
          <path
            d="M32 80 C26 68 28 50 36 38 C40 32 42 22 40 14 C48 16 54 22 56 30 C62 30 72 34 76 45 C78 52 74 62 66 68 C68 74 68 78 68 80 Z"
            fill={`url(#${gradId})`}
          />
          <circle cx="48" cy="32" r="3" fill={strokeCol} />
          <path d="M38 46 Q45 52 54 50" stroke={strokeCol} strokeWidth="2" fill="none" />
          {/* Knight Crest */}
          <path d="M54 22 L62 14 L60 26 Z" fill={themeConfig.accent} stroke={strokeCol} strokeWidth="1" />
        </g>
      )}

      {/* BISHOP: High Priest / Scholar / Seer */}
      {type === 'b' && (
        <g stroke={strokeCol} strokeWidth="2.5">
          <path d="M25 88 h50 v-8 c-4 -3 -10 -5 -25 -5 s-21 2 -25 5 z" fill={`url(#${gradId})`} />
          <path d="M33 75 C30 58 36 44 50 44 C64 44 70 58 67 75 Z" fill={`url(#${gradId})`} />
          <path d="M34 44 C34 26 44 14 50 14 C56 14 66 26 66 44 Z" fill={`url(#${crownGradId})`} />
          <circle cx="50" cy="12" r="3.5" fill={themeConfig.accent} stroke={strokeCol} strokeWidth="1.5" />
          <line x1="42" y1="28" x2="58" y2="28" stroke={strokeCol} strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="38" stroke={strokeCol} strokeWidth="2" />
        </g>
      )}

      {/* PAWN: Brave Imperial Soldier */}
      {type === 'p' && (
        <g stroke={strokeCol} strokeWidth="2.5">
          <path d="M28 88 h44 v-7 c-4 -3 -8 -4 -22 -4 s-18 1 -22 4 z" fill={`url(#${gradId})`} />
          <path d="M36 77 C34 62 38 48 50 48 C62 48 66 62 64 77 Z" fill={`url(#${gradId})`} />
          <circle cx="50" cy="34" r="14" fill={`url(#${crownGradId})`} />
          {style === 'russia' ? (
            // Russian Streltsy & Cossack Astrakhan Fur Hat (کلاه استراخان قزاق و محافظ تزار)
            <g>
              <ellipse cx="50" cy="26" rx="15" ry="11" fill={`url(#${crownGradId})`} />
              <path d="M35 32 Q50 26 65 32" stroke="#ffffff" strokeWidth="2.5" fill="none" />
              <circle cx="50" cy="22" r="2.5" fill="#ef4444" />
            </g>
          ) : style === 'india' ? (
            // Gurkani Rajput Turban (دستار سرباز گورکانی)
            <g>
              <ellipse cx="50" cy="28" rx="14" ry="10" fill={`url(#${crownGradId})`} />
              <circle cx="50" cy="20" r="2.5" fill="#ef4444" />
            </g>
          ) : style === 'ottoman' ? (
            // Janissary Bork Cap (کلاه بورک ینی‌چری با آویز سفید)
            <g>
              <path d="M42 24 C40 10 58 10 60 22 C62 30 64 38 65 44" stroke="#ffffff" strokeWidth="3.5" fill="none" />
              <circle cx="48" cy="22" r="2.5" fill="#facc15" />
            </g>
          ) : style === 'china' ? (
            // Terracotta Warrior Topknot
            <g>
              <circle cx="45" cy="20" r="4" fill={themeConfig.accent} />
              <rect x="43" y="16" width="4" height="8" rx="2" fill="#ca8a04" />
            </g>
          ) : (
            <circle cx="50" cy="20" r="3" fill={themeConfig.accent} />
          )}
          {/* Spear / Sword Line */}
          <line x1="68" y1="22" x2="68" y2="88" stroke={strokeCol} strokeWidth="2.5" />
          <path d="M68 14 L72 24 L64 24 Z" fill={themeConfig.accent} stroke={strokeCol} strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
};
