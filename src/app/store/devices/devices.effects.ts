import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Apollo } from 'apollo-angular';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DevicesActions } from './devices.actions';
import { GET_DEVICES, CREATE_DEVICE, DELETE_DEVICE } from '../../graphql/queries';
import { Device } from '../../core/models';

@Injectable()
export class DevicesEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);

  loadDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevicesActions.loadDevices),
      switchMap(() =>
        this.apollo
          .query<{ devices: Device[] }>({ query: GET_DEVICES })
          .pipe(
            map((result) => DevicesActions.loadDevicesSuccess({ devices: result.data?.devices ?? [] })),
            catchError((error) => of(DevicesActions.loadDevicesFailure({ error: error.message })))
          )
      )
    )
  );

  addDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevicesActions.addDevice),
      switchMap(({ device }) =>
        this.apollo
          .mutate<{ createDevice: Device }>({ mutation: CREATE_DEVICE, variables: { input: device } })
          .pipe(
            map((result) => DevicesActions.addDeviceSuccess({ device: result.data!.createDevice })),
            catchError((error) => of(DevicesActions.loadDevicesFailure({ error: error.message })))
          )
      )
    )
  );

  removeDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevicesActions.removeDevice),
      switchMap(({ id }) =>
        this.apollo
          .mutate<{ deleteDevice: boolean }>({ mutation: DELETE_DEVICE, variables: { id } })
          .pipe(
            map(() => DevicesActions.removeDeviceSuccess({ id })),
            catchError((error) => of(DevicesActions.loadDevicesFailure({ error: error.message })))
          )
      )
    )
  );
}
