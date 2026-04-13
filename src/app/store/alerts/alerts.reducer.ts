import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Alert } from '../../core/models';
import { AlertsActions } from './alerts.actions';

export interface AlertsState extends EntityState<Alert> {
  loading: boolean;
  error: string | null;
}

export const alertsAdapter: EntityAdapter<Alert> = createEntityAdapter<Alert>({
  sortComparer: (a, b) => b.timestamp - a.timestamp,
});

const initialState: AlertsState = alertsAdapter.getInitialState({
  loading: false,
  error: null,
});

export const alertsReducer = createReducer(
  initialState,
  on(AlertsActions.loadAlerts, (state) => ({ ...state, loading: true, error: null })),
  on(AlertsActions.loadAlertsSuccess, (state, { alerts }) =>
    alertsAdapter.setAll(alerts, { ...state, loading: false })
  ),
  on(AlertsActions.loadAlertsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(AlertsActions.acknowledgeAlertSuccess, (state, { id }) =>
    alertsAdapter.updateOne({ id, changes: { status: 'acknowledged' } }, state)
  ),
  on(AlertsActions.resolveAlertSuccess, (state, { id }) =>
    alertsAdapter.updateOne({ id, changes: { status: 'resolved' } }, state)
  ),
  on(AlertsActions.addAlert, (state, { alert }) =>
    alertsAdapter.addOne(alert, state)
  ),
);
