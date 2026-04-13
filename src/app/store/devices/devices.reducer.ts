import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Device } from '../../core/models';
import { DevicesActions } from './devices.actions';

export interface DevicesState extends EntityState<Device> {
  loading: boolean;
  error: string | null;
}

export const devicesAdapter: EntityAdapter<Device> = createEntityAdapter<Device>();

const initialState: DevicesState = devicesAdapter.getInitialState({
  loading: false,
  error: null,
});

export const devicesReducer = createReducer(
  initialState,
  on(DevicesActions.loadDevices, (state) => ({ ...state, loading: true, error: null })),
  on(DevicesActions.loadDevicesSuccess, (state, { devices }) =>
    devicesAdapter.setAll(devices, { ...state, loading: false })
  ),
  on(DevicesActions.loadDevicesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(DevicesActions.updateDevice, (state, { device }) =>
    devicesAdapter.upsertOne(device, state)
  ),
  on(DevicesActions.removeDeviceSuccess, (state, { id }) =>
    devicesAdapter.removeOne(id, state)
  ),
  on(DevicesActions.addDeviceSuccess, (state, { device }) =>
    devicesAdapter.addOne(device, state)
  ),
  on(DevicesActions.updateSensorData, (state, { id, temperature, humidity, energy, pressure }) =>
    devicesAdapter.updateOne(
      { id, changes: { temperature, humidity, energy, pressure, lastSeen: Date.now() } },
      state
    )
  ),
);
