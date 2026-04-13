export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
}
