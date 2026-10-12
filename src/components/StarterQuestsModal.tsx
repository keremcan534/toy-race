import React, { useState, useEffect } from 'react';
import { useGameStore, STARTER_QUESTS, getStarterQuestProgress } from '../store';
import { useBackHandler } from '../platform';
import { audioManager } from '../game/AudioManager';
import { ScrapIcon } from './UI/ScrapIcon';
import { ChevronLeft, ChevronRight, X, Award, CheckCircle2, Lock } from 'lucide-react';
import tokenIcon from '../assets/upgradetoken.webp';

interface StarterQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StarterQuestsModal: React.FC<StarterQuestsModalProps> = ({ isOpen, onClose }) => {
  const { starterProgress, claimStarterQuest, cars, language } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Android back / Escape closes the dialog
  useBackHandler(onClose, isOpen);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const currentQuest = STARTER_QUESTS[currentIndex];

  // Calculate current progress for the active quest
  const getQuestProgress = (questId: string, target: number) => {
    const current = getStarterQuestProgress({ cars, starterProgress }, questId);
    const isCompleted = current >= target;
    const isClaimed = !!starterProgress?.claimed?.[questId];
    return { current: Math.min(current, target), isCompleted, isClaimed };
  };

  const { current, isCompleted, isClaimed } = getQuestProgress(currentQuest.id, currentQuest.target);
  const canClaim = isCompleted && !isClaimed;

  const handlePrev = () => {
    audioManager.playUIClick();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : STARTER_QUESTS.length - 1));
  };

  const handleNext = () => {
    audioManager.playUIClick();
    setCurrentIndex((prev) => (prev < STARTER_QUESTS.length - 1 ? prev + 1 : 0));
  };

  const handleClaimReward = (questId: string) => {
    const success = claimStarterQuest(questId);
    if (success) {
      if (currentQuest.rewardType === 'token') {
        audioManager.playInstantUpgrade();
      } else {
        audioManager.playPurchase();
      }
    } else {
      audioManager.playWarning();
    }
  };

  const progressPercent = Math.min(100, Math.round((current / currentQuest.target) * 100));

  // Count total unclaimed ready-to-claim quests
  const unclaimedCount = STARTER_QUESTS.filter((q) => {
    const { isCompleted: qDone, isClaimed: qClaimed } = getQuestProgress(q.id, q.target);
    return qDone && !qClaimed;
  }).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-3 select-none">
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-amber-500/50 rounded-2xl max-w-lg w-full p-2.5 sm:p-3.5 shadow-2xl relative max-h-[92vh] sm:max-h-[88vh] flex flex-col justify-between overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* 1. Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
            <div className="flex items-center gap-2 truncate">
              <h2 className="text-xs sm:text-sm font-black italic uppercase tracking-wider text-white truncate">
                {language === 'tr' ? 'BAŞLANGIÇ GÖREVLERİ' : 'STARTER MISSIONS'}
              </h2>
              {unclaimedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono font-bold text-[8.5px] shrink-0">
                  {unclaimedCount} {language === 'tr' ? 'Hazır' : 'Ready'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-600/40">
              {currentIndex + 1} / {STARTER_QUESTS.length}
            </span>
            <button
              onClick={() => { audioManager.playUIClick(); onClose(); }}
              className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title={language === 'tr' ? 'Kapat' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Middle Row: Arrows & Active Quest Card */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 py-2 flex-1 min-h-0">
          
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="w-8 sm:w-9 h-20 sm:h-28 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/15 hover:border-amber-400/60 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 shrink-0 group"
            title={language === 'tr' ? 'Önceki Görev' : 'Previous Mission'}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Active Card Container */}
          <div className="flex-1 min-w-0 bg-zinc-900/80 border border-white/15 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between shadow-xl relative overflow-hidden backdrop-blur-md h-full">
            
            {/* Top row: Mission ID & Status */}
            <div className="flex items-center justify-between gap-2 mb-1 shrink-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400">
                {language === 'tr' ? `GÖREV #${currentIndex + 1}` : `MISSION #${currentIndex + 1}`}
              </span>

              {isClaimed ? (
                <span className="inline-flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {language === 'tr' ? 'ALINDI' : 'CLAIMED'}
                </span>
              ) : isCompleted ? (
                <span className="inline-flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/60">
                  {language === 'tr' ? 'ÖDÜL HAZIR' : 'READY'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-400 border border-white/10">
                  {language === 'tr' ? 'DEVAM EDİYOR' : 'IN PROGRESS'}
                </span>
              )}
            </div>

            {/* Mission Objective */}
            <div className="mb-1.5 shrink-0">
              <h3 className="text-xs sm:text-sm font-black text-white italic tracking-tight leading-tight">
                {language === 'tr' ? currentQuest.titleTr : currentQuest.titleEn}
              </h3>
            </div>

            {/* Progress Bar Row */}
            <div className="bg-black/50 border border-white/10 rounded-lg p-1.5 sm:p-2 mb-1.5 shrink-0">
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold mb-1">
                <span className="text-zinc-400 uppercase tracking-wider">
                  {language === 'tr' ? 'İlerleme' : 'Progress'}
                </span>
                <span className={isCompleted ? 'text-emerald-400' : 'text-amber-300'}>
                  {current.toLocaleString('tr-TR')} / {currentQuest.target.toLocaleString('tr-TR')}
                  <span className="text-zinc-500 ml-1">({progressPercent}%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isClaimed
                      ? 'bg-zinc-600'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-amber-600 to-yellow-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Reward Display Box */}
            <div className="flex items-center justify-between bg-amber-950/20 border border-amber-500/30 rounded-lg p-1.5 sm:p-2 mb-1.5 shrink-0">
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-amber-400/80">
                  {language === 'tr' ? 'GÖREV ÖDÜLÜ' : 'REWARD'}
                </span>
                <span className="font-mono font-black text-xs sm:text-sm text-white tracking-wide leading-tight">
                  {language === 'tr' ? currentQuest.rewardLabelTr : currentQuest.rewardLabelEn}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {currentQuest.rewardType === 'token' ? (
                  <img
                    src={tokenIcon}
                    alt="Upgrade Token"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  />
                ) : (
                  <ScrapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
            </div>

            {/* Action / Claim Button */}
            <div className="shrink-0">
              {canClaim ? (
                <button
                  type="button"
                  onClick={() => handleClaimReward(currentQuest.id)}
                  className="w-full py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black italic text-xs uppercase tracking-wider rounded-lg shadow-md border border-green-300/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'tr' ? 'ÖDÜLÜ AL' : 'CLAIM REWARD'}</span>
                </button>
              ) : isClaimed ? (
                <button
                  disabled
                  className="w-full py-1.5 sm:py-2 bg-zinc-800 text-zinc-400 font-black italic text-xs uppercase tracking-wider rounded-lg border border-zinc-700/60 cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'tr' ? 'ALINDI' : 'CLAIMED'}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-1.5 sm:py-2 bg-zinc-900 text-zinc-500 font-black italic text-xs uppercase tracking-wider rounded-lg border border-white/10 cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-zinc-500" />
                  <span>{language === 'tr' ? 'DEVAM EDİYOR' : 'IN PROGRESS'}</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="w-8 sm:w-9 h-20 sm:h-28 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/15 hover:border-amber-400/60 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 shrink-0 group"
            title={language === 'tr' ? 'Sonraki Görev' : 'Next Mission'}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3. Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1.5 border-t border-white/10 shrink-0">
          {STARTER_QUESTS.map((quest, idx) => {
            const { isCompleted: qDone, isClaimed: qClaimed } = getQuestProgress(quest.id, quest.target);
            const isSelected = idx === currentIndex;
            const qCanClaim = qDone && !qClaimed;

            return (
              <button
                key={quest.id}
                onClick={() => { audioManager.playUIClick(); setCurrentIndex(idx); }}
                className={`flex items-center justify-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-105'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/10'
                }`}
              >
                <span>#{idx + 1}</span>
                {qCanClaim ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                ) : qClaimed ? (
                  <span className="text-emerald-400 text-[8px] leading-none">✓</span>
                ) : null}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
