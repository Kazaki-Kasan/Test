/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Power, ChevronsUp, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { SystemNode, NodeStatus } from '../types';

interface NodesViewProps {
  nodes: SystemNode[];
  onUpdateNode: (index: number, updatedFields: Partial<SystemNode>) => void;
  onCalibrateNode: (index: number) => void;
}

export default function NodesView({
  nodes,
  onUpdateNode,
  onCalibrateNode,
}: NodesViewProps) {
  // Determine color matching status badges
  const getStatusBadge = (status: NodeStatus) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            ONLINE
          </span>
        );
      case 'STANDBY':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-950/40 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            STANDBY
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/60 text-slate-400 border border-white/5 text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
            OFFLINE
          </span>
        );
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-auto p-4 overflow-y-auto pt-20 pb-28 select-none">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
        
        {/* Title Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Activity className="w-5 h-5" />
            <h2 className="font-sans font-extrabold text-xl tracking-tight uppercase">
              System Node Network
            </h2>
          </div>
          <p className="font-sans text-xs text-cyan-200/50">
            Monitor and calibrate individual components of the Nexus array. Overclocking raises frequency but generates thermal overhead.
          </p>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.map((node, idx) => {
            const isOnline = node.status === 'ONLINE';
            const isStandby = node.status === 'STANDBY';
            const isOffline = node.status === 'OFFLINE';

            // High thermal warnings
            const isOverheating = node.heat > 80;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`glass-panel p-4 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                  isOffline
                    ? 'opacity-65 border-white/5 bg-slate-950/20'
                    : isOverheating
                    ? 'border-rose-500/30 shadow-lg shadow-rose-950/20 bg-rose-950/5'
                    : 'border-cyan-500/10 hover:border-cyan-500/20 bg-slate-900/10'
                }`}
              >
                {/* Visual grid accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isOffline ? 'bg-slate-700/10' : isOverheating ? 'bg-rose-500/40' : 'bg-cyan-500/20'
                }`} />

                {/* Node Header Row */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-cyan-400/40 tracking-wider">
                      MODULE ID: {node.id}
                    </span>
                    <h3 className="font-sans font-bold text-sm text-slate-100">
                      {node.name}
                    </h3>
                  </div>
                  {getStatusBadge(node.status)}
                </div>

                {/* Micro descriptive line */}
                <p className="font-sans text-[11px] text-cyan-200/40 mb-4 line-clamp-1">
                  {node.description}
                </p>

                {/* Core Metric readouts */}
                <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-slate-400 uppercase">Frequency</span>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {isOffline ? '0.00' : node.frequency.toFixed(2)} GHz
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-slate-400 uppercase">Load</span>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {isOffline ? '0%' : `${node.load}%`}
                    </span>
                  </div>
                  <div className="flex flex-col animate-pulse">
                    <span className="font-mono text-[9px] text-slate-400 uppercase">Thermal</span>
                    <span className={`font-mono text-xs font-bold ${isOverheating ? 'text-rose-400' : 'text-cyan-300'}`}>
                      {node.heat}°C
                    </span>
                  </div>
                </div>

                {/* Dynamic sliders if ONLINE */}
                {isOnline && (
                  <div className="flex flex-col gap-3.5 mb-4 p-1">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between font-mono text-[9px] text-cyan-200/50">
                        <span>LOAD MODULATOR (OVERCLOCK)</span>
                        <span className="text-cyan-400 font-bold">{node.load}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="120"
                        value={node.load}
                        onChange={(e) => {
                          const newLoad = parseInt(e.target.value, 10);
                          // Thermals scale non-linearly with load
                          const multiplier = newLoad > 100 ? 1.4 : 0.8;
                          const newHeat = Math.min(100, Math.floor(35 + (newLoad * 0.45) * multiplier));
                          const newFreq = parseFloat((1.2 + (newLoad * 0.024)).toFixed(2));
                          onUpdateNode(idx, {
                            load: newLoad,
                            heat: newHeat,
                            frequency: newFreq,
                          });
                        }}
                        className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Node Actions Row */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                  <div className="flex gap-1.5 mr-auto">
                    {/* Status Power Toggles */}
                    <button
                      onClick={() => {
                        const states: NodeStatus[] = ['ONLINE', 'STANDBY', 'OFFLINE'];
                        const nextIndex = (states.indexOf(node.status) + 1) % states.length;
                        const nextStatus = states[nextIndex];
                        let load = 0;
                        let heat = 20;
                        let frequency = 0;

                        if (nextStatus === 'ONLINE') {
                          load = 65;
                          heat = 52;
                          frequency = 2.8;
                        } else if (nextStatus === 'STANDBY') {
                          load = 5;
                          heat = 28;
                          frequency = 0.4;
                        }
                        onUpdateNode(idx, { status: nextStatus, load, heat, frequency });
                      }}
                      title="Cycle Power State"
                      className="p-1 px-2.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10 cursor-pointer text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Power className="w-3 h-3" />
                      CYCLE
                    </button>
                  </div>

                  {/* Manual trigger individual Calibration */}
                  <button
                    disabled={isOffline}
                    onClick={() => onCalibrateNode(idx)}
                    className={`p-1 px-3 rounded flex items-center gap-1 text-[10px] font-mono font-bold uppercase cursor-pointer transition-colors ${
                      isOffline
                        ? 'opacity-40 text-slate-500 bg-slate-900 border border-white/5 cursor-not-allowed'
                        : isOverheating
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                        : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 border border-cyan-400'
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    CAL
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
