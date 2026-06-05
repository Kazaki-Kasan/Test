import React from 'react';

interface SpatialDashboardProps {
  rotationSpeed: number;
  onSpeedChange: (speed: number) => void;
  particleDensity: number;
  onDensityChange: (density: number) => void;
  spatialGridVisible: boolean;
  onToggleGrid: () => void;
  onAddLog: (text: string, type: 'info' | 'warning' | 'success' | 'critical') => void;
}

export const SpatialDashboard: React.FC<SpatialDashboardProps> = ({
  rotationSpeed,
  onSpeedChange,
  particleDensity,
  onDensityChange,
  spatialGridVisible,
  onToggleGrid,
  onAddLog,
}) => {
  const triggerMatrixRecalibrate = () => {
    onSpeedChange(0.015);
    onDensityChange(60);
    onAddLog('Initiating Spatial Matrix Re-polarization...', 'info');
    setTimeout(() => {
      onAddLog('Symmetric space distortion cleared. Matrix active.', 'success');
    }, 600);
  };

  return (
    <div className="glass-panel p-6 rounded-xl flex flex-col gap-6 text-left select-none">
      <div>
        <h3 className="font-geist text-xs tracking-wider text-on-surface-variant uppercase font-semibold mb-1">
          Dimensional Metrics
        </h3>
        <p className="text-[11px] text-on-surface-variant/70 leading-relaxed font-sans">
          Spatial telemetry tracks spatial distortion fields and coordinates around the active crystal structure.
        </p>
      </div>

      <div className="space-y-5">
        {/* Rotation Speed Constraint */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant flex items-center gap-1.5 font-sans font-medium">
              <span className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full"></span>
              Rotational Momentum
            </span>
            <span className="font-mono text-primary-fixed-dim font-semibold">
              {(rotationSpeed * 1000).toFixed(0)} rad/s
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.05"
            step="0.001"
            value={rotationSpeed}
            onChange={(e) => {
              const speed = parseFloat(e.target.value);
              onSpeedChange(speed);
              onAddLog(`Rotational speed set to ${speed.toFixed(3)} rad/s`, 'info');
            }}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-container"
          />
        </div>

        {/* Particle Cloud Density */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant flex items-center gap-1.5 font-sans font-medium">
              <span className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full"></span>
              Quantum Node Density
            </span>
            <span className="font-mono text-primary-fixed-dim font-semibold">
              {particleDensity} Nodes
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={particleDensity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onDensityChange(val);
              onAddLog(`Quantum particle density calibrated to ${val} nodes`, 'info');
            }}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-container"
          />
        </div>

        {/* Grid Visibility Toggle */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface font-semibold">Coordinate Mapping Grid</span>
            <span className="text-[10px] text-on-surface-variant/70">Toggle 3D Floor Reference</span>
          </div>
          <button
            onClick={() => {
              onToggleGrid();
              onAddLog(`Operational floor references ${!spatialGridVisible ? 'enabled' : 'disabled'}`, 'info');
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              spatialGridVisible ? 'bg-primary-container' : 'bg-white/10'
            }`}
          >
            <div
              className={`bg-surface-dim w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                spatialGridVisible ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Telemetry Status Vector */}
        <div className="bg-surface-container-low/40 p-4 rounded-xl border border-white/5 space-y-3">
          <p className="font-geist text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Spatial Warp Vector
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="flex justify-between border-r border-white/5 pr-2">
              <span className="text-on-surface-variant/70">Yaw Alpha:</span>
              <span className="text-primary-fixed-dim">0.824 rad</span>
            </div>
            <div className="flex justify-between pl-1">
              <span className="text-on-surface-variant/70">Warp Coefficient:</span>
              <span className="text-emerald-400">1.0004</span>
            </div>
            <div className="flex justify-between border-r border-white/5 pr-2">
              <span className="text-on-surface-variant/70">Pitch Beta:</span>
              <span className="text-primary-fixed-dim">-0.119 rad</span>
            </div>
            <div className="flex justify-between pl-1">
              <span className="text-on-surface-variant/70">Entropy Threshold:</span>
              <span className="text-primary-fixed-dim">0.054 eV</span>
            </div>
          </div>
        </div>

        {/* Matrix Command Button */}
        <button
          onClick={triggerMatrixRecalibrate}
          className="w-full bg-surface-container-high hover:bg-surface-container-highest border border-white/10 text-primary-fixed-dim text-[11px] font-geist py-2.5 rounded-lg font-bold tracking-widest cursor-pointer transition-all active:scale-[0.98] uppercase text-center"
        >
          Align Spatial Coordinates
        </button>
      </div>
    </div>
  );
};
