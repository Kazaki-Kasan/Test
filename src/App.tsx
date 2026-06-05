import { useState, useEffect } from 'react';
import {
  Compass,
  Box,
  LineChart,
  Shield,
  Menu,
  Settings,
  Zap,
  Clock,
  Wifi,
  RefreshCw,
  Sliders,
  Database,
  Activity,
  User,
  Info,
  X,
  Radio,
  Lock,
  Unlock,
} from 'lucide-react';
import { ThreeCore } from './components/ThreeCore';
import { ConsoleLogs } from './components/ConsoleLogs';
import { SpatialDashboard } from './components/SpatialDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ShieldDashboard } from './components/ShieldDashboard';
import { LogMessage, Protocol, Subsystem } from './types';

// Protocol presets
const PROTOCOLS: Protocol[] = [
  {
    id: 'synthetic-horizon',
    name: 'Synthetic Horizon',
    code: 'X-01',
    color: '#00dbe9',
    textColor: 'text-cyan-400',
    latencyBase: 0.042,
    energyLevel: 84.2,
    stability: 'OPTIMAL',
    atmosphere: 98.4,
    radiation: 0.02,
    description: 'Quantum synchronization field tuned to standard atmospheric telemetry.',
  },
  {
    id: 'chronos-pulse',
    name: 'Chronos Pulse',
    code: 'C-02',
    color: '#f59e0b',
    textColor: 'text-amber-400',
    latencyBase: 0.021,
    energyLevel: 92.6,
    stability: 'STABLE',
    atmosphere: 94.1,
    radiation: 0.04,
    description: 'High-frequency cyclic flow designed to accelerate transaction throughput.',
  },
  {
    id: 'eclipse-flow',
    name: 'Eclipse Flow',
    code: 'E-03',
    color: '#a78bfa',
    textColor: 'text-purple-400',
    latencyBase: 0.095,
    energyLevel: 65.8,
    stability: 'CYCLIC',
    atmosphere: 99.1,
    radiation: 0.01,
    description: 'Damped sub-resonance containment grid configured for shielding containment.',
  },
  {
    id: 'calamity-charge',
    name: 'Apex Calamity',
    code: 'A-04',
    color: '#f43f5e',
    textColor: 'text-rose-400',
    latencyBase: 0.142,
    energyLevel: 98.9,
    stability: 'CRITICAL',
    atmosphere: 82.5,
    radiation: 0.48,
    description: 'Hyper-excited raw power discharge cycle. Extreme thermal caution advised.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'spatial' | 'analytics' | 'shield'>('explore');
  const [activeProtocol, setActiveProtocol] = useState<Protocol>(PROTOCOLS[0]);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  
  // Real-time fluctuating metrics
  const [liveLatency, setLiveLatency] = useState(0.042);
  const [liveEnergy, setLiveEnergy] = useState(84.2);
  const [clockTime, setClockTime] = useState('00:00:00');
  const [dischargeTrigger, setDischargeTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Core spatial configurations for live adjustments
  const [rotationSpeed, setRotationSpeed] = useState(0.004);
  const [particleDensity, setParticleDensity] = useState(60);
  const [spatialGridVisible, setSpatialGridVisible] = useState(true);

  // Console operational log messages
  const [logs, setLogs] = useState<LogMessage[]>([
    { id: '1', timestamp: '18:03:00', text: 'NEXUS COMMAND INITIALIZED. UPLINK CONNECTED.', type: 'info' },
    { id: '2', timestamp: '18:03:12', text: 'CORE COHERENCE CHECK: SYNCHRONIZED', type: 'success' },
    { id: '3', timestamp: '18:03:25', text: 'FIELD MODULATOR VECTOR STABILIZED', type: 'info' },
  ]);

  // Subsystems array
  const [subsystems, setSubsystems] = useState<Subsystem[]>([
    { id: 'laser', name: 'Laser Exciter', status: 'OPTIMAL', level: 94 },
    { id: 'cryo', name: 'Coolant Flow', status: 'STABLE', level: 86 },
    { id: 'beam', name: 'Uplink Waveguide', status: 'OPTIMAL', level: 98 },
  ]);

  // Live timer for Clock Synchronization
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setClockTime(`${hrs}:${mins}:${secs}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuating metric simulator
  useEffect(() => {
    const interval = setInterval(() => {
      // Random walk around active protocol values
      setLiveLatency((prev) => {
        const factor = (Math.random() - 0.5) * 0.004;
        const target = activeProtocol.latencyBase + factor;
        return parseFloat(Math.max(0.005, target).toFixed(3));
      });

      setLiveEnergy((prev) => {
        const factor = (Math.random() - 0.5) * 0.15;
        const target = activeProtocol.energyLevel + factor;
        return parseFloat(Math.min(100, Math.max(10, target)).toFixed(1));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeProtocol]);

  const addLog = (text: string, type: 'info' | 'warning' | 'success' | 'critical') => {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: LogMessage = {
      id: Math.random().toString(),
      timestamp,
      text,
      type,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleRecalibrate = () => {
    setDischargeTrigger((prev) => prev + 1);
    
    // Log calibration stream
    addLog(`Initiating recalibration of [${activeProtocol.name} (${activeProtocol.code})]`, 'info');
    
    // Temporarily trigger energy burst
    setLiveEnergy(100);
    addLog(`EMERGENCY POWER SHUNT: 100% DISCHARGE REGISTERED`, 'critical');

    setTimeout(() => {
      setLiveEnergy(activeProtocol.energyLevel);
      addLog(`Resonator magnetic containment aligned successfully [Latency: ${activeProtocol.latencyBase} ms]`, 'success');
    }, 1000);
  };

  const handleProtocolSelect = (proto: Protocol) => {
    setActiveProtocol(proto);
    setLiveEnergy(proto.energyLevel);
    setLiveLatency(proto.latencyBase);
    addLog(`Switching core configuration vector to [${proto.name} - ${proto.code}]`, 'warning');
    addLog(`Adjusting thermal magnetic shield for ${proto.stability} stability`, 'info');
  };

  return (
    <div className="relative min-h-screen w-full bg-surface-dim text-on-surface font-sans overflow-hidden">
      {/* Decorative Cyber Grid Background and Scanline Overlay */}
      <div className="scanline" id="cyber-scanline"></div>

      {/* THREE.JS VIEWPORT CANVAS (Sits as complete background layer) */}
      <div className="absolute inset-0 z-0 bg-[#051424]">
        <ThreeCore
          color={activeProtocol.color}
          onRotationUpdate={(x, y, z) => setRotation({ x, y, z })}
          dischargeTrigger={dischargeTrigger}
          onCoreInteracted={() => {
            // Randomly trigger light log event on tap
            addLog(`Core field fluctuation: pulse discharge registered at X:${rotation.x.toFixed(2)} Y:${rotation.y.toFixed(2)}`, 'success');
          }}
        />
      </div>

      {/* TOP HEADER COMMAND STRIP */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-4 md:px-8 z-40 select-none">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-white/5 active:scale-95 rounded-lg transition-transform text-white/80 cursor-pointer md:block"
            title="Toggle Systems Drawer"
          >
            <Menu className="w-5 h-5 text-primary-fixed-dim" />
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-lg md:text-xl font-extrabold text-primary-fixed-dim uppercase tracking-tighter italic">
              Nexus Core
            </h1>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            
            {/* Live Synchronized Dot Badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-highest/50 rounded-full border border-white/5 scale-90 md:scale-100">
              <div className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse-cyan"></div>
              <span className="font-geist text-[10px] text-primary-fixed-dim uppercase tracking-widest font-semibold">
                Core Synchronized
              </span>
            </div>
          </div>
        </div>

        {/* Real-time sync clocks */}
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="font-geist text-[10px] text-on-surface-variant uppercase tracking-wider">
              Local Chrono
            </p>
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="w-3.5 h-3.5 text-primary-fixed-dim" />
              <p className="font-mono text-xs text-primary-fixed-dim font-bold tracking-wider">
                {clockTime}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-geist text-[10px] text-on-surface-variant uppercase tracking-wider">
              Uplink Channel
            </p>
            <p className="font-mono text-xs text-emerald-400 font-bold tracking-wide flex items-center gap-1 justify-end">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              STABLE
            </p>
          </div>
        </div>
      </header>

      {/* LEFT NAVIGATION SIDEBAR (Floating Desktop Rail) */}
      <aside className="fixed top-0 left-0 h-full w-20 bg-[#051424]/40 backdrop-blur-2xl border-r border-white/5 z-40 flex flex-col items-center py-6 gap-8 select-none pt-24 hidden md:flex">
        {/* Main Operational Hub icon */}
        <div className="w-11 h-11 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary-fixed-dim border border-primary-fixed-dim/20 mb-4 shadow-[0_0_12px_rgba(0,219,233,0.15)]">
          <Database className="w-5 h-5 text-primary-fixed-dim animate-pulse" />
        </div>

        {/* Navigation Actions */}
        <nav className="flex flex-col gap-5">
          <button
            onClick={() => setActiveTab('explore')}
            className={`w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 relative group ${
              activeTab === 'explore'
                ? 'bg-primary-container/20 text-primary-fixed-dim border border-primary-fixed-dim/30 shadow-[0_0_15px_rgba(0,219,233,0.25)]'
                : 'text-on-surface-variant hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Explorer (Operational Center)"
          >
            <Compass className="w-5 h-5" />
            <span className="absolute left-[54px] bg-[#071727]/90 text-primary-fixed-dim text-[10px] uppercase font-geist tracking-widest px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200">
              EXPLORER
            </span>
          </button>

          <button
            onClick={() => setActiveTab('spatial')}
            className={`w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 relative group ${
              activeTab === 'spatial'
                ? 'bg-primary-container/20 text-primary-fixed-dim border border-primary-fixed-dim/30 shadow-[0_0_15px_rgba(0,219,233,0.25)]'
                : 'text-on-surface-variant hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Spatial Mapping Configs"
          >
            <Box className="w-5 h-5" />
            <span className="absolute left-[54px] bg-[#071727]/90 text-primary-fixed-dim text-[10px] uppercase font-geist tracking-widest px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200">
              SPATIAL
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 relative group ${
              activeTab === 'analytics'
                ? 'bg-primary-container/20 text-primary-fixed-dim border border-primary-fixed-dim/30 shadow-[0_0_15px_rgba(0,219,233,0.25)]'
                : 'text-on-surface-variant hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Analytics Telemetry"
          >
            <LineChart className="w-5 h-5" />
            <span className="absolute left-[54px] bg-[#071727]/90 text-primary-fixed-dim text-[10px] uppercase font-geist tracking-widest px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200">
              ANALYTICS
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shield')}
            className={`w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 relative group ${
              activeTab === 'shield'
                ? 'bg-primary-container/20 text-primary-fixed-dim border border-primary-fixed-dim/30 shadow-[0_0_15px_rgba(0,219,233,0.25)]'
                : 'text-on-surface-variant hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Shield & Signal Safeguard"
          >
            <Shield className="w-5 h-5" />
            <span className="absolute left-[54px] bg-[#071727]/90 text-primary-fixed-dim text-[10px] uppercase font-geist tracking-widest px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200">
              SHUTTERS
            </span>
          </button>
        </nav>

        {/* Setting Button & User Profile block */}
        <div className="mt-auto flex flex-col gap-6">
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary-fixed-dim hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
            title="Device Override Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {/* Locked user avatar */}
          <div className="w-10 h-10 rounded-full border border-primary-fixed-dim/30 p-0.5 overflow-hidden active:scale-95 transition-transform cursor-pointer">
            <img
              alt="User Override Controller"
              className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL3RzsipTaLpcoFnMXH3tgeC4eNUu_tq48lh_GJ79D7ttqcppI3Fnhe_9_a8gf1bmE33ff_CeSfGQtd-XtsTAz9eQmewFecOCcqPynqpIz4LQGoN3NhgyE--fgYb7ccp2EHG3iU_AORKp-jS3t6gEMOhnqgt5KSjqAeFfTSvWCgkjTf6TQqygjWd3F0Hz7CvphfqKhiBuy_-fbgY2a7ATclAyZRDC-SUhe6q67pWN47S_Ps0ENVlGSgyclcDiAzajyX6IA8SlJx_7X"
            />
          </div>
        </div>
      </aside>

      {/* MOBILE FLOATING NAVIGATION DOCK (Positioned beautifully at the bottom boundary) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1c2d]/75 backdrop-blur-2xl flex justify-around items-center px-4 pb-6 pt-2.5 border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] rounded-t-3xl md:hidden">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center cursor-pointer p-3 transition-all duration-300 ${
            activeTab === 'explore'
              ? 'bg-primary-container/20 text-primary-fixed-dim rounded-full shadow-[0_0_15px_rgba(0,219,233,0.3)] border border-primary-fixed-dim/20'
              : 'text-on-surface-variant'
          }`}
        >
          <Compass className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab('spatial')}
          className={`flex flex-col items-center justify-center cursor-pointer p-3 transition-all duration-300 ${
            activeTab === 'spatial'
              ? 'bg-primary-container/20 text-primary-fixed-dim rounded-full shadow-[0_0_15px_rgba(0,219,233,0.3)] border border-primary-fixed-dim/20'
              : 'text-on-surface-variant'
          }`}
        >
          <Box className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center cursor-pointer p-3 transition-all duration-300 ${
            activeTab === 'analytics'
              ? 'bg-primary-container/20 text-primary-fixed-dim rounded-full shadow-[0_0_15px_rgba(0,219,233,0.3)] border border-primary-fixed-dim/20'
              : 'text-on-surface-variant'
          }`}
        >
          <LineChart className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab('shield')}
          className={`flex flex-col items-center justify-center cursor-pointer p-3 transition-all duration-300 ${
            activeTab === 'shield'
              ? 'bg-primary-container/20 text-primary-fixed-dim rounded-full shadow-[0_0_15px_rgba(0,219,233,0.3)] border border-primary-fixed-dim/20'
              : 'text-on-surface-variant'
          }`}
        >
          <Shield className="w-5 h-5" />
        </button>
      </nav>

      {/* MAIN OPERATIONAL SURFACE GRID GRID (Panels float on both sides) */}
      <main className="fixed inset-0 left-0 right-0 top-16 md:left-20 bottom-[80px] md:bottom-0 pointer-events-none z-10 select-none">
        
        {/* LEFT COLUMN SYSTEM CONTROLLER CARDS */}
        <div
          className={`absolute top-4 left-4 w-[calc(100%-32px)] sm:w-80 md:w-85 max-h-[82vh] md:max-h-none overflow-y-auto pointer-events-auto md:flex flex-col gap-4 transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          } ${activeTab !== 'explore' ? 'hidden md:flex opacity-30 select-none' : 'flex'}`}
        >
          {/* NETWORK LATENCY INTERACTIVE CARD */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 active-glow transition-shadow duration-300">
            <div className="flex justify-between items-start mb-3">
              <p className="font-geist text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Network Latency
              </p>
              <Wifi className="w-4 h-4 text-primary-fixed-dim animate-pulse" />
            </div>
            
            <div className="flex items-baseline gap-1.5">
              <p className="font-sans text-4xl font-extrabold text-primary-fixed-dim tracking-tight">
                {liveLatency.toFixed(3)}
              </p>
              <span className="text-on-surface-variant text-[11px] font-mono font-bold">MS</span>
            </div>
            
            <div className="mt-3.5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              {/* Width changes slightly dynamically according to latency metrics */}
              <div
                className="h-full bg-primary-fixed-dim/50 transition-all duration-500"
                style={{ width: `${Math.min(100, liveLatency * 800)}%` }}
              ></div>
            </div>
          </div>

          {/* INTERNAL SYSTEM HEALTH CRADLE */}
          <div className="glass-panel p-5 rounded-xl border border-white/10">
            <h3 className="font-geist text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-4 text-left">
              Internal Systems
            </h3>
            
            <div className="space-y-5">
              {/* Energy Level Monitor */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="font-geist text-[10px] text-on-surface-variant font-semibold">
                    ENERGY RESERVES
                  </span>
                  <span className="font-geist text-[11px] text-primary-fixed-dim font-bold">
                    {liveEnergy.toFixed(1)}%
                  </span>
                </div>
                
                {/* Visual energy tube slider with internal glowing pulse */}
                <div className="h-2 w-full bg-[#122131] rounded-full overflow-hidden relative border border-white/5 p-[1px]">
                  <div
                    className="h-full bg-primary-fixed-dim shadow-[0_0_15px_rgba(0,219,233,0.8)] transition-all duration-300 rounded-full"
                    style={{ width: `${liveEnergy}%` }}
                  ></div>
                </div>
              </div>

              {/* Subsystems Block State Controls */}
              <div className="flex flex-col gap-2 text-left">
                <div className="flex justify-between items-end">
                  <span className="font-geist text-[10px] text-on-surface-variant font-semibold">
                    OPERATIONAL STATUS
                  </span>
                  <span className="font-geist text-[11px] text-emerald-400 font-bold tracking-wide">
                    OPTIMAL
                  </span>
                </div>
                
                {/* 4 Block telemetry stack */}
                <div className="flex gap-1.5 h-2">
                  <div className="flex-1 bg-primary-fixed-dim rounded-sm shadow-[0_0_8px_rgba(0,219,233,0.6)]"></div>
                  <div className="flex-1 bg-primary-fixed-dim rounded-sm shadow-[0_0_8px_rgba(0,219,233,0.6)]"></div>
                  <div className="flex-1 bg-primary-fixed-dim rounded-sm shadow-[0_0_8px_rgba(0,219,233,0.6)]"></div>
                  <div className="flex-1 bg-white/10 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* PROTOCOL SELECTOR & CORE SHUNT OVERRIDE */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 border-l-4 border-l-primary-fixed-dim text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg bg-primary-container/10 border border-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim">
                <Zap className="w-5 h-5 text-primary-fixed-dim animate-bounce" />
              </div>
              <div>
                <p className="font-sans font-extrabold text-on-surface text-sm leading-tight">
                  {activeProtocol.name}
                </p>
                <p className="font-geist text-[9px] text-on-surface-variant uppercase tracking-wider">
                  Active Protocol: {activeProtocol.code}
                </p>
              </div>
            </div>

            {/* Selector list */}
            <div className="mb-4 space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {PROTOCOLS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProtocolSelect(p)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-geist flex items-center justify-between border cursor-pointer transition-colors ${
                    activeProtocol.id === p.id
                      ? 'bg-primary-container/20 text-primary-fixed-dim border-primary-fixed-dim/40 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-on-surface/80 border-transparent'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className={`font-mono text-[9px] px-1 bg-white/10 rounded ml-1`}>{p.code}</span>
                </button>
              ))}
            </div>

            {/* Main execution override trigger */}
            <button
              onClick={handleRecalibrate}
              className="w-full bg-primary-fixed-dim hover:bg-primary-fixed text-[#002022] font-black font-geist text-xs py-3 rounded-lg tracking-widest cursor-pointer transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(0,219,233,0.2)] text-center uppercase"
            >
              Recalibrate Core
            </button>
          </div>

          {/* CONSOLE OPERATIONAL LOG STREAM */}
          <div className="hidden md:block">
            <ConsoleLogs logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>

        {/* RIGHT COLUMN COCKPIT STATUS PANELS */}
        <div
          className={`absolute top-4 right-4 w-72 pointer-events-auto flex flex-col gap-4 transition-all duration-300 hidden lg:flex ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full opacity-0 pointer-events-none'
          }`}
        >
          {/* TAB DETAILED PANELS - Display contextually on selected sidebar tab */}
          {activeTab === 'spatial' && (
            <SpatialDashboard
              rotationSpeed={rotationSpeed}
              onSpeedChange={(speed) => setRotationSpeed(speed)}
              particleDensity={particleDensity}
              onDensityChange={(val) => setParticleDensity(val)}
              spatialGridVisible={spatialGridVisible}
              onToggleGrid={() => setSpatialGridVisible(!spatialGridVisible)}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {activeTab === 'shield' && <ShieldDashboard onAddLog={addLog} />}

          {/* DYNAMIC TELEMETRY ANGLE COORDINATES (CORE ROTATION) */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 text-left">
            <p className="font-geist text-[10px] text-on-surface-variant mb-2.5 uppercase tracking-wider font-semibold">
              Core Rotation Telemetry
            </p>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div className="bg-white/5 p-2 rounded text-center border border-white/5">
                <p className="text-[9px] text-on-surface-variant/70 font-sans font-medium uppercase">X-Axis</p>
                <p className="text-xs text-primary-fixed-dim font-bold mt-0.5">
                  {rotation.x.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/5 p-2 rounded text-center border border-white/5">
                <p className="text-[9px] text-on-surface-variant/70 font-sans font-medium uppercase">Y-Axis</p>
                <p className="text-xs text-primary-fixed-dim font-bold mt-0.5">
                  {rotation.y.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/5 p-2 rounded text-center border border-white/5">
                <p className="text-[9px] text-on-surface-variant/70 font-sans font-medium uppercase">Z-Axis</p>
                <p className="text-xs text-primary-fixed-dim font-bold mt-0.5">
                  {rotation.z.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* ENVIRONMENT SENSOR DATA */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 text-left">
            <p className="font-geist text-[10px] text-on-surface-variant mb-2.5 uppercase tracking-wider font-semibold">
              Atmospheric & Radiation Sensors
            </p>
            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-on-surface-variant/80 font-medium">Core Air Quality</span>
                <span className="text-primary-fixed-dim font-mono font-bold">
                  {activeProtocol.atmosphere.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant/80 font-medium">Radiation Emission</span>
                <span className={`font-mono font-bold ${activeProtocol.radiation > 0.1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeProtocol.radiation.toFixed(2)} mSv
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM USER INTERACTION TOOLTIP */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
          <div className="bg-[#051424]/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-4 text-xs font-geist">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-primary-fixed-dim animate-spin" />
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Drag core to manually rotate
              </span>
            </div>
            <div className="w-px h-3 bg-white/20"></div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary-fixed-dim animate-bounce" />
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Click core to discharge spark pulses
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* OVERRIDE OVERLAY SETTINGS DIALOG */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-[#010a13]/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 relative border border-white/15 animate-fadeIn">
            <button
              onClick={() => setSettingsModalOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-primary-fixed-dim" />
              <h2 className="font-geist text-sm tracking-wider uppercase text-primary-fixed-dim font-bold">
                Transmitter Override Terminal
              </h2>
            </div>
            
            <p className="text-xs text-on-surface-variant leading-relaxed mb-5">
              Adjust magnetic sub-resonance alignment parameters. Modulating standard levels bypasses safety governors.
            </p>

            <div className="space-y-4">
              {/* Manual Frequency Tuner */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-white/5 space-y-2 text-left">
                <span className="text-[11px] text-on-surface-variant font-bold block uppercase tracking-wider">
                  Chrono Field Resonance
                </span>
                <div className="h-1 bg-white/10 rounded-full relative overflow-hidden">
                  <div className="bg-primary-fixed-dim h-full w-2/3 shadow-[0_0_8px_rgba(0,219,233,0.4)]"></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant/80">
                  <span>9.24 GHz</span>
                  <span className="text-primary-fixed-dim font-bold">TUNED PRECISELY</span>
                </div>
              </div>

              {/* Toggle controls */}
              <div className="flex justify-between items-center text-xs text-left">
                <div>
                  <h4 className="font-semibold text-on-surface">Telemetry Auto-Sentry</h4>
                  <p className="text-[10px] text-on-surface-variant">Send diagnostic statistics automatically</p>
                </div>
                <button
                  onClick={() => addLog('Auto-Sentry systems initialized.', 'success')}
                  className="bg-primary-container text-[#002022] font-black font-geist text-[10px] px-3.5 py-1.5 rounded-lg shadow-md uppercase"
                >
                  Enable
                </button>
              </div>

              <div className="flex justify-between items-center text-xs text-left border-t border-white/5 pt-3">
                <div>
                  <h4 className="font-semibold text-on-surface">Lock Central Shutter</h4>
                  <p className="text-[10px] text-on-surface-variant">Prevent accidental coordinate drift</p>
                </div>
                <button
                  onClick={() => addLog('Central coordinate compass locked', 'warning')}
                  className="bg-white/10 hover:bg-white/15 text-white font-geist text-[10px] px-3.5 py-1.5 rounded-lg uppercase"
                >
                  Engage
                </button>
              </div>
            </div>

            <button
              onClick={() => setSettingsModalOpen(false)}
              className="w-full bg-[#122131] hover:bg-surface-variant border border-white/10 text-white font-geist text-xs py-2.5 rounded-lg font-bold uppercase tracking-wider mt-6 cursor-pointer"
            >
              Verify & Lock System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
