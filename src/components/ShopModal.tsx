import { useState } from 'react';
import { useGameStore } from '../store';
import { audioManager } from '../game/AudioManager';
import { ScrapIcon } from './UI/ScrapIcon';
import { Button } from './UI/Button';
import { X, ShoppingBag, Check, Sparkles } from 'lucide-react';
import storeBackground from '../assets/storebackgr.webp';
import tokenIcon from '../assets/upgradetoken.webp';
import { useBackHandler } from '../platform';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopModal = ({ isOpen, onClose }: ShopModalProps) => {
  const { gp, upgradeTokens, buyUpgradeTokens, language } = useGameStore();
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  useBackHandler(onClose, isOpen);

  if (!isOpen) return null;

  const handleBuyTokens = (amount: number, cost: number, packId: string) => {
    if (cooldownSeconds > 0) return;
    audioManager.playUIClick();
    if (gp < cost) {
      audioManager.playWarning();
      setErrorMessage(language === 'tr' ? 'Yetersiz Scrap!' : 'Not enough Scrap!');
      setTimeout(() => setErrorMessage(null), 2500);
      return;
    }

    const success = buyUpgradeTokens(amount, cost);
    if (success) {
      audioManager.playTokenBuy();
      setPurchaseSuccess(packId);
      setCooldownSeconds(2);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = 2 - elapsed;
        if (remaining <= 0) {
          clearInterval(interval);
          setCooldownSeconds(0);
        } else {
          setCooldownSeconds(remaining);
        }
      }, 200);

      setTimeout(() => setPurchaseSuccess(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-950/95 border border-white/15 rounded-2xl p-2.5 sm:p-4 shadow-2xl flex flex-col max-h-[96vh] sm:max-h-[90vh] overflow-y-auto overflow-hidden">
        {/* Background Texture */}
        <img 
          src={storeBackground} 
          alt="Store Modal Background" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 opacity-20 brightness-90"
        />
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black italic uppercase tracking-wider text-white flex items-center gap-1.5 leading-tight">
                {language === 'tr' ? 'JETON MAĞAZASI' : 'TOKEN SHOP'}
              </h2>
            </div>
          </div>

          {/* Balances & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Scrap Balance */}
            <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-white">{gp.toLocaleString('tr-TR')}</span>
              <ScrapIcon className="w-3.5 h-3.5" />
            </div>

            {/* Token Balance */}
            <div className="flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/40 shadow-sm">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-300">{upgradeTokens}</span>
              <img src={tokenIcon} alt="Token" className="w-3.5 h-3.5 object-contain" />
            </div>

            {/* Close Button */}
            <button
              onClick={() => { audioManager.playUIClick(); onClose(); }}
              className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Notifications */}
        {purchaseSuccess && (
          <div className="my-1 py-1 px-2.5 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in shrink-0">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span>{language === 'tr' ? 'Satın alma başarılı! Jetonlar eklendi.' : 'Purchase successful! Tokens added.'}</span>
          </div>
        )}
        {errorMessage && (
          <div className="my-1 py-1 px-2.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in shrink-0">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2 Token Packs Grid (Fits on all screen heights and mobile landscape) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 py-2 shrink-0">
          
          {/* 1. ITEM: 3x Hızlı Yükseltme Jetonu - 45.000 Scrap */}
          <div className="bg-gradient-to-b from-amber-950/40 via-zinc-900/90 to-zinc-950 border-2 border-amber-500/80 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between relative shadow-[0_0_15px_rgba(245,158,11,0.2)] group hover:border-amber-400 transition-all">
            {/* Top Badge */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-black italic text-[7.5px] sm:text-[8.5px] uppercase px-1.5 py-0.2 rounded-full shadow-md tracking-wider flex items-center gap-0.5 whitespace-nowrap">
              <Sparkles className="w-2 h-2 fill-black" />
              {language === 'tr' ? 'EN ÇOK TERCİH EDİLEN' : 'BEST VALUE'}
            </div>

            <div className="flex flex-col items-center text-center mt-1">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 my-0.5 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xs animate-pulse" />
                <img 
                  src={tokenIcon} 
                  alt="3x Token" 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-black font-black text-[9px] px-1 py-0.2 rounded-full border border-white z-20">
                  x3
                </span>
              </div>

              <h3 className="font-black italic uppercase text-[11px] sm:text-xs text-white tracking-wide mt-0.5 leading-tight">
                {language === 'tr' ? '3x Yükseltme Jetonu' : '3x Upgrade Tokens'}
              </h3>
              <p className="text-[8.5px] sm:text-[9.5px] text-zinc-300 font-medium line-clamp-2 mt-0.5 leading-tight">
                {language === 'tr' ? '3 aracı anında güçlendirir.' : 'Instantly upgrades 3 cars.'}
              </p>
            </div>

            <div className="mt-1.5 flex flex-col gap-1">
              <div className="flex items-center justify-center gap-1 bg-black/40 py-0.5 rounded border border-white/10">
                <span className="font-mono font-bold text-[11px] text-yellow-400">87.500</span>
                <ScrapIcon className="w-3 h-3 text-yellow-400" />
              </div>
              <Button
                size="sm"
                onClick={() => handleBuyTokens(3, 87500, 'pack-3')}
                disabled={gp < 87500 || cooldownSeconds > 0}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-black italic text-[10px] sm:text-[11px] py-1 uppercase shadow-md shadow-amber-900/30 disabled:opacity-50"
              >
                {cooldownSeconds > 0 ? (language === 'tr' ? `BEKLEYİN (${cooldownSeconds}s)` : `WAIT (${cooldownSeconds}s)`) : (language === 'tr' ? 'SATIN AL' : 'BUY NOW')}
              </Button>
            </div>
          </div>

          {/* 2. ITEM: 1x Hızlı Yükseltme Jetonu - 34.500 Scrap */}
          <div className="bg-zinc-900/85 border border-white/15 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between relative hover:border-white/30 transition-all">
            <div className="flex flex-col items-center text-center mt-1">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 my-0.5 flex items-center justify-center">
                <img 
                  src={tokenIcon} 
                  alt="1x Token" 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 bg-zinc-700 text-white font-black text-[8.5px] px-1 py-0.2 rounded-full border border-white/20">
                  x1
                </span>
              </div>

              <h3 className="font-black italic uppercase text-[11px] sm:text-xs text-white tracking-wide mt-0.5 leading-tight">
                {language === 'tr' ? '1x Yükseltme Jetonu' : '1x Upgrade Token'}
              </h3>
              <p className="text-[8.5px] sm:text-[9.5px] text-zinc-400 font-medium line-clamp-2 mt-0.5 leading-tight">
                {language === 'tr' ? 'Tek seferlik anında geliştirme.' : 'Single instant upgrade token.'}
              </p>
            </div>

            <div className="mt-1.5 flex flex-col gap-1">
              <div className="flex items-center justify-center gap-1 bg-black/40 py-0.5 rounded border border-white/10">
                <span className="font-mono font-bold text-[11px] text-yellow-400">34.500</span>
                <ScrapIcon className="w-3 h-3 text-yellow-400" />
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleBuyTokens(1, 34500, 'pack-1')}
                disabled={gp < 34500 || cooldownSeconds > 0}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold italic text-[10px] sm:text-[11px] py-1 uppercase disabled:opacity-50"
              >
                {cooldownSeconds > 0 ? (language === 'tr' ? `BEKLEYİN (${cooldownSeconds}s)` : `WAIT (${cooldownSeconds}s)`) : (language === 'tr' ? 'SATIN AL' : 'BUY NOW')}
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
