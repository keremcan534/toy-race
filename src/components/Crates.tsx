import { useState } from 'react';
import { useGameStore } from '../store';
import { Button } from './UI/Button';
import { ArrowLeft, Box, Lock, Crown } from 'lucide-react';
import { audioManager } from '../game/AudioManager';
import { ScrapIcon } from './UI/ScrapIcon';
import { t } from '../i18n';
import garageBackground from '../assets/garagebackgr.webp';

type CrateType = 'XP' | 'SCRAP' | 'LOCKED' | 'ADMIN';

interface Crate {
  id: number;
  type: CrateType;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  locked: boolean;
}

const CRATES: Crate[] = [
  { id: 1, type: 'ADMIN', name: 'Admin Kasası', nameEn: 'Admin Crate', description: '8.000.000 Parça', descriptionEn: '8,000,000 Scrap', locked: false },
  { id: 2, type: 'SCRAP', name: 'Parça Kasası', nameEn: 'Scrap Crate', description: '2.000 - 1.2M Parça', descriptionEn: '2,000 - 1.2M Scrap', locked: false },
  { id: 3, type: 'LOCKED', name: 'Kilitli Kasa', nameEn: 'Locked Crate', description: '???', descriptionEn: '???', locked: true },
  { id: 4, type: 'LOCKED', name: 'Kilitli Kasa', nameEn: 'Locked Crate', description: '???', descriptionEn: '???', locked: true },
];

export const Crates = () => {
  const { setScreen, addXp, addGp, language } = useGameStore();
  const [openingCrateId, setOpeningCrateId] = useState<number | null>(null);
  const [reward, setReward] = useState<{ type: 'XP' | 'SCRAP', amount: number } | null>(null);

  const handleOpenCrate = (crate: Crate) => {
    if (crate.locked) {
      audioManager.playWarning();
      return;
    }
    if (openingCrateId !== null) return;

    audioManager.playCrateOpen();
    setOpeningCrateId(crate.id);

    setTimeout(() => {
      let amount = 0;
      const type = crate.type as 'XP' | 'SCRAP' | 'ADMIN';

      if (type === 'ADMIN') {
        amount = 8000000;
        addGp(amount);
        setReward({ type: 'SCRAP', amount });
      } else if (type === 'XP') {
        const rand = Math.random();
        if (rand < 0.60) amount = Math.floor(Math.random() * (500 - 100) + 100);
        else if (rand < 0.85) amount = Math.floor(Math.random() * (1500 - 500) + 500);
        else if (rand < 0.95) amount = Math.floor(Math.random() * (3000 - 1500) + 1500);
        else if (rand < 0.99) amount = Math.floor(Math.random() * (4500 - 3000) + 3000);
        else amount = Math.floor(Math.random() * (5500 - 4500) + 4500);
        
        addXp(amount);
        setReward({ type: 'XP', amount });
      } else {
        const rand = Math.random();
        if (rand < 0.60) amount = Math.floor(Math.random() * (10000 - 2000) + 2000);
        else if (rand < 0.85) amount = Math.floor(Math.random() * (50000 - 10000) + 10000);
        else if (rand < 0.95) amount = Math.floor(Math.random() * (200000 - 50000) + 50000);
        else if (rand < 0.99) amount = Math.floor(Math.random() * (500000 - 200000) + 200000);
        else amount = Math.floor(Math.random() * (1200000 - 500000) + 500000);

        addGp(amount);
        setReward({ type: 'SCRAP', amount });
      }

      setOpeningCrateId(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-white p-4 relative font-sans select-none overflow-hidden">
      {/* Background Image */}
      <img 
        src={garageBackground} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 brightness-110 contrast-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/40 pointer-events-none z-0" />

      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <Button variant="outline" size="sm" onClick={() => { audioManager.playUIClick(); setScreen('MAIN_MENU'); }} className="bg-zinc-900/80 backdrop-blur border-zinc-700 hover:border-red-500 hover:text-red-500 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('back', language)}
        </Button>
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
          {t('crates', language)}
        </h1>
        <div className="h-1 w-24 bg-red-600 mx-auto mt-2 skew-x-[-12deg]" />
      </div>

      <div className="flex-1 flex items-center justify-center gap-4 md:gap-6 px-4 w-full max-w-7xl mx-auto pt-20 overflow-x-auto relative z-10">
        {CRATES.map((crate) => (
          <div key={crate.id} className="flex flex-col items-center gap-2 md:gap-4 flex-1 min-w-[100px] max-w-[140px] md:min-w-[140px] md:max-w-[180px] group">
            <div className={`relative w-full aspect-square bg-zinc-900 border-2 ${
              crate.locked 
                ? 'border-zinc-800' 
                : crate.type === 'ADMIN' 
                  ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]' 
                  : 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
            } rounded-sm flex items-center justify-center overflow-hidden transition-all duration-300 skew-x-[-3deg] group-hover:skew-x-0 group-hover:scale-105`}>
              
              {/* Inner texture */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 to-zinc-950 opacity-50" />
              
              {/* Crate Icon / Animation */}
              {openingCrateId === crate.id ? (
                <div className="w-1/2 h-1/2 flex items-center justify-center animate-pulse relative z-10">
                  <Box className="w-full h-full text-yellow-500 animate-bounce drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                </div>
              ) : (
                <div 
                  className={`w-1/2 h-1/2 flex items-center justify-center transition-transform relative z-10 ${!crate.locked ? 'group-hover:scale-110 duration-300' : ''}`}
                >
                  {crate.locked ? (
                    <Lock className="w-full h-full text-zinc-700" />
                  ) : crate.type === 'ADMIN' ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Crown className="w-full h-full text-red-600 opacity-20" />
                      <span className="absolute inset-0 flex items-center justify-center font-black italic text-xl md:text-3xl text-red-600 drop-shadow-lg skew-x-[3deg]">
                        ADM
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Box className="w-full h-full text-yellow-500 opacity-20" />
                      <span className={`absolute inset-0 flex items-center justify-center font-black italic text-xl md:text-3xl skew-x-[3deg] ${crate.type === 'XP' ? 'text-blue-500' : 'text-green-500'}`}>
                        {crate.type}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Locked Overlay */}
              {crate.locked && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-zinc-500 font-black uppercase tracking-widest rotate-45 border-2 border-zinc-500 px-2 py-1 rounded-sm text-[10px]">
                    {t('locked', language).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center w-full space-y-2">
              <h3 className="font-black italic text-sm sm:text-base truncate w-full uppercase tracking-wider text-white group-hover:text-red-500 transition-colors">
                {language === 'en' ? crate.nameEn : crate.name}
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide truncate w-full bg-zinc-900/50 py-1 px-2 rounded-sm border border-zinc-800">
                {language === 'en' ? crate.descriptionEn : crate.description}
              </p>
              
              <Button 
                size="sm" 
                className={`w-full text-xs py-4 h-auto font-black italic skew-x-[-6deg] shadow-lg transition-all ${
                  crate.locked 
                    ? 'bg-zinc-800 text-zinc-600 border border-zinc-700' 
                    : crate.type === 'ADMIN' 
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20 hover:shadow-red-600/40' 
                      : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20 hover:shadow-green-600/40'
                }`}
                disabled={crate.locked || openingCrateId !== null}
                onClick={() => handleOpenCrate(crate)}
              >
                <span className="block skew-x-[6deg] tracking-wider">
                  {openingCrateId === crate.id ? (language === 'en' ? 'OPENING...' : 'AÇILIYOR...') : (crate.locked ? t('locked', language).toUpperCase() : t('openCrate', language))}
                </span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Reward Modal */}
      {reward && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={() => { audioManager.playUIClick(); setReward(null); }}>
          <div 
            className="bg-zinc-900 border-2 border-yellow-500 p-8 rounded-sm text-center max-w-xs w-full shadow-[0_0_50px_rgba(234,179,8,0.3)] animate-in fade-in zoom-in duration-300 skew-x-[-3deg] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(234,179,8,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat animate-[shimmer_2s_infinite]" />
            
            <div className="skew-x-[3deg] relative z-10">
              <h2 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter">
                {t('congratulations', language)}
              </h2>
              <div className="h-1 w-16 bg-yellow-500 mx-auto mb-6" />
              
              <div className="my-8 space-y-2">
                <span className={`block text-5xl font-black italic drop-shadow-lg ${reward.type === 'XP' ? 'text-blue-500' : 'text-green-500'}`}>
                  +{reward.amount.toLocaleString()}
                </span>
                <span className="flex items-center justify-center gap-1.5 text-xl font-bold text-zinc-400 uppercase tracking-widest">
                  {reward.type === 'XP' ? (
                    'XP'
                  ) : (
                    <>
                      <span>{t('scrap', language).toUpperCase()}</span>
                      <ScrapIcon className="w-5 h-5" />
                    </>
                  )}
                </span>
              </div>
              
              <Button size="lg" className="w-full bg-yellow-500 text-black font-black italic hover:bg-yellow-400 border-none shadow-[0_0_20px_rgba(234,179,8,0.4)]" onClick={() => { audioManager.playUIClick(); setReward(null); }}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
