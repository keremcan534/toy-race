import { useRef, type MutableRefObject } from 'react';
import { GameState } from './Physics2D';
import { useGameFrame } from './frameBus';

interface SpeedometerProps {
  stateRef: MutableRefObject<GameState>;
}

type NitroLook = 'active' | 'ready' | 'charging';

const NITRO_BAR_CLASS: Record<NitroLook, string> = {
  active: 'h-full w-full origin-left bg-gradient-to-r from-cyan-400 via-sky-300 to-white rounded-full shadow-[0_0_12px_#22d3ee,0_0_4px_#ffffff]',
  ready: 'h-full w-full origin-left bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-300 rounded-full shadow-[0_0_6px_rgba(6,182,212,0.4)]',
  charging: 'h-full w-full origin-left bg-gradient-to-r from-zinc-600 via-amber-600/70 to-amber-500/90 rounded-full',
};
const NITRO_TEXT_CLASS: Record<NitroLook, string> = {
  active: 'text-[7px] sm:text-[8px] font-mono font-black text-cyan-200 animate-pulse',
  ready: 'text-[7px] sm:text-[8px] font-mono font-bold text-cyan-300',
  charging: 'text-[7px] sm:text-[8px] font-mono font-medium text-amber-400/90',
};

const gearFor = (speedKmh: number) => {
  if (speedKmh === 0) return 'N';
  if (speedKmh < 50) return '1';
  if (speedKmh < 95) return '2';
  if (speedKmh < 145) return '3';
  if (speedKmh < 195) return '4';
  if (speedKmh < 245) return '5';
  return '6';
};

export const Speedometer = ({ stateRef }: SpeedometerProps) => {
  const speedTextRef = useRef<HTMLSpanElement>(null);
  const gearTextRef = useRef<HTMLSpanElement>(null);
  const arcCanvasRef = useRef<HTMLCanvasElement>(null);
  const nitroBarRef = useRef<HTMLDivElement>(null);
  const nitroTextRef = useRef<HTMLSpanElement>(null);
  const draftBadgeRef = useRef<HTMLDivElement>(null);
  // Last values written to the DOM: each one is touched only when it changes.
  const shown = useRef({ speed: -1, gear: '', nitro: -1, look: '' as NitroLook | '', drafting: false, arc: '' });

  useGameFrame(() => {
    const state = stateRef.current;
    if (!state || !state.car) return;
    const last = shown.current;
    const speedKmh = Math.round(Math.hypot(state.car.velocity.x, state.car.velocity.y));

    if (speedKmh !== last.speed && speedTextRef.current) {
      speedTextRef.current.textContent = speedKmh.toString();
    }
    last.speed = speedKmh;

    // Draft Badge Update
    const isDrafting = !!(state.car.draftIntensity && state.car.draftIntensity > 0.10);
    if (isDrafting !== last.drafting && draftBadgeRef.current) {
      draftBadgeRef.current.style.display = isDrafting ? 'flex' : 'none';
      last.drafting = isDrafting;
    }

    // Calculate Gear based on realistic km/h
    const gear = gearFor(speedKmh);
    if (gear !== last.gear && gearTextRef.current) {
      gearTextRef.current.textContent = gear;
      last.gear = gear;
    }

    // Update Nitro Gauge
    const nitroVal = Math.round(state.nitro ?? 100);
    const look: NitroLook = state.isNitroActive ? 'active' : nitroVal > 50 ? 'ready' : 'charging';
    if (nitroVal !== last.nitro) {
      if (nitroBarRef.current) nitroBarRef.current.style.transform = `scaleX(${nitroVal / 100})`;
      if (nitroTextRef.current) nitroTextRef.current.textContent = `${nitroVal}%`;
      last.nitro = nitroVal;
    }
    if (look !== last.look) {
      if (nitroBarRef.current) nitroBarRef.current.className = NITRO_BAR_CLASS[look];
      if (nitroTextRef.current) nitroTextRef.current.className = NITRO_TEXT_CLASS[look];
      last.look = look;
    }

    // Draw Arc Gauge on canvas
    const maxKmh = state.isNitroActive ? 350 : 280;
    const ratio = Math.min(speedKmh / maxKmh, 1);
    const color = state.isNitroActive ? '#06b6d4' : ratio > 0.85 ? '#ef4444' : ratio > 0.6 ? '#f97316' : '#22c55e';
    const arcKey = `${Math.round(ratio * 200)}|${color}`;
    const canvas = arcCanvasRef.current;
    if (canvas && arcKey !== last.arc) {
      last.arc = arcKey;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 22;
        const startAngle = Math.PI * 0.75;
        const endAngle = Math.PI * 2.25;

        // Background arc
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        // Active speed arc
        if (ratio > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius, startAngle, startAngle + ratio * (endAngle - startAngle));
          ctx.lineWidth = 3.5;
          ctx.strokeStyle = color;
          ctx.stroke();
        }
      }
    }
  });

  return (
    <div
      className="relative flex items-center gap-2 sm:gap-2.5 bg-black/65 border border-white/20 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] skew-x-[-6deg] select-none"
    >
      {/* Gauge Canvas */}
      <div className="skew-x-[6deg] relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
        <canvas ref={arcCanvasRef} width={50} height={50} className="w-9 h-9 sm:w-11 sm:h-11 absolute inset-0" />
        <div className="flex flex-col items-center justify-center z-10 leading-none">
          <span ref={gearTextRef} className="font-black italic text-[10px] sm:text-xs text-red-500">N</span>
          <span className="text-[6px] sm:text-[7px] font-bold text-zinc-400 uppercase">GEAR</span>
        </div>
      </div>

      {/* Digital Speed Number & Draft Badge */}
      <div className="skew-x-[6deg] flex flex-col justify-center min-w-[42px] sm:min-w-[50px]">
        <div className="flex items-baseline gap-0.5">
          <span ref={speedTextRef} className="text-base sm:text-xl font-black italic font-mono text-white tracking-tight leading-none">
            0
          </span>
          <span className="text-[7px] sm:text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest">
            KM/H
          </span>
        </div>
        {/* Subtle Draft / Slipstream indicator */}
        <div
          ref={draftBadgeRef}
          style={{ display: 'none' }}
          className="items-center gap-0.5 mt-0.5 bg-sky-500/25 border border-sky-400/60 px-1 py-[1px] rounded-[3px] shadow-[0_0_8px_rgba(56,189,248,0.5)] animate-pulse"
        >
          <span className="text-[6px] sm:text-[7px] font-black italic text-sky-200 tracking-wider leading-none">
            DRAFT
          </span>
        </div>
      </div>

      {/* Nitro Bar Gauge */}
      <div className="skew-x-[6deg] flex flex-col justify-center min-w-[55px] sm:min-w-[70px] border-l border-white/15 pl-2 sm:pl-2.5">
        <div className="flex items-baseline justify-between gap-1 mb-0.5">
          <span className="text-[7px] sm:text-[8px] font-black italic tracking-widest text-cyan-400 flex items-center gap-0.5">
            NITRO
          </span>
          <span ref={nitroTextRef} className={NITRO_TEXT_CLASS.ready}>
            100%
          </span>
        </div>
        <div className="relative w-full h-1.5 sm:h-2 bg-zinc-900 rounded-full overflow-hidden border border-cyan-500/30 p-[1px]">
          {/* Width changes are a transform (no layout work every frame) */}
          <div ref={nitroBarRef} className={NITRO_BAR_CLASS.ready} />
          {/* 50% Threshold marker line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/40 pointer-events-none z-10" title="50% Activation Threshold" />
        </div>
      </div>
    </div>
  );
};
