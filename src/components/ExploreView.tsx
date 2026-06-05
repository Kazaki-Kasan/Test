/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Zap, Menu, UserCircle, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CoreTelemetry } from '../types';

interface ExploreViewProps {
  telemetry: CoreTelemetry;
  isRecalibrating: boolean;
  onRecalibrate: () => void;
}

export default function ExploreView({
  telemetry,
  isRecalibrating,
  onRecalibrate,
}: ExploreViewProps) {
  // Determine color theme classes depending on system status
  const isHealthy = telemetry.systemStatus === 'OPTIMAL';
  const statusColorClass = isRecalibrating
    ? 'text-yellow-400'
    : isHealthy
    ? 'text-cyan-400'
    : 'text-rose-400';

  return (
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 select-none">
      {/* Top Left Floating Latency Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-fit pointer-events-auto mt-20"
      >
        <div className="glass-panel p-4 rounded-xl shadow-lg border border-cyan-500/15 max-w-[200px]">
          <p className="font-mono text-[10px] text-cyan-200/50 uppercase tracking-widest mb-1">
            Core Latency
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-sans font-extrabold text-2xl text-cyan-300 tracking-tight">
              {telemetry.latency.toFixed(4)}
            </span>
            <span className="text-xs text-cyan-400/65 font-mono">ms</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Center Badge for core locking/synchronization status */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-cyan-900/40 px-4 py-1.5 rounded-full border border-cyan-400/30 backdrop-blur-md shadow-2xl shadow-cyan-900/30"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRecalibrating ? 'bg-yellow-400' : 'bg-cyan-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRecalibrating ? 'bg-yellow-500' : 'bg-cyan-500'}`}></span>
          </span>
          <span className="font-sans text-[11px] font-bold text-cyan-300 uppercase tracking-widest">
            {isRecalibrating ? 'Calibrating Systems' : 'Core Synchronized'}
          </span>
        </motion.div>
      </div>

      {/* Bottom Diagnostics Sheet */}
      <div className="w-full max-w-lg mx-auto pointer-events-auto pb-4">
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', damping: 20 }}
          className="glass-panel rounded-2xl p-5 shadow-[0px_-10px_40px_rgba(0,0,0,0.55)] border border-white/5 relative overflow-hidden"
        >
          {/* Subtle decoration accent glow at the top edge */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Micro pill slider handler (Static accessory) */}
          <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-5" />

          {/* Dual Metrics Grid: Energy Levels & Operational Node Segments */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Energy levels tracker */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <span className="font-sans text-[10px] font-bold tracking-wider text-cyan-200/50 uppercase">
                  Energy Level
                </span>
                <span className="font-mono text-xs font-semibold text-cyan-300">
                  {telemetry.energyLevel}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-900/80 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full bg-cyan-400 shadow-[0_0_12px_rgba(0,219,233,0.7)]"
                  animate={{ width: `${telemetry.energyLevel}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* System Status Segment Blocks */}
            <div className="flex flex-col gap-1.2">
              <div className="flex justify-between items-end">
                <span className="font-sans text-[10px] font-bold tracking-wider text-cyan-200/50 uppercase">
                  System Status
                </span>
                <span className={`font-sans text-[11px] font-extrabold tracking-wide ${statusColorClass}`}>
                  {telemetry.systemStatus}
                </span>
              </div>
              
              {/* Segmented status lights */}
              <div className="flex gap-1 h-1.5 mt-1">
                <div className={`flex-1 rounded-full transition-all duration-300 ${
                  isRecalibrating 
                    ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' 
                    : isHealthy 
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,219,233,0.5)]' 
                    : 'bg-rose-500'
                }`} />
                <div className={`flex-1 rounded-full transition-all duration-300 ${
                  isRecalibrating 
                    ? 'bg-yellow-500/50' 
                    : isHealthy 
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,219,233,0.5)]' 
                    : 'bg-rose-500/30'
                }`} />
                <div className={`flex-1 rounded-full transition-all duration-300 ${
                  isRecalibrating 
                    ? 'bg-slate-800' 
                    : isHealthy 
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,219,233,0.5)]' 
                    : 'bg-slate-800'
                }`} />
                <div className={`flex-1 rounded-full bg-slate-800 transition-colors duration-300`} />
              </div>
            </div>
          </div>

          {/* Bottom Callout & Interactive Calibrate Action */}
          <div className="flex justify-between items-center bg-slate-950/40 p-3.5 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 flex items-center justify-center text-cyan-400 border border-cyan-500/10">
                <Zap className={`w-5 h-5 ${isRecalibrating ? 'animate-bounce text-yellow-400' : ''}`} />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-slate-100">Synthetic Horizon</p>
                <p className="font-mono text-[10px] text-cyan-300/60 tracking-wider">
                  Active Protocol: X-01
                </p>
              </div>
            </div>

            <button
              onClick={onRecalibrate}
              disabled={isRecalibrating}
              className={`font-sans text-[11px] px-4 py-2.5 rounded-lg font-bold tracking-widest uppercase transition-all active:scale-95 duration-200 border cursor-pointer ${
                isRecalibrating
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 cursor-not-allowed opacity-80'
                  : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 border-cyan-400 hover:shadow-[0_0_15px_rgba(0,219,233,0.45)]'
              }`}
            >
              {isRecalibrating ? 'REC_SYNCING' : 'RECALIBRATE'}
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
