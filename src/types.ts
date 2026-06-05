/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NodeStatus = 'ONLINE' | 'STANDBY' | 'OFFLINE';

export interface SystemNode {
  id: string;
  name: string;
  status: NodeStatus;
  heat: number;      // percentage 0-100
  frequency: number; // in GHz
  load: number;      // percentage 0-100
  description: string;
}

export type LogLevel = 'INFO' | 'WARNING' | 'SUCCESS' | 'CRITICAL';

export interface DiagnosticLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface CoreTelemetry {
  latency: number;             // ms
  energyLevel: number;         // percentage
  containmentStrength: number; // percentage
  particleDensity: number;     // percentage (affects particle visual count)
  coreFrequency: number;       // GHz (affects rotation speed)
  systemStatus: 'OPTIMAL' | 'RECALIBRATING' | 'WARNING' | 'DEGRADED';
}
