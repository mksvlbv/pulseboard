import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Apollo } from 'apollo-angular';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlertsActions } from './alerts.actions';
import { GET_ALERTS, ACKNOWLEDGE_ALERT, RESOLVE_ALERT } from '../../graphql/queries';
import { Alert } from '../../core/models';

@Injectable()
export class AlertsEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);

  loadAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.loadAlerts),
      switchMap(() =>
        this.apollo
          .query<{ alerts: Alert[] }>({ query: GET_ALERTS })
          .pipe(
            map((result) => AlertsActions.loadAlertsSuccess({ alerts: result.data?.alerts ?? [] })),
            catchError((error) => of(AlertsActions.loadAlertsFailure({ error: error.message })))
          )
      )
    )
  );

  acknowledgeAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.acknowledgeAlert),
      switchMap(({ id }) =>
        this.apollo
          .mutate({ mutation: ACKNOWLEDGE_ALERT, variables: { id } })
          .pipe(
            map(() => AlertsActions.acknowledgeAlertSuccess({ id })),
            catchError((error) => of(AlertsActions.loadAlertsFailure({ error: error.message })))
          )
      )
    )
  );

  resolveAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.resolveAlert),
      switchMap(({ id }) =>
        this.apollo
          .mutate({ mutation: RESOLVE_ALERT, variables: { id } })
          .pipe(
            map(() => AlertsActions.resolveAlertSuccess({ id })),
            catchError((error) => of(AlertsActions.loadAlertsFailure({ error: error.message })))
          )
      )
    )
  );
}
