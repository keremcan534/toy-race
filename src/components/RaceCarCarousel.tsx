import React, { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Car } from '../store';
import { CarPreview } from './CarPreview';
import { CarName } from './UI/CarName';
import { CarRatingStar } from './UI/CarRatingStar';
import { audioManager } from '../game/AudioManager';

interface RaceCarCarouselProps {
  cars: Car[];
  selectedCarId: string;
  onSelectCar: (carId: string) => void;
  language: 'tr' | 'en';
}

export const RaceCarCarousel: React.FC<RaceCarCarouselProps> = ({
  cars,
  selectedCarId,
  onSelectCar,
  language,
}) => {
  const selectedIndex = Math.max(0, cars.findIndex(c => c.id === selectedCarId));
  const selectedCar = cars[selectedIndex] || cars[0];

  // Direction tracking for large showcase slide animation
  const prevIndexRef = useRef(selectedIndex);
  const direction = selectedIndex >= prevIndexRef.current ? 1 : -1;
  useEffect(() => {
    prevIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Safe selection within bounds
  const handleSelectIndex = useCallback((index: number) => {
    const targetIndex = Math.max(0, Math.min(cars.length - 1, index));
    if (targetIndex !== selectedIndex) {
      audioManager.playUIClick();
      onSelectCar(cars[targetIndex].id);
    }
  }, [cars, selectedIndex, onSelectCar]);

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      handleSelectIndex(selectedIndex - 1);
    }
  }, [selectedIndex, handleSelectIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex < cars.length - 1) {
      handleSelectIndex(selectedIndex + 1);
    }
  }, [selectedIndex, cars.length, handleSelectIndex]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

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
  }, [handlePrev, handleNext]);

  // Pointer drag/swipe handling on the main showcase area
  const dragStartXRef = useRef<number | null>(null);
  const dragCurrentXRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    dragCurrentXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null) return;
    dragCurrentXRef.current = e.clientX;
  };

  const handlePointerUp = () => {
    if (dragStartXRef.current !== null && dragCurrentXRef.current !== null) {
      const deltaX = dragCurrentXRef.current - dragStartXRef.current;
      if (Math.abs(deltaX) > 25) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    dragStartXRef.current = null;
    dragCurrentXRef.current = null;
  };

  // Mouse wheel horizontal navigation
  const lastWheelTimeRef = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 200) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 15) {
      lastWheelTimeRef.current = now;
      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-hidden relative select-none justify-between"
      onWheel={handleWheel}
    >
      {/* ========================================================================= */}
      {/* 1. TOP / CENTER: LARGE SELECTED CAR SHOWCASE STAGE                       */}
      {/* ========================================================================= */}
      <div 
        className="flex-1 min-h-0 flex flex-col items-center justify-center relative overflow-hidden px-2 py-1 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Subtle Stage Lighting & Ground Glow directly behind car */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="w-[180px] sm:w-[240px] md:w-[300px] h-[35px] sm:h-[45px] md:h-[60px] rounded-full blur-xl opacity-45 transition-all duration-500"
            style={{
              background: selectedCar?.color 
                ? `radial-gradient(ellipse at center, ${selectedCar.color} 0%, rgba(220,38,38,0.2) 45%, transparent 75%)`
                : 'radial-gradient(ellipse at center, rgba(220,38,38,0.3) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Animated Large Car Canvas */}
        <div className="relative w-full flex-1 min-h-[60px] max-h-[110px] sm:max-h-[145px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={selectedCar.id}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 50 : -50,
                  opacity: 0,
                  scale: 0.9,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    x: { type: 'spring', stiffness: 380, damping: 32 },
                    opacity: { duration: 0.15 },
                    scale: { duration: 0.18, ease: 'easeOut' },
                  },
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? -40 : 40,
                  opacity: 0,
                  scale: 0.9,
                  transition: {
                    x: { duration: 0.12, ease: 'easeInOut' },
                    opacity: { duration: 0.1 },
                    scale: { duration: 0.11 },
                  },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex items-center justify-center relative"
            >
              <div className="relative max-w-full max-h-full flex items-center justify-center">
                <CarPreview
                  car={selectedCar}
                  scale={2.1}
                  transparent={true}
                  canvasWidth={240}
                  canvasHeight={110}
                  className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] max-h-[95px] sm:max-h-[135px] object-contain"
                />

                {/* Locked Badge Overlay */}
                {!selectedCar.owned && (
                  <div className="absolute top-0 right-0 bg-red-950/90 border border-red-500/50 text-red-300 text-[7px] sm:text-[8px] font-black italic px-1.5 py-0.5 rounded-sm flex items-center gap-1 uppercase tracking-widest shadow-md shadow-black/80 backdrop-blur-md">
                    <Lock className="w-2.5 h-2.5 text-red-400" />
                    <span>{language === 'tr' ? 'KİLİTLİ' : 'LOCKED'}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* 2. CAR INFO: CLEAN VEHICLE NAME & HELPER DETAILS                          */}
        {/* ========================================================================= */}
        <div className="mt-1 flex items-center justify-center gap-2 shrink-0 z-10">
          <h2 className="text-xs sm:text-sm md:text-base font-black italic uppercase tracking-wider text-white drop-shadow-md leading-none">
            <CarName name={selectedCar.name} />
          </h2>
          <div className="shrink-0 scale-75 sm:scale-85 origin-center">
            <CarRatingStar car={selectedCar} size="sm" />
          </div>
          <span className="text-[7.5px] sm:text-[8.5px] font-mono font-bold text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest leading-none">
            {selectedCar.type}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM: WIDE HORIZONTAL NAVIGATION ARROWS                              */}
      {/* ========================================================================= */}
      <div className="shrink-0 w-full mb-1 sm:mb-1.5 flex items-center justify-between gap-2 px-1 z-20">
        {/* Wide Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={selectedIndex === 0}
          aria-label="Previous car"
          className="flex-1 h-9 sm:h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 active:scale-[0.98] border border-white/15 hover:border-red-500/60 text-zinc-300 hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-black/60 cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[10px] sm:text-xs font-black italic uppercase tracking-wider text-zinc-300 group-hover:text-white">
            {language === 'tr' ? 'ÖNCEKİ' : 'PREV'}
          </span>
        </button>

        {/* Counter Badge */}
        <div className="shrink-0 px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-zinc-400 font-mono text-[10px] sm:text-xs font-bold tracking-wider shadow-inner">
          {selectedIndex + 1} / {cars.length}
        </div>

        {/* Wide Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={selectedIndex === cars.length - 1}
          aria-label="Next car"
          className="flex-1 h-9 sm:h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 active:scale-[0.98] border border-white/15 hover:border-red-500/60 text-zinc-300 hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-black/60 cursor-pointer group"
        >
          <span className="text-[10px] sm:text-xs font-black italic uppercase tracking-wider text-zinc-300 group-hover:text-white">
            {language === 'tr' ? 'SONRAKİ' : 'NEXT'}
          </span>
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
