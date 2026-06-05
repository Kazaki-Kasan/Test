import React, { useState } from 'react';

interface ShieldDashboardProps {
  onAddLog: (text: string, type: 'info' | 'warning' | 'success' | 'critical') => void;
}

export const ShieldDashboard: React.FC<ShieldDashboardProps> = ({ onAddLog }) => {
  const [shieldPower, setShieldPower] = useState(74);
  const [coolingActive, setCoolingActive] = useState(true);
  const [beamOffsetX, setBeamOffsetX] = useState(0.04);
  const [beamOffsetY, setBeamOffsetY] = useState(-0.12);

  const toggleCooling = () => {
    const nextState = !coolingActive;
    setCoolingActive(nextState);
    if (nextState) {
      onAddLog('Emergency Cryo coolant venting activated. Core cooling cycle initiated.', 'success');
    } else {
      onAddLog('Coolant circulation: PAUSED. Monitor thermal thresholds!', 'warning');
    }
  };

  const handleBeamCalibrate = () => {
    setBeamOffsetX(0.00);
    setBeamOffsetY(0.00);
    onAddLog('Aligning uplink beam arrays... Magnetosphere compensation calculations engaged.', 'info');
    setTimeout(() => {
      onAddLog('Uplink synchronized. Beam alignment X:0.0 Y:0.0 [STABLE]', 'success');
    }, 800);
  };

  return (
    <div className="glass-panel p-6 rounded-xl flex flex-col gap-6 text-left select-none">
      <div>
        <h3 className="font-geist text-xs tracking-wider text-on-surface-variant uppercase font-semibold mb-1">
          Uplink & Grid Shield
        </h3>
        <p className="text-[11px] text-on-surface-variant/70 leading-relaxed font-sans">
          Orbital transmitter links and particulate shield grids prevent interference and contain thermal emissions.
        </p>
      </div>

      <div className="space-y-5">
        {/* Shield Power Level */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant flex items-center gap-1.5 font-sans font-medium">
              Magnetic containment grid
            </span>
            <span className="font-mono text-primary-fixed-dim font-semibold">{shieldPower}% PWR</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex p-[1px] border border-white/5">
            <div
              className="h-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-300"
              style={{ width: `${shieldPower}%` }}
            />
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={shieldPower}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setShieldPower(val);
              if (val < 50) {
                onAddLog(`WARNING: Containment grid below safety thresholds! CURRENT: ${val}%`, 'warning');
              } else {
                onAddLog(`Containment magnets recalibrated to ${val}% output`, 'info');
              }
            }}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-container"
          />
        </div>

        {/* Ambient Heat & Cooling State */}
        <div className="border-t border-white/5 pt-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-on-surface">Emergency Thermal Cryo-Pump</span>
            <span className="text-[10px] text-on-surface-variant/70">
              Cabinet Temperature: <span className="text-emerald-400 font-mono font-medium">42.2°C</span>
            </span>
          </div>
          <button
            onClick={toggleCooling}
            className={`font-geist text-[10px] px-3.5 py-1.5 rounded-full font-bold cursor-pointer transition-all duration-200 active:scale-95 text-center ${
              coolingActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 active-glow'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {coolingActive ? 'RUNNING' : 'SUSPENDED'}
          </button>
        </div>

        {/* Satellite Aligners */}
        <div className="border-t border-white/5 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-on-surface">Transmitter Alignment Offsets</span>
            <button
              onClick={handleBeamCalibrate}
              className="font-geist text-[9px] text-primary-fixed-dim hover:underline cursor-pointer uppercase tracking-wider"
            >
              Recenter Arrays
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Beam Offset X */}
            <div className="flex flex-col gap-1.5 bg-surface-container-low/20 p-3 rounded-lg border border-white/5">
              <span className="text-[10px] text-on-surface-variant/70 font-mono">Offset X</span>
              <span className="text-xs text-primary font-mono">{beamOffsetX.toFixed(2)} deg</span>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={beamOffsetX}
                onChange={(e) => setBeamOffsetX(parseFloat(e.target.value))}
                className="w-full accent-primary-container h-1 appearance-none bg-white/15 rounded"
              />
            </div>

            {/* Beam Offset Y */}
            <div className="flex flex-col gap-1.5 bg-surface-container-low/20 p-3 rounded-lg border border-white/5">
              <span className="text-[10px] text-on-surface-variant/70 font-mono">Offset Y</span>
              <span className="text-xs text-primary font-mono">{beamOffsetY.toFixed(2)} deg</span>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={beamOffsetY}
                onChange={(e) => setBeamOffsetY(parseFloat(e.target.value))}
                className="w-full accent-primary-container h-1 appearance-none bg-white/15 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
