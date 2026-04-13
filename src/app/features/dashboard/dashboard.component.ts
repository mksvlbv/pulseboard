import { Component, inject, OnInit, OnDestroy, signal, computed, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import Chart from 'chart.js/auto';
import { DevicesActions } from '../../store/devices/devices.actions';
import { AlertsActions } from '../../store/alerts/alerts.actions';
import {
  selectAllDevices,
  selectOnlineDevices,
  selectAverageTemperature,
  selectDevicesLoading,
  selectDeviceNameMap,
} from '../../store/devices/devices.selectors';
import { selectAlertsCount } from '../../store/alerts/alerts.selectors';
import { WebSocketSimulatorService, SensorUpdate } from '../../core/services/websocket-simulator.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private store = inject(Store);
  private ws = inject(WebSocketSimulatorService);
  private destroy$ = new Subject<void>();

  private energyChartRef!: ElementRef<HTMLCanvasElement>;
  private tempChartRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('energyChart') set energyChartSetter(ref: ElementRef<HTMLCanvasElement>) {
    if (ref && !this.energyChart) {
      this.energyChartRef = ref;
      this.tryInitCharts();
    }
  }

  @ViewChild('tempChart') set tempChartSetter(ref: ElementRef<HTMLCanvasElement>) {
    if (ref && !this.tempChart) {
      this.tempChartRef = ref;
      this.tryInitCharts();
    }
  }

  devices$ = this.store.select(selectAllDevices);
  onlineDevices$ = this.store.select(selectOnlineDevices);
  avgTemp$ = this.store.select(selectAverageTemperature);
  loading$ = this.store.select(selectDevicesLoading);
  alertsCount$ = this.store.select(selectAlertsCount);
  deviceNames$ = this.store.select(selectDeviceNameMap);

  // Signals for live data
  liveUpdates = signal<SensorUpdate[]>([]);
  lastUpdate = signal<SensorUpdate | null>(null);
  updateCount = signal(0);

  liveUpdatesList = computed(() => this.liveUpdates().slice(-8).reverse());

  private energyChart: Chart | null = null;
  private tempChart: Chart | null = null;

  ngOnInit(): void {
    this.store.dispatch(DevicesActions.loadDevices());
    this.store.dispatch(AlertsActions.loadAlerts());

    this.deviceNames$.pipe(takeUntil(this.destroy$)).subscribe(map => {
      this.deviceNameMap = map;
    });

    this.ws.sensorStream$.pipe(takeUntil(this.destroy$)).subscribe((update) => {
      this.lastUpdate.set(update);
      this.updateCount.update((c) => c + 1);
      this.liveUpdates.update((arr) => [...arr.slice(-50), update]);

      this.store.dispatch(
        DevicesActions.updateSensorData({
          id: update.deviceId,
          temperature: update.temperature,
          humidity: update.humidity,
          energy: update.energy,
          pressure: +update.pressure,
        })
      );

      this.updateCharts(update);
    });
  }

  ngAfterViewInit(): void {
    this.tryInitCharts();
  }

  private tryInitCharts(): void {
    if (this.energyChartRef && this.tempChartRef && !this.energyChart && !this.tempChart) {
      this.initCharts();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.energyChart?.destroy();
    this.tempChart?.destroy();
  }

  private initCharts(): void {
    const hours = Array.from({ length: 12 }, (_, i) => `${i * 2}h`);
    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#55556a', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#55556a', font: { size: 11 } } },
      },
    };

    this.energyChart = new Chart(this.energyChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [{
          data: hours.map(() => +(Math.random() * 8 + 2).toFixed(1)),
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          borderColor: '#6366f1',
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: chartDefaults,
    });

    this.tempChart = new Chart(this.tempChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          data: hours.map(() => +(Math.random() * 30 + 20).toFixed(1)),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        }],
      },
      options: chartDefaults,
    });
  }

  private updateCharts(update: SensorUpdate): void {
    if (this.energyChart) {
      this.energyChart.data.datasets[0].data.shift();
      this.energyChart.data.datasets[0].data.push(update.energy);
      this.energyChart.update();
    }
    if (this.tempChart) {
      this.tempChart.data.datasets[0].data.shift();
      this.tempChart.data.datasets[0].data.push(update.temperature);
      this.tempChart.update();
    }
  }

  deviceNameMap: Record<string, string> = {};

  getStatusClass(status: string): string {
    return `status--${status}`;
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  getDeviceName(id: string): string {
    return this.deviceNameMap[id] ?? id;
  }
}
