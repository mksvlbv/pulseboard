import { Injectable } from '@angular/core';
import { Observable, interval, Subject } from 'rxjs';
import { map, share, takeUntil, filter } from 'rxjs/operators';

export interface SensorUpdate {
  deviceId: string;
  temperature: number;
  humidity: number;
  energy: number;
  pressure: number;
  timestamp: number;
}

export interface AlertEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class WebSocketSimulatorService {
  private destroy$ = new Subject<void>();
  private alertCounter = 100;

  private readonly deviceIds = [
    'dev-001', 'dev-002', 'dev-003', 'dev-004', 'dev-005', 'dev-006', 'dev-007',
  ];

  private readonly deviceNames: Record<string, string> = {
    'dev-001': 'Solar Panel A1',
    'dev-002': 'HVAC Controller B2',
    'dev-003': 'Smart Meter #12',
    'dev-004': 'Water Tank Sensor',
    'dev-005': 'Boiler Monitor C1',
    'dev-006': 'Gateway Hub #3',
    'dev-007': 'Hydrogen Sensor D4',
  };

  private readonly baselines: Record<string, { temp: number; hum: number; energy: number; pressure: number }> = {
    'dev-001': { temp: 42, hum: 35, energy: 4.8, pressure: 1013 },
    'dev-002': { temp: 23, hum: 56, energy: 2.1, pressure: 1015 },
    'dev-003': { temp: 38, hum: 42, energy: 12.4, pressure: 1010 },
    'dev-004': { temp: 18, hum: 78, energy: 0.3, pressure: 1020 },
    'dev-005': { temp: 89, hum: 20, energy: 8.7, pressure: 1045 },
    'dev-006': { temp: 28, hum: 40, energy: 1.5, pressure: 1012 },
    'dev-007': { temp: 22, hum: 30, energy: 0.8, pressure: 1018 },
  };

  /** Emits sensor updates every 3 seconds for a random device */
  sensorStream$: Observable<SensorUpdate> = interval(3000).pipe(
    map(() => {
      const deviceId = this.deviceIds[Math.floor(Math.random() * this.deviceIds.length)];
      const base = this.baselines[deviceId];
      return {
        deviceId,
        temperature: +(base.temp + (Math.random() - 0.5) * 4).toFixed(1),
        humidity: +(base.hum + (Math.random() - 0.5) * 6).toFixed(1),
        energy: +(base.energy + (Math.random() - 0.5) * 1).toFixed(2),
        pressure: +(base.pressure + (Math.random() - 0.5) * 10).toFixed(0),
        timestamp: Date.now(),
      };
    }),
    takeUntil(this.destroy$),
    share(),
  );

  /** Emits occasional alerts (every ~15 seconds) */
  alertStream$: Observable<AlertEvent> = interval(15000).pipe(
    map(() => {
      const deviceId = this.deviceIds[Math.floor(Math.random() * this.deviceIds.length)];
      const base = this.baselines[deviceId];
      const deviceName = this.deviceNames[deviceId] ?? deviceId;
      const severity = Math.random() > 0.7 ? 'critical' as const : Math.random() > 0.4 ? 'warning' as const : 'info' as const;
      const messages: Record<string, string[]> = {
        critical: ['Temperature spike detected', 'Pressure exceeded safe range', 'Device unresponsive'],
        warning: ['Battery below threshold', 'Signal degradation', 'High humidity detected'],
        info: ['Firmware update available', 'Scheduled maintenance due', 'Calibration recommended'],
      };
      const msgList = messages[severity];
      const message = msgList[Math.floor(Math.random() * msgList.length)];
      this.alertCounter++;
      return {
        id: `alert-ws-${this.alertCounter}`,
        deviceId,
        deviceName,
        severity,
        message,
        metric: 'temperature',
        value: base.temp + (Math.random() - 0.5) * 10,
        threshold: base.temp + 5,
        timestamp: Date.now(),
      };
    }),
    takeUntil(this.destroy$),
    share(),
  );

  disconnect(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
