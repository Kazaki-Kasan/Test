import React, { useState, useEffect } from 'react';

export const AnalyticsDashboard: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<number[]>(
    Array.from({ length: 12 }, () => 40 + Math.random() * 40)
  );

  // Poll chart data to look active/live
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const next = [...prev.slice(1)];
        // Add a fluctuating percentage
        next.push(45 + Math.random() * 45);
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const maxValue = 100;
  const width = 280;
  const height = 110;
  const padding = 15;

  // Compute SVG polygon coordinates for a beautiful filled area chart
  const points = dataPoints.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (dataPoints.length - 1);
    const y = height - padding - (val / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="glass-panel p-6 rounded-xl flex flex-col gap-5 text-left select-none">
      <div>
        <h3 className="font-geist text-xs tracking-wider text-on-surface-variant uppercase font-semibold mb-1">
          Telemetry Analytics
        </h3>
        <p className="text-[11px] text-on-surface-variant/70 leading-relaxed font-sans">
          Resonance alignment index tracks laser synchronization with the crystalline grid over time.
        </p>
      </div>

      {/* SVG Neon Area Graph */}
      <div className="relative bg-surface-container-low/40 p-3 rounded-xl border border-white/5 flex flex-col justify-center items-center">
        <div className="absolute top-2 right-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full animate-pulse-cyan"></span>
          <span className="font-mono text-[9px] text-primary-fixed-dim">LIVE CAPTURE</span>
        </div>
        
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00dbe9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00dbe9" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.04)" strokeDasharray="2,2" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.04)" strokeDasharray="2,2" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />

          {/* Area Fill */}
          <polygon points={areaPoints} fill="url(#chartGlow)" />

          {/* Line Path */}
          <polyline
            fill="none"
            stroke="#00dbe9"
            strokeWidth="2.0"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots on points */}
          {dataPoints.map((val, idx) => {
            const x = padding + (idx * (width - padding * 2)) / (dataPoints.length - 1);
            const y = height - padding - (val / maxValue) * (height - padding * 2);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="2.5"
                fill="#ffffff"
                stroke="#00dbe9"
                strokeWidth="1.5"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        <div className="flex justify-between w-full font-mono text-[9px] text-on-surface-variant/50 mt-1 px-1">
          <span>-60s</span>
          <span>-30s</span>
          <span>0s (NOW)</span>
        </div>
      </div>

      {/* Grid of micro indicators */}
      <h4 className="font-geist text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold border-b border-white/5 pb-1">
        Flux Decoupler Coefficients
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-low/20 p-2.5 rounded-lg border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] text-on-surface-variant/70 font-medium">Harmonic Core Load</span>
          <span className="font-mono text-xs text-primary text-semibold">
            {dataPoints[dataPoints.length - 1].toFixed(1)}% MW
          </span>
        </div>
        <div className="bg-surface-container-low/20 p-2.5 rounded-lg border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] text-on-surface-variant/70 font-medium">Coherence Threshold</span>
          <span className="font-mono text-xs text-primary text-semibold">94.92% optimal</span>
        </div>
        <div className="bg-surface-container-low/20 p-2.5 rounded-lg border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] text-on-surface-variant/70 font-medium">Radiance Factor</span>
          <span className="font-mono text-xs text-primary text-semibold">1.24x beta</span>
        </div>
        <div className="bg-surface-container-low/20 p-2.5 rounded-lg border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] text-on-surface-variant/70 font-medium">Coolant Viscosity</span>
          <span className="font-mono text-xs text-primary text-semibold">4.02 mPa·s</span>
        </div>
      </div>
    </div>
  );
};
