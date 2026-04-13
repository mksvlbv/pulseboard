import { Component, inject, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AlertsActions } from '../../store/alerts/alerts.actions';
import { selectAllAlerts, selectAlertsCount } from '../../store/alerts/alerts.selectors';
import { WebSocketSimulatorService } from '../../core/services/websocket-simulator.service';
import { Alert, AlertSeverity, AlertStatus } from '../../core/models';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private ws = inject(WebSocketSimulatorService);
  private destroy$ = new Subject<void>();

  alerts$ = this.store.select(selectAllAlerts);
  alertsCount$ = this.store.select(selectAlertsCount);

  severityFilter = signal<AlertSeverity | 'all'>('all');
  statusFilter = signal<AlertStatus | 'all'>('all');

  ngOnInit(): void {
    this.store.dispatch(AlertsActions.loadAlerts());

    this.ws.alertStream$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      const alert: Alert = {
        id: event.id,
        deviceId: event.deviceId,
        deviceName: event.deviceName,
        severity: event.severity,
        status: 'active',
        message: event.message,
        metric: event.metric,
        value: event.value,
        threshold: event.threshold,
        timestamp: event.timestamp,
      };
      this.store.dispatch(AlertsActions.addAlert({ alert }));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterAlerts(alerts: Alert[]): Alert[] {
    let result = alerts;
    if (this.severityFilter() !== 'all') result = result.filter(a => a.severity === this.severityFilter());
    if (this.statusFilter() !== 'all') result = result.filter(a => a.status === this.statusFilter());
    return result;
  }

  setSeverity(value: string): void { this.severityFilter.set(value as AlertSeverity | 'all'); }
  setStatus(value: string): void { this.statusFilter.set(value as AlertStatus | 'all'); }

  acknowledge(id: string): void {
    this.store.dispatch(AlertsActions.acknowledgeAlert({ id }));
  }

  resolve(id: string): void {
    this.store.dispatch(AlertsActions.resolveAlert({ id }));
  }

  formatTime(ts: number): string {
    return new Date(ts).toLocaleString();
  }

  timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }
}
