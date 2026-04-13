import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertsState, alertsAdapter } from './alerts.reducer';
import { AlertSeverity, AlertStatus } from '../../core/models';

export const selectAlertsState = createFeatureSelector<AlertsState>('alerts');

const { selectAll, selectTotal } = alertsAdapter.getSelectors();

export const selectAllAlerts = createSelector(selectAlertsState, selectAll);
export const selectAlertsTotal = createSelector(selectAlertsState, selectTotal);
export const selectAlertsLoading = createSelector(selectAlertsState, (s) => s.loading);

export const selectAlertsBySeverity = (severity: AlertSeverity) =>
  createSelector(selectAllAlerts, (alerts) => alerts.filter((a) => a.severity === severity));

export const selectAlertsByStatus = (status: AlertStatus) =>
  createSelector(selectAllAlerts, (alerts) => alerts.filter((a) => a.status === status));

export const selectActiveAlerts = createSelector(selectAllAlerts, (alerts) =>
  alerts.filter((a) => a.status === 'active')
);

export const selectCriticalActiveAlerts = createSelector(selectActiveAlerts, (alerts) =>
  alerts.filter((a) => a.severity === 'critical')
);

export const selectAlertsCount = createSelector(selectAllAlerts, (alerts) => ({
  critical: alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length,
  warning: alerts.filter((a) => a.severity === 'warning' && a.status === 'active').length,
  info: alerts.filter((a) => a.severity === 'info').length,
  total: alerts.filter((a) => a.status === 'active').length,
}));
