import { Component, inject, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Subject, takeUntil, filter } from 'rxjs';
import Chart from 'chart.js/auto';
import { selectDeviceById } from '../../store/devices/devices.selectors';
import { DevicesActions } from '../../store/devices/devices.actions';
import { WebSocketSimulatorService, SensorUpdate } from '../../core/services/websocket-simulator.service';
import { Device } from '../../core/models';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, UpperCasePipe],
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private ws = inject(WebSocketSimulatorService);
  private destroy$ = new Subject<void>();

  @ViewChild('historyChart') historyChartRef!: ElementRef<HTMLCanvasElement>;

  deviceId = '';
  device$ = this.store.select(selectDeviceById(''));
  liveReadings = signal<SensorUpdate[]>([]);
  private chart: Chart | null = null;

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('id') ?? '';
    this.device$ = this.store.select(selectDeviceById(this.deviceId));
    this.store.dispatch(DevicesActions.loadDevices());

    this.ws.sensorStream$.pipe(
      filter(u => u.deviceId === this.deviceId),
      takeUntil(this.destroy$),
    ).subscribe(update => {
      this.liveReadings.update(arr => [...arr.slice(-30), update]);
      this.store.dispatch(DevicesActions.updateSensorData({
        id: update.deviceId,
        temperature: update.temperature,
        humidity: update.humidity,
        energy: update.energy,
        pressure: +update.pressure,
      }));
      this.addChartPoint(update);
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chart?.destroy();
  }

  goBack(): void {
    this.router.navigate(['/devices']);
  }

  getStatusClass(status: string): string { return `status--${status}`; }

  formatTime(ts: number): string { return new Date(ts).toLocaleTimeString(); }

  private initChart(): void {
    this.chart = new Chart(this.historyChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { label: 'Temperature', data: [], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2 },
          { label: 'Humidity', data: [], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2 },
          { label: 'Energy', data: [], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#8888a0', font: { size: 12 } } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#55556a', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#55556a', font: { size: 10 } } },
        },
      },
    });
  }

  private addChartPoint(u: SensorUpdate): void {
    if (!this.chart) return;
    const label = new Date(u.timestamp).toLocaleTimeString();
    this.chart.data.labels!.push(label);
    this.chart.data.datasets[0].data.push(u.temperature);
    this.chart.data.datasets[1].data.push(u.humidity);
    this.chart.data.datasets[2].data.push(u.energy);
    if (this.chart.data.labels!.length > 30) {
      this.chart.data.labels!.shift();
      this.chart.data.datasets.forEach(ds => (ds.data as number[]).shift());
    }
    this.chart.update('none');
  }
}
