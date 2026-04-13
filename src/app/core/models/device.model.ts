export type DeviceStatus = 'online' | 'offline' | 'warning' | 'critical';
export type DeviceType = 'sensor' | 'actuator' | 'gateway' | 'controller';

export interface SensorReading {
  timestamp: number;
  temperature: number;
  humidity: number;
  energy: number;
  pressure: number;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string;
  firmware: string;
  lastSeen: number;
  temperature: number;
  humidity: number;
  energy: number;
  pressure: number;
  batteryLevel: number;
  signalStrength: number;
  uptimeHours: number;
  readings: SensorReading[];
}
