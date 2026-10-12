import { useState } from 'react';
import { useGameStore } from '../store';
import { Lock, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { CarPreview } from './CarPreview';
import { TrackPreview } from './TrackPreview';
import { audioManager } from '../game/AudioManager';
import { RaceSetupLayout } from './RaceSetupLayout';
import { CarName } from './UI/CarName';
import { StatBar } from './UI/StatBar';
import { CarRatingStar } from './UI/CarRatingStar';
import { RaceCarCarousel } from './RaceCarCarousel';
import { t, getTrackName, getTrackDifficulty } from '../i18n';
import { bestGhostTime, ghostKey } from '../game/ghosts';
import { useBackHandler } from '../platform';

export { CarRatingStar };

export const RaceSelection = () => {
  const { 
    tracks, selectedTrackId, selectTrack,
    cars, selectedCarId, selectCar,
    setScreen, raceConfig, setLaps, setAiCount,
    language
  } = useGameStore();

  const [view, setView] = useState<'SETTINGS' | 'TRACK_SELECT' | 'CAR'>(
    raceConfig.isTrafficMode ? 'CAR' : 'SETTINGS'
  );

  const currentTrackIndex = tracks.findIndex(t => t.id === selectedTrackId);
  const selectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];
  const selectedCar = cars.find(c => c.id === selectedCarId) || cars[0];
  const bestTime = bestGhostTime(ghostKey(selectedTrack.id, raceConfig.laps));

  const AI_OPTIONS = [1, 2, 3, 4, 5];
  const LAP_OPTIONS = [1, 2, 3, 5, 10];

  const handlePrevAi = () => {
    audioManager.playUIClick();
    const currentIndex = AI_OPTIONS.indexOf(raceConfig.aiCount);
    const prevIndex = currentIndex <= 0 ? AI_OPTIONS.length - 1 : currentIndex - 1;
    setAiCount(AI_OPTIONS[prevIndex]);
  };

  const handleNextAi = () => {
    audioManager.playUIClick();
    const currentIndex = AI_OPTIONS.indexOf(raceConfig.aiCount);
    const nextIndex = (currentIndex + 1) % AI_OPTIONS.length;
    setAiCount(AI_OPTIONS[nextIndex]);
  };

  const handlePrevLap = () => {
    audioManager.playUIClick();
    const currentIndex = LAP_OPTIONS.indexOf(raceConfig.laps);
    const prevIndex = currentIndex <= 0 ? LAP_OPTIONS.length - 1 : currentIndex - 1;
    setLaps(LAP_OPTIONS[prevIndex]);
  };

  const handleNextLap = () => {
    audioManager.playUIClick();
    const currentIndex = LAP_OPTIONS.indexOf(raceConfig.laps);
    const nextIndex = (currentIndex + 1) % LAP_OPTIONS.length;
    setLaps(LAP_OPTIONS[nextIndex]);
  };

  const handleNextTrack = (e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    selectTrack(tracks[nextIdx].id);
    audioManager.playUIClick();
  };

  const handleBack = () => {
    if (raceConfig.isTrafficMode) {
      setScreen('MODE_SELECTION');
    } else if (view === 'TRACK_SELECT') {
      setView('SETTINGS');
    } else if (view === 'CAR') {
      setView('SETTINGS');
    } else {
      setScreen('MODE_SELECTION');
    }
  };

  // Android back: same as the on-screen back button
  useBackHandler(() => {
    audioManager.playUIClick();
    handleBack();
  });

  const handleCtaClick = () => {
    if (view === 'SETTINGS' && !raceConfig.isRandomMode) {
      setView('CAR');
    } else {
      // Start Game
      audioManager.resume();
      setScreen('GAME');
    }
  };

  const ctaText = view === 'SETTINGS' && !raceConfig.isRandomMode ? t('next', language) : t('startRace', language);
  const ctaDisabled = view === 'CAR' && !selectedCar.owned;

  const currentStep = view === 'CAR' ? 'CAR' : 'SETTINGS';

  return (
    <RaceSetupLayout
      currentStep={currentStep}
      onBack={handleBack}
      summary={{
        mode: raceConfig.isTrafficMode 
          ? (language === 'tr' ? 'TRAFİK MODU' : 'TRAFFIC MODE')
          : raceConfig.isDriftMode
            ? (language === 'tr' ? 'DRİFT MODU' : 'DRIFT MODE')
            : raceConfig.isRandomMode 
              ? t('randomCar', language) 
              : raceConfig.isGhostMode 
                ? t('ghostMode', language) 
                : t('normalRace', language),
        track: raceConfig.isDriftMode ? (language === 'tr' ? 'DRİFT ARENASI' : 'DRIFT ARENA') : getTrackName(selectedTrack.id, language),
        ai: raceConfig.isGhostMode ? 'HIDDEN' : raceConfig.aiCount.toString(),
        laps: raceConfig.isDriftMode ? '∞' : raceConfig.laps.toString(),
        car: raceConfig.isRandomMode ? t('randomCar', language) : selectedCar.name
      }}
      ctaText={ctaText}
      ctaDisabled={ctaDisabled}
      onCtaClick={handleCtaClick}
    >
      {view === 'SETTINGS' && (
        <div className="flex flex-col h-full min-h-0 justify-start">
          <div className="mb-1.5 sm:mb-3 shrink-0">
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black italic uppercase tracking-tighter text-white mb-0.5 leading-tight">
              {t('raceSettingsTitle', language)}
            </h1>
            <p className="text-zinc-400 text-[11px] sm:text-xs font-medium">{t('raceSettingsSubtitle', language)}</p>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3.5 md:gap-4 max-w-3xl w-full">
            {raceConfig.isDriftMode ? (
              /* DRIFT ARENA: Locked circular asphalt plaza card */
              <div className="flex flex-col gap-1">
                <span className="text-zinc-400 font-bold uppercase text-[10px] sm:text-xs tracking-widest">{t('track', language)}</span>
                <div className="flex items-center justify-between p-2.5 sm:p-3.5 bg-red-950/20 border-2 border-red-600/80 rounded-xl shadow-lg gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                     <div className="w-14 h-11 sm:w-20 sm:h-14 bg-black/60 rounded-lg relative overflow-hidden flex items-center justify-center border border-red-500/30 shrink-0">
                        <Lock className="w-5 h-5 text-red-500 animate-pulse" />
                     </div>
                     <div className="text-left min-w-0 flex-1">
                       <h3 className="font-black italic uppercase text-xs sm:text-sm md:text-base text-red-400 tracking-wide truncate">
                         {language === 'tr' ? 'DRİFT PLAZASI' : 'DRIFT ARENA'}
                       </h3>
                       <span className="text-[10px] sm:text-xs text-zinc-400 block truncate mt-0.5">
                         {language === 'tr' ? 'Gece vakti, ortası dolu tamamen açık asfalt drift meydanı!' : 'Always night, completely solid filled circular asphalt plaza!'}
                       </span>
                     </div>
                  </div>
                </div>
              </div>
            ) : (
              /* NORMAL TRACK SELECT */
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-bold uppercase text-[10px] sm:text-xs tracking-widest">{t('track', language)}</span>
                  <span className="text-zinc-300 font-black text-[10px] sm:text-xs tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/10">
                    {currentTrackIndex >= 0 ? currentTrackIndex + 1 : 1} / {tracks.length}
                  </span>
                </div>

                <div 
                  onClick={handleNextTrack}
                  className="flex items-center justify-between p-2.5 sm:p-3.5 bg-black/50 backdrop-blur-md border border-white/15 rounded-xl shadow-lg hover:border-red-500/60 hover:bg-black/70 transition-all cursor-pointer group gap-2.5 sm:gap-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                     <div className="w-14 h-11 sm:w-20 sm:h-14 md:w-24 md:h-16 bg-black/60 rounded-lg relative overflow-hidden flex items-center justify-center border border-white/15 shrink-0 group-hover:border-red-500/50 transition-colors shadow-inner">
                        <TrackPreview trackId={selectedTrack.id} color={selectedTrack.color} className="w-full h-full opacity-90 group-hover:scale-110 transition-transform duration-300" />
                     </div>

                     <div className="text-left min-w-0 flex-1">
                       <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                         <h3 className="font-black italic uppercase text-xs sm:text-sm md:text-base text-white tracking-wide truncate group-hover:text-red-400 transition-colors">{getTrackName(selectedTrack.id, language)}</h3>
                         {selectedTrack.difficulty && (
                           <span className="text-[8px] sm:text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-950/70 text-red-300 border border-red-800/60">
                             {selectedTrack.isDirt ? 'MEDIUM' : getTrackDifficulty(selectedTrack.difficulty, language)}
                           </span>
                         )}
                         {selectedTrack.isDirt && (
                           <span className="text-[8px] sm:text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/60">
                             DIRT RALLY
                           </span>
                         )}
                       </div>
                       {raceConfig.isGhostMode && bestTime !== undefined ? (
                         <span className="text-[10px] sm:text-xs font-bold text-yellow-500 mt-0.5 block truncate">
                           {t('bestTime', language)}: {(bestTime / 1000).toFixed(2)}s
                         </span>
                       ) : selectedTrack.isDirt ? null : (
                         <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate mt-0.5">
                           {language === 'tr' ? 'Sonraki pist için tıkla' : 'Click for next track'}
                         </span>
                       )}
                     </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={handleNextTrack}
                      title={language === 'tr' ? 'Sonraki Pist' : 'Next Track'}
                      className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-900/50 border border-red-400/40 transition-all shrink-0"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* RAKİP & TUR ARROW SELECTORS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4">
              {!raceConfig.isGhostMode && (
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-400 font-bold uppercase text-[10px] sm:text-xs tracking-widest">{t('opponentCount', language)}</span>
                  <div className="flex items-center justify-between bg-zinc-900/90 border border-white/15 rounded-xl p-1.5 sm:p-2 shadow-lg backdrop-blur-md">
                    <button
                      type="button"
                      onClick={handlePrevAi}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
                      title={language === 'tr' ? 'Önceki Rakip Sayısı' : 'Previous Opponent Count'}
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div className="flex flex-col items-center px-2 py-0.5">
                      <span className="font-black italic text-lg sm:text-xl md:text-2xl text-white font-mono leading-none">
                        {raceConfig.aiCount}
                      </span>
                      <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-bold mt-0.5">
                        {language === 'tr' ? 'Rakip' : 'Rivals'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextAi}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center border border-red-400/40 shadow-md shadow-red-900/50 transition-all cursor-pointer"
                      title={language === 'tr' ? 'Sonraki Rakip Sayısı' : 'Next Opponent Count'}
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              )}
              
              {raceConfig.isDriftMode ? (
                /* Infinite Laps for Drift Mode */
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-400 font-bold uppercase text-[10px] sm:text-xs tracking-widest">{t('lapCount', language)}</span>
                  <div className="flex items-center justify-between bg-zinc-950/60 border border-white/10 rounded-xl p-1.5 sm:p-2 shadow-lg backdrop-blur-md opacity-80">
                    <div className="flex-1 text-center py-1 sm:py-2 flex flex-col items-center justify-center">
                      <span className="font-mono font-black text-xl sm:text-2xl text-yellow-500 leading-none">
                        ∞
                      </span>
                      <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-bold mt-0.5">
                        {language === 'tr' ? 'SONSUZ TUR' : 'INFINITE LAPS'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Regular Lap Selector */
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-400 font-bold uppercase text-[10px] sm:text-xs tracking-widest">{t('lapCount', language)}</span>
                  <div className="flex items-center justify-between bg-zinc-900/90 border border-white/15 rounded-xl p-1.5 sm:p-2 shadow-lg backdrop-blur-md">
                    <button
                      type="button"
                      onClick={handlePrevLap}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
                      title={language === 'tr' ? 'Önceki Tur Sayısı' : 'Previous Lap Count'}
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div className="flex flex-col items-center px-2 py-0.5">
                      <span className="font-black italic text-lg sm:text-xl md:text-2xl text-white font-mono leading-none">
                        {raceConfig.laps}
                      </span>
                      <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-bold mt-0.5">
                        {language === 'tr' ? 'Tur' : 'Laps'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextLap}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center border border-red-400/40 shadow-md shadow-red-900/50 transition-all cursor-pointer"
                      title={language === 'tr' ? 'Sonraki Tur Sayısı' : 'Next Lap Count'}
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'TRACK_SELECT' && (
        <div className="flex flex-col h-full min-h-0 justify-start">
          <div className="mb-2 sm:mb-4 shrink-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black italic uppercase tracking-tighter text-white mb-0.5 leading-tight">
              {t('trackSelectTitle', language)}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">{t('trackSelectSubtitle', language)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4 overflow-y-auto pr-2 pb-4 content-start">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => { audioManager.playUIClick(); selectTrack(track.id); setView('SETTINGS'); }}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-150 group border backdrop-blur-md ${
                  selectedTrackId === track.id
                    ? 'border-red-600 bg-red-950/40 shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                    : 'border-white/10 bg-black/40 hover:border-white/25 hover:bg-black/60'
                }`}
              >
                <TrackPreview 
                  trackId={track.id} 
                  color={track.color}
                  className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${selectedTrackId === track.id ? 'opacity-80' : 'opacity-40 group-hover:opacity-60'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {track.isDirt && (
                  <span className="absolute top-2 right-2 z-20 text-[7px] sm:text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/60 shadow">
                    {language === 'tr' ? 'TOPRAK' : 'DIRT'}
                  </span>
                )}
                <h3 className={`relative z-10 font-black text-xs sm:text-sm italic uppercase tracking-wider mt-auto mb-2.5 px-1 truncate w-full ${selectedTrackId === track.id ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                  {getTrackName(track.id, language)}
                </h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'CAR' && (
        <div className="flex-1 flex flex-col h-full min-h-0 justify-between overflow-hidden">
          <div className="mb-0.5 shrink-0 flex items-center justify-between">
            <h1 className="text-xs sm:text-sm md:text-base font-black italic uppercase tracking-tight text-white leading-tight">
              {t('carSelectTitle', language)}
            </h1>
          </div>

          <div className="flex-1 flex flex-row gap-1 sm:gap-2 md:gap-3 min-h-0 overflow-hidden">
            {/* Middle Car Selection: Large Car Showcase & Horizontal Carousel */}
            <RaceCarCarousel 
              cars={cars} 
              selectedCarId={selectedCarId} 
              onSelectCar={selectCar} 
              language={language} 
            />

            {/* Selected Car Panel (Compact for mobile landscape, car already shown in center) */}
            <div className="w-28 sm:w-36 md:w-44 lg:w-48 shrink-0 bg-black/50 backdrop-blur-md border border-white/15 rounded-xl flex flex-col overflow-hidden shadow-2xl p-1.5 sm:p-2 justify-between mb-1 sm:mb-1.5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black italic text-[11px] sm:text-xs md:text-sm uppercase tracking-tight text-white truncate leading-tight">
                      <CarName name={selectedCar.name} />
                    </h3>
                    <span className="text-[7.5px] sm:text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest block truncate">
                      {selectedCar.type}
                    </span>
                  </div>
                  {/* Rating Star next to car name */}
                  <div className="shrink-0 scale-70 sm:scale-80 origin-right">
                    <CarRatingStar car={selectedCar} size="sm" />
                  </div>
                </div>

                {!selectedCar.owned && (
                  <div className="bg-red-950/80 border border-red-500/40 text-red-300 text-[7.5px] sm:text-[8px] font-black italic px-1 py-0.5 rounded-sm flex items-center justify-center gap-1 uppercase tracking-widest">
                    <Lock className="w-2 h-2 text-red-400" />
                    <span>{t('locked', language)}</span>
                  </div>
                )}
              </div>

              {/* Car Stats: Speed (Red), Accel (Blue), Handling (Gray) */}
              <div key={selectedCar.id} className="space-y-0.5 sm:space-y-1 my-auto">
                <StatBar label={t('statSpeed', language)} value={selectedCar.maxSpeed} statType="speed" carId={selectedCar.id} enableUpgradeEffect={false} barHeight="h-1" />
                <StatBar label={t('statAccel', language)} value={selectedCar.acceleration} statType="accel" carId={selectedCar.id} enableUpgradeEffect={false} barHeight="h-1" />
                <StatBar label={t('statHandling', language)} value={selectedCar.handling} statType="handling" carId={selectedCar.id} enableUpgradeEffect={false} barHeight="h-1" />
              </div>
              
              {!selectedCar.owned && (
                <div className="mt-auto p-1 bg-red-950/40 border border-red-800/50 rounded text-center backdrop-blur-sm">
                  <span className="text-[7.5px] sm:text-[8.5px] text-red-300 font-medium leading-tight block truncate">{t('obtainFromShop', language)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </RaceSetupLayout>
  );
};

// OptionChip helper

const OptionChip = ({ value, selected, disabled, onClick }: any) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`w-10 h-9 sm:w-11 sm:h-10 lg:w-12 lg:h-11 rounded-md text-xs sm:text-sm font-bold transition-all flex items-center justify-center backdrop-blur-md ${
      disabled 
        ? 'bg-zinc-900/40 text-zinc-700 cursor-not-allowed border border-white/5'
        : selected
          ? 'bg-red-600 text-white border border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.3)]'
          : 'bg-black/40 text-zinc-300 border border-white/10 hover:border-white/25 hover:bg-black/60'
    }`}
  >
    {value}
  </button>
);
