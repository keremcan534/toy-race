import { ReactNode } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { audioManager } from '../game/AudioManager';
import { useGameStore } from '../store';
import { t } from '../i18n';
import startRaceBg from '../assets/startrace.webp';

interface RaceSetupLayoutProps {
  currentStep: 'MODE' | 'SETTINGS' | 'CAR';
  onBack: () => void;
  summary: {
    mode?: string;
    track?: string;
    ai?: string;
    laps?: string;
    car?: string;
  };
  ctaText: string;
  ctaDisabled?: boolean;
  onCtaClick: () => void;
  children: ReactNode;
}

export const RaceSetupLayout = ({ currentStep, onBack, summary, ctaText, ctaDisabled, onCtaClick, children }: RaceSetupLayoutProps) => {
  const language = useGameStore((state) => state.language);

  const steps = [
    { id: 'MODE', label: t('stepMode', language), number: '01' },
    { id: 'SETTINGS', label: t('stepSettings', language), number: '02' },
    { id: 'CAR', label: t('stepCar', language), number: '03' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full h-full bg-zinc-950 text-white flex overflow-hidden font-sans select-none relative">
      {/* Background Image */}
      <img 
        src={startRaceBg} 
        alt="Race Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 brightness-110 contrast-105"
      />
      
      {/* Ambient Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/35 pointer-events-none z-0" />

      {/* Sidebar */}
      <div className="w-12 sm:w-14 md:w-36 lg:w-44 xl:w-48 p-2 sm:p-3 md:p-4 lg:p-6 flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-md z-20 shrink-0 shadow-2xl">
        <button 
          onClick={() => { audioManager.playUIClick(); onBack(); }}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors mb-4 sm:mb-6 md:mb-8 uppercase font-bold text-[10px] md:text-xs tracking-widest w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
          <span className="hidden md:inline">{t('back', language)}</span>
        </button>

        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 mt-1">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            const isFuture = idx > currentStepIndex;

            return (
              <div key={step.id} className={`flex items-center gap-2 md:gap-3 transition-opacity duration-300 ${isFuture ? 'opacity-30' : 'opacity-100'}`}>
                <div className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md shrink-0 border transition-colors ${
                  isActive ? 'border-red-600 bg-red-600/20 text-red-500' : 
                  isCompleted ? 'border-white/20 bg-white/10 text-zinc-300' : 
                  'border-white/10 bg-black/20 text-zinc-500'
                }`}>
                  <span className="font-mono font-bold text-[10px] sm:text-xs">{step.number}</span>
                  {isActive && <div className="absolute -left-[9px] sm:-left-[13px] md:-left-[17px] lg:-left-[25px] w-[3px] h-full bg-red-600 rounded-r-sm" />}
                </div>
                <span className={`hidden md:inline font-bold italic uppercase tracking-wider text-xs lg:text-sm truncate ${isActive ? 'text-white drop-shadow' : 'text-zinc-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full min-h-0 p-1 sm:p-2 md:p-3 relative z-10 overflow-hidden">
        {children}
      </div>

      {/* Summary Panel */}
      <div className="w-[135px] sm:w-[160px] md:w-[200px] lg:w-[250px] xl:w-[280px] p-2 sm:p-3 md:p-4 lg:p-5 flex flex-col border-l border-white/10 bg-black/40 backdrop-blur-md z-20 shrink-0 shadow-2xl">
        <h3 className="font-black italic text-sm sm:text-base lg:text-lg uppercase tracking-tighter mb-4 sm:mb-6 text-white shrink-0 drop-shadow">
          {t('raceSummary', language)}
        </h3>
        
        <div className="flex-1 flex flex-col gap-2.5 sm:gap-3.5 lg:gap-4 overflow-y-auto">
          <SummaryRow label={t('summaryMode', language)} value={summary.mode} />
          <div className="h-px w-full bg-white/5" />
          <SummaryRow label={t('summaryTrack', language)} value={summary.track} />
          <div className="h-px w-full bg-white/5" />
          {!summary.ai || summary.ai === 'HIDDEN' ? null : (
            <>
              <SummaryRow label={t('summaryOpponents', language)} value={summary.ai} />
              <div className="h-px w-full bg-white/5" />
            </>
          )}
          <SummaryRow label={t('summaryLaps', language)} value={summary.laps} />
          <div className="h-px w-full bg-white/5" />
          <SummaryRow label={t('summaryCar', language)} value={summary.car} />
        </div>

        <div className="mt-4 shrink-0">
          <button
            disabled={ctaDisabled}
            onClick={() => {
              if (!ctaDisabled) {
                audioManager.playUIClick();
                onCtaClick();
              }
            }}
            className={`w-full h-10 sm:h-11 md:h-12 rounded-md flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-150 ${
              ctaDisabled 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5' 
                : 'bg-red-600 hover:bg-red-500 hover:-translate-y-[1px] active:scale-[0.98] text-white shadow-[0_0_20px_rgba(220,38,38,0.25)]'
            }`}
          >
            <span className="font-black italic uppercase tracking-wider text-xs sm:text-sm">{ctaText}</span>
            {!ctaDisabled && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string, value?: string }) => (
  <div className="flex justify-between items-center gap-1">
    <span className="text-zinc-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest shrink-0">{label}</span>
    <span className={`font-bold text-[10px] sm:text-xs uppercase text-right max-w-[90px] sm:max-w-[110px] md:max-w-[140px] truncate ${value ? 'text-white' : 'text-zinc-700'}`}>
      {value || '-'}
    </span>
  </div>
);

