/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Sliders, Activity, Terminal, ShieldAlert, CheckCircle2, ShieldAlert as WarningIcon, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CoreTelemetry, DiagnosticLog, LogLevel } from '../types';

interface InsightsViewProps {
  telemetry: CoreTelemetry;
  onUpdateTelemetry: (updated: Partial<CoreTelemetry>) => void;
  logs: DiagnosticLog[];
  onAddLog: (level: LogLevel, message: string) => void;
  onClearLogs: () => void;
  latencyHistory: number[];
  onInjectChaos: () => void;
}

export default function InsightsView({
  telemetry,
  onUpdateTelemetry,
  logs,
  onAddLog,
  onClearLogs,
  latencyHistory,
  onInjectChaos,
}: InsightsViewProps) {
  const [filter, setFilter] = useState<LogLevel | 'ALL'>('ALL');

  // Filter logs list
  const filteredLogs = useMemo(() => {
    if (filter === 'ALL') return logs;
    return logs.filter((l) => l.level === filter);
  }, [logs, filter]);

  // Compute stats for visualization
  const averageLatency = useMemo(() => {
    if (latencyHistory.length === 0) return 0;
    return latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length;
  }, [latencyHistory]);

  const maxLatency = useMemo(() => {
    if (latencyHistory.length === 0) return 0;
    return Math.max(...latencyHistory);
  }, [latencyHistory]);

  // SVG Line Chart calculations
  const chartPoints = useMemo(() => {
    if (latencyHistory.length < 2) return '';
    const width = 450;
    const height = 110;
    const padding = 10;
    const activeWidth = width - padding * 2;
    const activeHeight = height - padding * 2;

    const minVal = 0.005; // fixed base floor to draw consistent height ratios
    const maxVal = Math.max(0.12, ...latencyHistory, maxLatency);

    const points = latencyHistory.map((val, idx) => {
      const x = padding + (idx / (latencyHistory.length - 1)) * activeWidth;
      // Invert Y because SVG 0 is top
      const ratio = (val - minVal) / (maxVal - minVal || 1);
      const y = height - padding - ratio * activeHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return points.join(' ');
  }, [latencyHistory, maxLatency]);

  // Level Badge mapping
  const getLevelBadgeClass = (level: LogLevel) => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-950/40 text-blue-400 border-blue-500/20';
      case 'WARNING':
        return 'bg-yellow-950/40 text-yellow-400 border-yellow-500/20';
      case 'SUCCESS':
        return 'bg-cyan-950/40 text-cyan-400 border-cyan-500/20';
      case 'CRITICAL':
        return 'bg-rose-950/40 text-rose-400 border-rose-500/20 animate-pulse';
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-auto p-4 overflow-y-auto pt-20 pb-28 select-none">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
        
        {/* Title Grid */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sliders className="w-5 h-5" />
            <h2 className="font-sans font-extrabold text-xl tracking-tight uppercase">
              Operational Insights & Tuner
            </h2>
          </div>
          <p className="font-sans text-xs text-cyan-200/50">
            Live telemetry scope and Core parameter fine-tuning console. Adjust satellite particle counts or containment strength.
          </p>
        </div>

        {/* Oscilloscope Diagnostic Scope */}
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/10 bg-slate-900/10 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-cyan-400" />
              <span className="font-sans text-xs font-bold text-slate-200 uppercase tracking-wide">
                Core Telemetry Latency Scope
              </span>
            </div>
            {/* Legend Stats */}
            <div className="flex gap-4 font-mono text-[9px] text-slate-400">
              <div>
                AVG: <span className="text-cyan-300 font-bold">{averageLatency.toFixed(4)} ms</span>
              </div>
              <div>
                PEAK: <span className="text-rose-400 font-bold">{maxLatency.toFixed(4)} ms</span>
              </div>
            </div>
          </div>

          {/* SVG Sparkline Graph */}
          <div className="w-full bg-slate-950/60 rounded-lg p-3 border border-white/5 relative overflow-hidden h-32 flex items-center justify-center">
            {latencyHistory.length > 1 ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 450 110" preserveAspectRatio="none">
                {/* Horizontal Baseline markers */}
                <line x1="0" y1="20" x2="450" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <line x1="0" y1="55" x2="450" y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="90" x2="450" y2="90" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

                {/* Oscillating Area Mesh Gradient */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area under line */}
                {chartPoints && (
                  <polygon
                    points={`${chartPoints} 440,110 10,110`}
                    fill="url(#chartGradient)"
                    className="transition-all duration-300"
                  />
                )}

                {/* Main Sparkline Trace */}
                {chartPoints && (
                   <polyline
                     fill="none"
                     stroke="#00dbe9"
                     strokeWidth="2.2"
                     points={chartPoints}
                     className="transition-all duration-300 drop-shadow-[0_0_6px_rgba(0,135,255,0.6)]"
                   />
                )}

                {/* Interactive Endpoint indicator */}
                {chartPoints && (
                  <circle
                    cx={10 + (latencyHistory.length - 1) * (430 / (latencyHistory.length - 1))}
                    cy={110 - 10 - ((latencyHistory[latencyHistory.length - 1] - 0.005) / (Math.max(0.12, maxLatency) - 0.005 || 1)) * 90}
                    r="4"
                    fill="#38bdf8"
                    className="animate-ping"
                  />
                )}
              </svg>
            ) : (
              <span className="font-mono text-xs text-slate-500">Awaiting telemetry packets...</span>
            )}
          </div>
        </div>

        {/* Grid Split: Left (Hardware Sliders) | Right (Telemetry Logs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Hardware Parameters Tuner */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/10 bg-slate-900/10 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="font-sans text-xs font-bold text-slate-200 uppercase tracking-wider">
                Magnetic Tuner Console
              </span>
            </div>

            {/* Slider 1: Core Frequency */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center font-mono text-[9px] text-slate-400">
                <span>CORE BASE FREQUENCY</span>
                <span className="text-cyan-400 font-bold">{telemetry.coreFrequency.toFixed(2)} GHz</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={telemetry.coreFrequency}
                onChange={(e) => {
                  const freq = parseFloat(e.target.value);
                  onUpdateTelemetry({ coreFrequency: freq });
                }}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none"
              />
              <p className="font-sans text-[10px] text-slate-500/80">
                Directly dictates the speed and energy spin rate of the WebGL Crystal geometry.
              </p>
            </div>

            {/* Slider 2: Particle counts */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center font-mono text-[9px] text-slate-400">
                <span>ORBITAL PARTICLE DENSITY</span>
                <span className="text-cyan-400 font-bold">{telemetry.particleDensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={telemetry.particleDensity}
                onChange={(e) => {
                  const dens = parseInt(e.target.value, 10);
                  onUpdateTelemetry({ particleDensity: dens });
                }}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none"
              />
              <p className="font-sans text-[10px] text-slate-500/80">
                Determines satellite density clusters tracked inside the gravitational field.
              </p>
            </div>

            {/* Slider 3: Containment Strength */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center font-mono text-[9px] text-slate-400">
                <span>CONTAINMENT ENCLOSURE STRENGTH</span>
                <span className="text-cyan-400 font-bold">{telemetry.containmentStrength}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="1"
                value={telemetry.containmentStrength}
                onChange={(e) => {
                  const power = parseInt(e.target.value, 10);
                  onUpdateTelemetry({ containmentStrength: power });
                  // Add alert log if drop too low
                  if (power < 50) {
                    onAddLog('CRITICAL', `Containment fields drop dangerously low: ${power}%`);
                  }
                }}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none"
              />
              <p className="font-sans text-[10px] text-slate-500/80">
                A higher field preserves structural cohesion, shielding latency from micro-magnetic interference.
              </p>
            </div>

            {/* Inject Anomaly (Failsafe Chaos play module) */}
            <button
              onClick={() => {
                onInjectChaos();
              }}
              className="mt-2 w-full p-2 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 active:scale-95 duration-200 cursor-pointer text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-1.5"
            >
              <WarningIcon className="w-3.5 h-3.5 animate-bounce" />
              INJECT MAGNETIC ANOMALY
            </button>
          </div>

          {/* Telemetry Log Terminal Stream */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/10 bg-slate-900/10 flex flex-col gap-3 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-sans text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">
                  Diagnostic Stream
                </span>
              </div>
              <button
                onClick={onClearLogs}
                className="font-mono text-[9px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                CLEAR
              </button>
            </div>

            {/* Logs levels filter triggers */}
            <div className="flex flex-wrap gap-1 font-mono text-[9px]">
              {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'CRITICAL'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl as any)}
                  className={`px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                    filter === lvl
                      ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-950/40 text-slate-400 border-white/5 hover:bg-white/5'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Simulated terminal scrolling output layout */}
            <div className="flex-1 bg-slate-950/80 rounded-lg p-2.5 border border-white/5 font-mono text-[10px] leading-relaxed flex flex-col gap-2 max-h-[220px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-0.5 border-b border-white/[0.03] pb-1.5 last:border-0"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[9px]">[{log.timestamp}]</span>
                      <span className={`px-1 text-[8px] rounded border uppercase font-bold tracking-wider leading-none select-none py-0.5 ${getLevelBadgeClass(log.level)}`}>
                        {log.level}
                      </span>
                    </div>
                    <span className="text-slate-300 font-medium whitespace-pre-wrap">
                      {log.message}
                    </span>
                  </motion.div>
                ))}
                {filteredLogs.length === 0 && (
                  <div className="text-center text-slate-600/70 py-10">
                    No diagnostics found matching filter schema.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
