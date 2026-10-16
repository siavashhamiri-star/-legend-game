import React, { useEffect, useState } from 'react';
import { TranslationDictionary, Language, LeagueTier } from '../types/chess.ts';
import { Trophy, Medal, Star, Flame, X, UserCheck } from 'lucide-react';

interface LeaderboardEntry {
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

interface LeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerRating: number;
  playerXP: number;
  playerName: string;
  t: TranslationDictionary;
  lang: Language;
}

export const LeagueModal: React.FC<LeagueModalProps> = ({
  isOpen,
  onClose,
  playerRating,
  playerXP,
  playerName,
  t,
  lang,
}) => {
  const [leagues, setLeagues] = useState<LeagueTier[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    Promise.all([
      fetch('/api/leagues').then(r => r.json()).catch(() => ({ leagues: [] })),
      fetch('/api/leaderboard').then(r => r.json()).catch(() => ({ leaderboard: [] }))
    ]).then(([leaguesData, leaderData]) => {
      if (leaguesData.leagues) setLeagues(leaguesData.leagues);
      if (leaderData.leaderboard) setLeaderboard(leaderData.leaderboard);
      setLoading(false);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  // Identify player's current league tier
  const currentTier = leagues.find(l => playerRating >= l.minRating && playerRating <= l.maxRating) || leagues[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#1e1914] border-2 border-[#f0c04a] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#5a4630] bg-[#241e19]">
          <div className="flex items-center gap-2">
            <Trophy className="text-[#f0c04a]" size={24} />
            <div>
              <h2 className="text-lg font-black text-[#f0c04a]">
                {t.league}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'fa' ? 'ساختار رتبه‌بندی و پنج لیگ حماسی همجهان' : 'Worldplay ELO Rating & The Five Epic Leagues'}
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

        {/* Player Current Standing Ribbon */}
        <div className="p-4 bg-gradient-to-r from-[#2f251c] to-[#1c1713] border-b border-[#5a4630] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner">
              {currentTier ? currentTier.badge : '👑'}
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-400">
                {t.myRank}
              </div>
              <div className="text-base font-extrabold text-[#f0c04a] flex items-center gap-1.5">
                <span>{playerName}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                  {currentTier ? (lang === 'fa' ? currentTier.nameFa : currentTier.nameEn) : 'Cyrus'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="block text-stone-400 text-[10px] uppercase">{lang === 'fa' ? 'ریتینگ (ELO)' : 'ELO Rating'}</span>
              <span className="text-lg font-black text-amber-400 tabular-nums">{playerRating}</span>
            </div>
            <div className="text-right">
              <span className="block text-stone-400 text-[10px] uppercase">{lang === 'fa' ? 'امتیاز شایستگی' : 'XP Points'}</span>
              <span className="text-lg font-black text-emerald-400 tabular-nums">{playerXP}</span>
            </div>
          </div>
        </div>

        {/* Content: League Tiers & Leaderboard */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs text-stone-200">
          {/* League Tiers Visualization */}
          <div>
            <h3 className="font-bold text-amber-300 text-xs uppercase mb-2 flex items-center gap-1.5">
              <Medal size={14} />
              <span>{lang === 'fa' ? 'مراتب لیگ‌های پنج‌گانه' : 'The 5 Imperial Leagues'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {leagues.map((lg) => {
                const isActive = currentTier && currentTier.id === lg.id;
                return (
                  <div
                    key={lg.id}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                        : 'bg-[#241e19] border-stone-800 opacity-80'
                    }`}
                  >
                    <div className="text-2xl mb-1">{lg.badge}</div>
                    <div className="font-bold text-[11px] text-stone-100 truncate">
                      {lang === 'fa' ? lg.nameFa : lg.nameEn}
                    </div>
                    <div className="font-mono text-[10px] text-stone-400 mt-0.5">
                      {lg.minRating}+
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Leaderboard */}
          <div>
            <h3 className="font-bold text-amber-300 text-xs uppercase mb-2 flex items-center gap-1.5">
              <Flame size={14} />
              <span>{lang === 'fa' ? 'دیوان برترین فرماندهان همجهان' : 'Top Strategists Leaderboard'}</span>
            </h3>

            <div className="bg-[#181310] border border-[#5a4630]/40 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-2 p-2.5 text-[10px] font-bold text-stone-400 uppercase border-b border-stone-800 bg-[#221c17]">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">{lang === 'fa' ? 'فرمانده' : 'Commander'}</div>
                <div className="col-span-2 text-center">{lang === 'fa' ? 'لیگ' : 'League'}</div>
                <div className="col-span-2 text-right">ELO</div>
                <div className="col-span-2 text-right">XP</div>
              </div>

              {loading ? (
                <div className="py-6 text-center text-stone-500 italic">
                  {lang === 'fa' ? 'در حال بازیابی اطلاعات دیوان...' : 'Loading ranks...'}
                </div>
              ) : (
                <div className="divide-y divide-stone-800/60 font-mono text-xs">
                  {leaderboard.map((user, idx) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 gap-2 p-2.5 items-center hover:bg-[#251e18] transition-colors"
                    >
                      <div className="col-span-1 text-center font-bold text-stone-400">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </div>
                      <div className="col-span-5 flex items-center gap-1.5 truncate">
                        <span className="text-sm">{user.avatar}</span>
                        <span className="font-sans font-bold text-stone-200 truncate">{user.name}</span>
                        <span className="text-[10px] opacity-60">[{user.country}]</span>
                      </div>
                      <div className="col-span-2 text-center text-[10px] text-amber-300 truncate">
                        {user.league}
                      </div>
                      <div className="col-span-2 text-right font-bold text-[#f0c04a] tabular-nums">
                        {user.rating}
                      </div>
                      <div className="col-span-2 text-right text-emerald-400 tabular-nums">
                        {user.xp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
