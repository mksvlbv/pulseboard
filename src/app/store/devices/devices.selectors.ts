import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DevicesState, devicesAdapter } from './devices.reducer';

export const selectDevicesState = createFeatureSelector<DevicesState>('devices');

const { selectAll, selectEntities, selectTotal } = devicesAdapter.getSelectors();

export const selectAllDevices = createSelector(selectDevicesState, selectAll);
export const selectDeviceEntities = createSelector(selectDevicesState, selectEntities);
export const selectDevicesTotal = createSelector(selectDevicesState, selectTotal);
export const selectDevicesLoading = createSelector(selectDevicesState, (s) => s.loading);

export const selectDeviceById = (id: string) =>
  createSelector(selectDeviceEntities, (entities) => entities[id] ?? null);

export const selectOnlineDevices = createSelector(selectAllDevices, (devices) =>
  devices.filter((d) => d.status === 'online')
);

export const selectOfflineDevices = createSelector(selectAllDevices, (devices) =>
  devices.filter((d) => d.status === 'offline')
);

export const selectCriticalDevices = createSelector(selectAllDevices, (devices) =>
  devices.filter((d) => d.status === 'critical' || d.status === 'warning')
);

export const selectAverageTemperature = createSelector(selectAllDevices, (devices) => {
  const online = devices.filter((d) => d.status !== 'offline');
  if (online.length === 0) return 0;
  return online.reduce((sum, d) => sum + d.temperature, 0) / online.length;
});

export const selectTotalEnergy = createSelector(selectAllDevices, (devices) =>
  devices.reduce((sum, d) => sum + d.energy, 0)
);

export const selectDeviceNameMap = createSelector(selectAllDevices, (devices) => {
  const map: Record<string, string> = {};
  devices.forEach(d => map[d.id] = d.name);
  return map;
});
