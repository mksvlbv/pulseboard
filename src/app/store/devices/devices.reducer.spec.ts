import { Device } from '../../core/models';
import { DevicesActions } from './devices.actions';
import { devicesReducer, DevicesState, devicesAdapter } from './devices.reducer';

const mockDevice: Device = {
  id: 'dev-001', name: 'Sensor A', type: 'sensor', status: 'online',
  location: 'Zone A', firmware: 'v1.0', lastSeen: Date.now(),
  temperature: 25, humidity: 50, energy: 3.5, pressure: 1013,
  batteryLevel: 80, signalStrength: -42, uptimeHours: 100, readings: [],
};

const initialState: DevicesState = devicesAdapter.getInitialState({ loading: false, error: null });

describe('Devices Reducer', () => {
  it('should set loading on loadDevices', () => {
    const action = DevicesActions.loadDevices();
    const state = devicesReducer(initialState, action);
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should populate devices on loadDevicesSuccess', () => {
    const action = DevicesActions.loadDevicesSuccess({ devices: [mockDevice] });
    const state = devicesReducer(initialState, action);
    expect(state.ids.length).toBe(1);
    expect(state.loading).toBeFalse();
  });

  it('should set error on loadDevicesFailure', () => {
    const action = DevicesActions.loadDevicesFailure({ error: 'Network error' });
    const state = devicesReducer(initialState, action);
    expect(state.loading).toBeFalse();
    expect(state.error).toBe('Network error');
  });

  it('should add device on addDeviceSuccess', () => {
    const action = DevicesActions.addDeviceSuccess({ device: mockDevice });
    const state = devicesReducer(initialState, action);
    expect(state.ids.length).toBe(1);
    expect(state.entities['dev-001']).toBeTruthy();
  });

  it('should remove device on removeDeviceSuccess', () => {
    const populated = devicesAdapter.addOne(mockDevice, initialState);
    const action = DevicesActions.removeDeviceSuccess({ id: 'dev-001' });
    const state = devicesReducer(populated, action);
    expect(state.ids.length).toBe(0);
  });

  it('should update sensor data', () => {
    const populated = devicesAdapter.addOne(mockDevice, initialState);
    const action = DevicesActions.updateSensorData({
      id: 'dev-001', temperature: 42, humidity: 65, energy: 7.1, pressure: 1020,
    });
    const state = devicesReducer(populated, action);
    expect(state.entities['dev-001']?.temperature).toBe(42);
    expect(state.entities['dev-001']?.energy).toBe(7.1);
  });
});
