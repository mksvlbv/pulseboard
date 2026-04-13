import { Device } from '../../core/models';
import { DevicesState, devicesAdapter } from './devices.reducer';
import {
  selectAllDevices,
  selectDevicesLoading,
  selectDevicesTotal,
  selectOnlineDevices,
  selectOfflineDevices,
  selectAverageTemperature,
  selectTotalEnergy,
  selectDeviceNameMap,
  selectDeviceById,
} from './devices.selectors';

const mockDevices: Device[] = [
  {
    id: 'dev-001', name: 'Sensor A', type: 'sensor', status: 'online',
    location: 'Zone A', firmware: 'v1.0', lastSeen: Date.now(),
    temperature: 25, humidity: 50, energy: 3.5, pressure: 1013,
    batteryLevel: 80, signalStrength: -42, uptimeHours: 100, readings: [],
  },
  {
    id: 'dev-002', name: 'Gateway B', type: 'gateway', status: 'offline',
    location: 'Zone B', firmware: 'v2.0', lastSeen: Date.now(),
    temperature: 30, humidity: 60, energy: 5.0, pressure: 1010,
    batteryLevel: 50, signalStrength: -65, uptimeHours: 200, readings: [],
  },
  {
    id: 'dev-003', name: 'Controller C', type: 'controller', status: 'warning',
    location: 'Zone C', firmware: 'v3.0', lastSeen: Date.now(),
    temperature: 45, humidity: 70, energy: 8.2, pressure: 1005,
    batteryLevel: 20, signalStrength: -80, uptimeHours: 50, readings: [],
  },
];

function createState(devices: Device[], loading = false): { devices: DevicesState } {
  return {
    devices: devicesAdapter.setAll(devices, devicesAdapter.getInitialState({ loading, error: null })),
  };
}

describe('Devices Selectors', () => {
  const state = createState(mockDevices);

  it('selectAllDevices should return all devices', () => {
    const result = selectAllDevices(state);
    expect(result.length).toBe(3);
  });

  it('selectDevicesTotal should return total count', () => {
    const result = selectDevicesTotal(state);
    expect(result).toBe(3);
  });

  it('selectDevicesLoading should return loading state', () => {
    const loadingState = createState([], true);
    expect(selectDevicesLoading(loadingState)).toBeTrue();
    expect(selectDevicesLoading(state)).toBeFalse();
  });

  it('selectOnlineDevices should filter online only', () => {
    const result = selectOnlineDevices(state);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('dev-001');
  });

  it('selectOfflineDevices should filter offline only', () => {
    const result = selectOfflineDevices(state);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('dev-002');
  });

  it('selectAverageTemperature should compute avg of non-offline devices', () => {
    const result = selectAverageTemperature(state);
    expect(result).toBe((25 + 45) / 2);
  });

  it('selectAverageTemperature should return 0 when all offline', () => {
    const allOffline = createState(mockDevices.map(d => ({ ...d, status: 'offline' as const })));
    expect(selectAverageTemperature(allOffline)).toBe(0);
  });

  it('selectTotalEnergy should sum energy across all devices', () => {
    const result = selectTotalEnergy(state);
    expect(result).toBeCloseTo(3.5 + 5.0 + 8.2);
  });

  it('selectDeviceNameMap should return id-to-name mapping', () => {
    const result = selectDeviceNameMap(state);
    expect(result['dev-001']).toBe('Sensor A');
    expect(result['dev-002']).toBe('Gateway B');
    expect(result['dev-003']).toBe('Controller C');
  });

  it('selectDeviceById should return specific device or null', () => {
    const result = selectDeviceById('dev-001')(state);
    expect(result?.name).toBe('Sensor A');

    const notFound = selectDeviceById('non-existent')(state);
    expect(notFound).toBeNull();
  });
});
