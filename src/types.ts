export interface Protocol {
  id: string;
  name: string;
  code: string;
  color: string;
  textColor: string;
  latencyBase: number;
  energyLevel: number;
  stability: 'STABLE' | 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' | 'CYCLIC';
  atmosphere: number;
  radiation: number;
  description: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'critical';
}

export interface Subsystem {
  id: string;
  name: string;
  status: 'OPTIMAL' | 'STABLE' | 'DEGRADED' | 'OFFLINE' | 'CALIBRATING';
  level: number;
}
