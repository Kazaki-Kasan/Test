/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Compass, Cpu, Activity, Menu, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemNode, DiagnosticLog, CoreTelemetry, LogLevel } from './types';
import CoreThreeVisualizer from './components/CoreThreeVisualizer';
import ExploreView from './components/ExploreView';
import NodesView from './components/NodesView';
import InsightsView from './components/InsightsView';

// Preset mock logs to initialize the console terminal with professional look
const INITIAL_LOGS: DiagnosticLog[] = [
  { id: '1', timestamp: '16:50:31', level: 'SUCCESS', message: 'Nexus Quantum Core online. Local host synchronization locking.' },
  { id: '2', timestamp: '16:51:12', level: 'INFO', message: 'Establishing magnetic containment shield... Field secured @ 92% force.' },
  { id: '3', timestamp: '16:51:40', level: 'INFO', message: 'Co-orbital sub-nodes pinging successfully.' },
  { id: '4', timestamp: '16:53:02', level: 'SUCCESS', message: 'Energy levels nominal. Power grids linked in balanced resonance.' },
];

export default function App() {
  // Main Navigation Tracker
  const [activeTab, setActiveTab] = useState<'explore' | 'nodes' | 'insights'>('explore');

  // Core Telemetry State
  const [telemetry, setTelemetry] = useState<CoreTelemetry>({
    latency: 0.042,
    energyLevel: 84,
    containmentStrength: 92,
    particleDensity: 75,
    coreFrequency: 2.8,
    systemStatus: 'OPTIMAL',
  });

  const [isRecalibrating, setIsRecalibrating] = useState<boolean>(false);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([
    0.041, 0.045, 0.042, 0.039, 0.043, 0.042, 0.046, 0.041, 0.044, 0.042, 0.040, 0.043, 0.042, 0.042, 0.042
  ]);

  // Terminal Logs State
  const [logs, setLogs] = useState<DiagnosticLog[]>(INITIAL_LOGS);

  // Sub-nodes Diagnostics State
  const [nodes, setNodes] = useState<SystemNode[]>([
    {
      id: 'NX-01',
      name: 'Core Fusion Reactor',
      description: 'Primary high-energy helium-3 extraction and thermal generator.',
      status: 'ONLINE',
      heat: 52,
      frequency: 2.8,
      load: 65,
    },
    {
      id: 'NX-02',
      name: 'Quantum Superposition Transceiver',
      description: 'Main communication array linking multi-dimensional data folds.',
      status: 'ONLINE',
      heat: 46,
      frequency: 2.5,
      load: 55,
    },
    {
      id: 'NX-03',
      name: 'Neural Array Matrix',
      description: 'Deep synaptic thinking compute cluster managing auto-conduits.',
      status: 'ONLINE',
      heat: 41,
      frequency: 2.2,
      load: 50,
    },
    {
      id: 'NX-04',
      name: 'Cryogenic Thermal Sink',
      description: 'Sub-zero liquid coolant dispenser stabilizing reaction thermals.',
      status: 'ONLINE',
      heat: 35,
      frequency: 2.1,
      load: 45,
    },
    {
      id: 'NX-05',
      name: 'Magnetic Containment Conduit',
      description: 'Electromagnetic coil framework housing the crystal singularity.',
      status: 'ONLINE',
      heat: 48,
      frequency: 2.6,
      load: 60,
    },
  ]);

  // Help state to append a log cleanly
  const addLog = (level: LogLevel, message: string) => {
    const now = new Date();
    const ts = now.toTimeString().split(' ')[0] || '16:55:00';
    const newLog: DiagnosticLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: ts,
      level,
      message,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Recalibrate system handler
  const handleRecalibrate = () => {
    if (isRecalibrating) return;
    setIsRecalibrating(true);
    setTelemetry((prev) => ({
      ...prev,
      systemStatus: 'RECALIBRATING',
    }));

    addLog('INFO', 'Calibrating: Dispatching sub-sector frequency alignment pulses...');
    addLog('INFO', 'Syncing: Purging containment micro-charge fluctuations for grid resync...');

    // Phase 1 (1000ms): Overclock spin speed, dump load to stabilize
    setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        coreFrequency: 4.8, // Speed up visual rotation
        energyLevel: 62,    // Draw focus energy
      }));
      addLog('WARNING', 'Frequency levels peak warning: core elements running at 4.80 GHz during resonance.');
    }, 1000);

    // Phase 2 (2500ms): Cool down system nodes, engage magnetic coils
    setTimeout(() => {
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.status === 'ONLINE' ? { ...n, heat: Math.max(30, n.heat - 12), load: 50 } : n
        )
      );
      setTelemetry((prev) => ({
        ...prev,
        containmentStrength: 100, // Magnetic strength locked
      }));
      addLog('INFO', 'Sub-node thermal peaks cooled. Magnetic containment coils locked @ 100%.');
    }, 2500);

    // Phase 3 (3500ms): Restore nominal, drop latency to sub-operational limits
    setTimeout(() => {
      setIsRecalibrating(false);
      setTelemetry((prev) => ({
        ...prev,
        latency: 0.0055,
        energyLevel: 84,
        coreFrequency: 2.8,
        systemStatus: 'OPTIMAL',
      }));
      setLatencyHistory((prev) => [...prev.slice(1), 0.0055]);
      addLog('SUCCESS', 'Core recalibration complete. Operational resonance established. System: OPTIMAL.');
    }, 3500);
  };

  // Chaos Module Injection (For fun developer interactive loop!)
  const handleInjectChaos = () => {
    setTelemetry((prev) => ({
      ...prev,
      systemStatus: 'WARNING',
      containmentStrength: 45,
      latency: 0.118,
    }));
    addLog('CRITICAL', 'ALARM: Gravitational shear anomaly detected in containment ring 4C!');
    addLog('WARNING', 'Containment field strength dropped below safe parameters: 45%!');
    addLog('WARNING', 'Operational latency elevated. Recommended action: Execute System Recalibration on Home screen.');
    
    // Animate latency history spike
    setLatencyHistory((prev) => [...prev.slice(2), 0.098, 0.118]);
  };

  // Update specific node details
  const handleUpdateNode = (index: number, updatedFields: Partial<SystemNode>) => {
    setNodes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index]!, ...updatedFields };
      return copy;
    });

    // Logging the modification
    if (updatedFields.status) {
      addLog('INFO', `Component ${nodes[index]?.name} state altered to: ${updatedFields.status}.`);
    } else if (updatedFields.load) {
      addLog('INFO', `Adjusted target payload on ${nodes[index]?.name} to ${updatedFields.load}%.`);
    }
  };

  // Calibrate individual node
  const handleCalibrateNode = (index: number) => {
    const node = nodes[index];
    if (!node) return;

    handleUpdateNode(index, {
      heat: 40,
      frequency: 2.4,
      load: 55,
    });
    addLog('SUCCESS', `Manual thermal cooldown & alignment cycle complete on [${node.id}] ${node.name}.`);
  };

  // Global Recurring Oscillations and system behavior ticker
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Calculate active real-time latency jitter based on variables
      setTelemetry((prev) => {
        if (isRecalibrating) return prev; // handled in timeline

        // More jitter if containment strength is low
        const decayFactor = (100 - prev.containmentStrength) / 100;
        const randomFluct = (Math.random() - 0.5) * 0.007 * (1 + decayFactor * 12);
        
        // Base target latency relies on overall node health status
        const offlineCount = nodes.filter((n) => n.status === 'OFFLINE').length;
        const baseTarget = 0.025 + (offlineCount * 0.015);
        const finalLatency = Math.max(0.003, prev.latency + randomFluct * 0.4 + (baseTarget - prev.latency) * 0.15);

        // Update historical trace
        setLatencyHistory((history) => [...history.slice(1), finalLatency]);

        return {
          ...prev,
          latency: finalLatency,
        };
      });

      // 2. Adjust node heat outputs slowly depending on active loads
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.status === 'OFFLINE') {
            return n.heat > 20 ? { ...n, heat: Math.max(20, n.heat - 1.5) } : n;
          }
          if (n.status === 'STANDBY') {
            return n.heat > 25 ? { ...n, heat: Math.max(25, n.heat - 1.0) } : n;
          }
          // Online node: stabilizes temperature towards heat value proportional to its load
          const targetHeat = Math.min(100, Math.floor(30 + n.load * 0.5));
          if (n.heat < targetHeat) {
            return { ...n, heat: Math.min(100, n.heat + 1) };
          } else if (n.heat > targetHeat) {
            return { ...n, heat: Math.max(20, n.heat - 1) };
          }
          return n;
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isRecalibrating, nodes]);

  // Periodic visual ping / casual terminal sweeps
  useEffect(() => {
    const messages = [
      'Diagnostic sync NOMINAL. Security logs clear.',
      'Active gravitational enclosure parameters within safe coefficients.',
      'Power transmission routing fully stabilized across grid feeds.',
      'Sync status: Particle coherence levels locked.',
    ];

    const logTicker = setInterval(() => {
      if (isRecalibrating) return;
      const index = Math.floor(Math.random() * messages.length);
      const msg = messages[index];
      if (msg) {
        addLog('INFO', msg);
      }
    }, 18000); // Casual log update every 18 seconds to preserve terminal neatness

    return () => clearInterval(logTicker);
  }, [isRecalibrating]);

  return (
    <div className="relative w-full h-full bg-[#051424] overflow-hidden select-none select-none">
      
      {/* Absolute Backdrop Three.js Canvas */}
      <CoreThreeVisualizer
        coreFrequency={telemetry.coreFrequency}
        particleDensity={telemetry.particleDensity}
        isRecalibrating={isRecalibrating}
      />

      {/* Top Header Overlay */}
      <header className="fixed top-0 left-0 w-full bg-[#051424]/60 backdrop-blur-xl text-cyan-300 border-b border-white/10 shadow-[0_4px_30px_rgba(0,219,233,0.06)] flex justify-between items-center px-6 h-16 z-50">
        <div className="flex items-center gap-3 cursor-pointer p-1 rounded-md transition hover:bg-white/5 active:scale-95">
          <Menu className="w-5 h-5 text-cyan-400" />
        </div>
        
        <h1 className="font-sans font-extrabold tracking-widest text-[#7df4ff] text-lg select-none">
          NEXUS CORE
        </h1>

        <div className="flex items-center gap-3 cursor-pointer p-1 rounded-md transition hover:bg-white/5 active:scale-95">
          <UserCircle className="w-6 h-6 text-cyan-400" />
        </div>
      </header>

      {/* Interactive Main Viewport Router */}
      <main className="w-full h-full relative z-10 pt-16 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pt-16"
            >
              <ExploreView
                telemetry={telemetry}
                isRecalibrating={isRecalibrating}
                onRecalibrate={handleRecalibrate}
              />
            </motion.div>
          )}

          {activeTab === 'nodes' && (
            <motion.div
              key="nodes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pt-16"
            >
              <NodesView
                nodes={nodes}
                onUpdateNode={handleUpdateNode}
                onCalibrateNode={handleCalibrateNode}
              />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pt-16"
            >
              <InsightsView
                telemetry={telemetry}
                onUpdateTelemetry={(updated) => setTelemetry((prev) => ({ ...prev, ...updated }))}
                logs={logs}
                onAddLog={addLog}
                onClearLogs={() => setLogs([])}
                latencyHistory={latencyHistory}
                onInjectChaos={handleInjectChaos}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Floating Navigation Dock */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0d1c2d]/65 backdrop-blur-2xl flex justify-around items-center px-4 pb-6 pt-3.5 border-t border-white/10 shadow-[0_-5px_25px_rgba(0,0,0,0.45)] rounded-t-3xl">
        {/* Tab 1: Explore viewport */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center p-3 rounded-full cursor-pointer transition-all duration-300 relative ${
            activeTab === 'explore'
              ? 'bg-gradient-to-r from-cyan-950/55 to-cyan-900/55 text-cyan-300 shadow-[0_0_15px_rgba(0,219,233,0.3)] border border-cyan-400/30 active-glow'
              : 'text-slate-400 hover:bg-white/5 active:scale-90 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5.5 h-5.5" />
          {activeTab === 'explore' && (
            <motion.span
              layoutId="nav-dot"
              className="absolute -bottom-1 w-1.2 h-1.2 bg-cyan-400 rounded-full"
            />
          )}
        </button>

        {/* Tab 2: System Nodes Map */}
        <button
          onClick={() => setActiveTab('nodes')}
          className={`flex flex-col items-center justify-center p-3 rounded-full cursor-pointer transition-all duration-300 relative ${
            activeTab === 'nodes'
              ? 'bg-gradient-to-r from-cyan-950/55 to-cyan-900/55 text-cyan-300 shadow-[0_0_15px_rgba(0,219,233,0.3)] border border-cyan-400/30 active-glow'
              : 'text-slate-400 hover:bg-white/5 active:scale-90 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-5.5 h-5.5" />
          {activeTab === 'nodes' && (
            <motion.span
              layoutId="nav-dot"
              className="absolute -bottom-1 w-1.2 h-1.2 bg-cyan-400 rounded-full"
            />
          )}
        </button>

        {/* Tab 3: Insights console */}
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center justify-center p-3 rounded-full cursor-pointer transition-all duration-300 relative ${
            activeTab === 'insights'
              ? 'bg-gradient-to-r from-cyan-950/55 to-cyan-900/55 text-cyan-300 shadow-[0_0_15px_rgba(0,219,233,0.3)] border border-cyan-400/30 active-glow'
              : 'text-slate-400 hover:bg-white/5 active:scale-90 hover:text-slate-200'
          }`}
        >
          <Activity className="w-5.5 h-5.5" />
          {activeTab === 'insights' && (
            <motion.span
              layoutId="nav-dot"
              className="absolute -bottom-1 w-1.2 h-1.2 bg-cyan-400 rounded-full"
            />
          )}
        </button>
      </nav>
    </div>
  );
}
