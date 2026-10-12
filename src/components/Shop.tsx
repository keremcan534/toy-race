import { useGameStore, INITIAL_CARS } from '../store';
import { Button } from './UI/Button';
import { ArrowLeft, ShoppingCart, Flame, AlertCircle } from 'lucide-react';
import { CarPreview } from './CarPreview';
import { audioManager } from '../game/AudioManager';
import { ScrapIcon } from './UI/ScrapIcon';
import { CarName } from './UI/CarName';
import { StatBar } from './UI/StatBar';
import { useState } from 'react';
import { t } from '../i18n';
import storeBackground from '../assets/storebackgr.webp';
import { useBackHandler } from '../platform';

export const Shop = () => {
  const { cars: storeCars, selectedCarId, selectCar, buyCar, setScreen, gp, language } = useGameStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [carToBuy, setCarToBuy] = useState<string | null>(null);
  
  const handleBuyClick = (carId: string) => {
    const car = shopCars.find(c => c.id === carId);
    if (car && gp < car.price) {
      audioManager.playWarning();
      return;
    }
    setCarToBuy(carId);
    setShowConfirm(true);
  };

  const confirmBuy = () => {
    if (carToBuy) {
      buyCar(carToBuy);
      audioManager.playPurchase();
    }
    setShowConfirm(false);
    setCarToBuy(null);
  };

  const cancelBuy = () => {
    setShowConfirm(false);
    setCarToBuy(null);
  };

  // Android back closes the purchase confirmation first
  useBackHandler(() => {
    if (!showConfirm) return false;
    cancelBuy();
  });

  // Merge base stats with current ownership status
  const shopCars = INITIAL_CARS.map(baseCar => {
    const storeCar = storeCars.find(c => c.id === baseCar.id);
    return {
      ...baseCar,
      owned: storeCar?.owned ?? false
    };
  });

  const selectedCar = shopCars.find(c => c.id === selectedCarId) || shopCars[0];
  const carForConfirmation = carToBuy ? shopCars.find(c => c.id === carToBuy) : null;

  return (
    <div className="flex flex-col md:flex-row landscape:flex-row h-full w-full bg-zinc-950 text-white overflow-hidden font-sans select-none relative">
      {/* Background Image (storebackgr.jpg) - Clearly visible and vibrant */}
      <img 
        src={storeBackground} 
        alt="Store Background" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 brightness-105 contrast-105"
      />
      {/* Ultra-light overlay to guarantee crystal-clear background visibility while keeping text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none z-0" />

      {/* Confirmation Dialog */}
      {showConfirm && carForConfirmation && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-zinc-900/90 backdrop-blur-xl border-t-4 border-red-600 border border-white/10 p-6 max-w-sm w-full shadow-2xl skew-x-[-4deg]">
            <div className="skew-x-[4deg]">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500 h-6 w-6" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">
                  {language === 'en' ? 'Purchase Confirmation' : 'Satın Alma Onayı'}
                </h3>
              </div>
              
              <p className="text-zinc-300 mb-6 text-sm font-medium leading-relaxed">
                {language === 'en' ? (
                  <>Are you sure you want to purchase this car for <span className="text-white font-bold inline-flex items-center gap-1">{carForConfirmation.price.toLocaleString()} <ScrapIcon className="w-4 h-4 inline" /></span>?</>
                ) : (
                  <>Bu aracı <span className="text-white font-bold inline-flex items-center gap-1">{carForConfirmation.price.toLocaleString('tr-TR')} <ScrapIcon className="w-4 h-4 inline" /></span> karşılığında satın almak istediğinden emin misin?</>
                )}
              </p>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-white/15 bg-zinc-800/80 backdrop-blur hover:bg-zinc-700 text-zinc-300 hover:text-white skew-x-[-6deg]"
                  onClick={() => { audioManager.playUIClick(); cancelBuy(); }}
                >
                  <span className="skew-x-[6deg] font-bold italic uppercase text-xs">{t('cancel', language)}</span>
                </Button>
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white skew-x-[-6deg] shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  onClick={() => { audioManager.playUIClick(); confirmBuy(); }}
                >
                  <span className="skew-x-[6deg] font-black italic uppercase text-xs tracking-wider">{t('confirm', language)}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar (Absolute) */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-3 sm:p-4 z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { audioManager.playUIClick(); setScreen('MAIN_MENU'); }} 
            className="bg-zinc-950/70 backdrop-blur-md border-white/15 text-zinc-300 hover:text-white hover:border-red-500 transition-colors shadow-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('back', language)}
          </Button>
        </div>
        
        <div className="pointer-events-auto flex items-center gap-2.5 bg-zinc-950/75 backdrop-blur-md px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm border-l-4 border-red-600 border border-white/10 shadow-lg shadow-black/40 skew-x-[-10deg]">
          <div className="skew-x-[10deg] flex items-center gap-2">
            <span className="font-mono text-lg sm:text-xl text-white font-bold tracking-wider">{gp.toLocaleString('tr-TR')}</span>
            <ScrapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Left Side: Car Preview & Stats (Translucent Glass Panel) */}
      <div className="w-full h-auto md:h-full landscape:h-full md:w-[40%] landscape:w-[42%] flex flex-col items-center justify-center-safe bg-zinc-950/45 backdrop-blur-md p-2 sm:p-4 relative border-b md:border-b-0 md:border-r border-white/10 pt-16 sm:pt-16 md:pt-20 z-10 shrink-0 overflow-y-auto shadow-2xl">
        
        {/* Car Title - Only shown on portrait or desktop screens */}
        <div className="mb-0.5 md:mb-3 text-center hidden portrait:block md:block">
          <h2 className="text-base md:text-2xl font-black italic text-white uppercase tracking-tighter drop-shadow-md">
            <CarName name={selectedCar.name} />
          </h2>
          <div className="h-0.5 w-12 bg-red-600 mx-auto mt-1 skew-x-[-12deg]" />
        </div>

        {/* Selected Car Stage Preview */}
        <div className="w-full max-w-[200px] sm:max-w-[260px] aspect-video my-0.5 sm:my-1 flex items-center justify-center relative shrink-0">
          <CarPreview car={selectedCar} scale={3.4} />
        </div>

        {/* Stats & Actions Container */}
        <div className="w-full max-w-xs space-y-1.5 sm:space-y-2 bg-black/35 backdrop-blur-md p-2 sm:p-3 rounded-lg border border-white/10 my-0.5 shadow-lg">
          {/* Header with car name & max level for compact landscape */}
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <h3 className="font-black italic text-xs sm:text-sm text-white uppercase truncate">
              <CarName name={selectedCar.name} />
            </h3>
            {selectedCar.maxUpgradeLevel === 1 ? (
              <span className="text-[9px] font-black italic text-purple-400 uppercase tracking-wider">{t('statSpecial', language)}</span>
            ) : (
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                {language === 'en' ? 'Max Lvl' : 'Maks Lvl'}: <strong className="text-white font-black">{selectedCar.maxUpgradeLevel}</strong>
              </span>
            )}
          </div>

          <div key={selectedCar.id} className="space-y-1 sm:space-y-1.5 shrink-0">
            <StatBar label={t('statSpeed', language)} value={selectedCar.maxSpeed} statType="speed" carId={selectedCar.id} enableUpgradeEffect={false} />
            <StatBar label={t('statAccel', language)} value={selectedCar.acceleration} statType="accel" carId={selectedCar.id} enableUpgradeEffect={false} />
            <StatBar label={t('statHandling', language)} value={selectedCar.handling} statType="handling" carId={selectedCar.id} enableUpgradeEffect={false} />
          </div>
          
          <div className="mt-1.5 sm:mt-3 flex justify-center">
             {selectedCar.owned ? (
               <div className="w-full py-1.5 sm:py-2.5 bg-zinc-800/80 backdrop-blur border border-white/10 text-emerald-400 rounded-sm font-bold text-center text-xs italic tracking-wider uppercase flex items-center justify-center gap-2 shadow-inner">
                 <span>{language === 'en' ? 'In Your Garage' : 'Garajında Mevcut'}</span>
               </div>
             ) : (
               <Button 
                 size="md" 
                 className="w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-base py-2 sm:py-3.5 skew-x-[-6deg] shadow-[0_0_20px_rgba(220,38,38,0.4)] border-none group transition-all"
                 onClick={() => { audioManager.playUIClick(); handleBuyClick(selectedCar.id); }}
                 disabled={gp < selectedCar.price}
               >
                 <div className="skew-x-[6deg] flex items-center justify-center gap-2">
                   <ShoppingCart className="mr-1 h-3.5 w-3.5 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                   <span className="font-black italic flex items-center gap-1.5 text-xs sm:text-base">{selectedCar.price.toLocaleString('tr-TR')} <ScrapIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5" /></span>
                 </div>
               </Button>
             )}
          </div>
          {!selectedCar.owned && gp < selectedCar.price && (
            <p className="text-center text-red-400 text-[10px] font-bold uppercase tracking-wide mt-0.5 flex items-center justify-center gap-1">
              {t('insufficientScrap', language)} <ScrapIcon className="w-3 h-3" />
            </p>
          )}
        </div>
      </div>

      {/* Right Side: Car Grid (Translucent Frosted Glass Over Background) */}
      <div className="w-full md:w-[60%] landscape:w-[60%] h-full bg-zinc-950/25 backdrop-blur-xs p-4 sm:p-6 pt-16 sm:pt-16 md:pt-20 overflow-y-auto relative z-10">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 sticky top-0 bg-zinc-950/50 backdrop-blur-md py-3 sm:py-4 px-3 rounded-lg z-20 border border-white/10 shadow-lg">
          <Flame className="text-red-500 fill-red-500 w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-lg sm:text-2xl font-black italic text-white uppercase tracking-tighter">
            {language === 'en' ? 'Showroom' : 'Showroom'}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pb-12">
          {shopCars.map((car) => (
            <div 
              key={car.id}
              onClick={() => { audioManager.playUIClick(); selectCar(car.id); }}
              className={`p-2.5 sm:p-3 rounded-sm border-2 cursor-pointer transition-all relative group skew-x-[-3deg] hover:skew-x-0 duration-300 ${
                selectedCarId === car.id 
                  ? 'border-red-500 bg-zinc-900/85 shadow-[0_0_20px_rgba(220,38,38,0.3)] ring-1 ring-red-400/40' 
                  : 'border-white/10 hover:border-white/30 bg-zinc-950/45 hover:bg-zinc-900/65'
              }`}
            >
              <div 
                className="w-full aspect-video rounded-sm mb-2 sm:mb-3 flex items-center justify-center relative overflow-hidden bg-black/50 border border-white/5 shadow-inner"
              >
                <div className="skew-x-[3deg] w-full h-full flex items-center justify-center">
                  <CarPreview car={car} scale={3.5} />
                </div>
                
                {/* Price Tag Overlay */}
                {!car.owned && (
                   <div className="absolute inset-x-0 bottom-0 bg-black/85 py-1 flex items-center justify-center gap-1 border-t border-white/10 z-10">
                     <span className="text-[11px] sm:text-xs text-white font-mono font-bold">
                       {car.price.toLocaleString('tr-TR')}
                     </span>
                     <ScrapIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                   </div>
                )}
              </div>
              
              <div className="flex justify-between items-center skew-x-[3deg] px-1">
                <span className={`font-bold text-[10px] sm:text-xs truncate max-w-[70%] uppercase tracking-wider ${selectedCarId === car.id ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                  <CarName name={car.name} />
                </span>
                {car.owned && (
                  <span className="text-[9px] sm:text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded-sm font-bold border border-emerald-500/40">
                    {t('ownedBadge', language)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
