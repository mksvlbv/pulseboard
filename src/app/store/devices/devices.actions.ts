import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Device } from '../../core/models';

export const DevicesActions = createActionGroup({
  source: 'Devices',
  events: {
    'Load Devices': emptyProps(),
    'Load Devices Success': props<{ devices: Device[] }>(),
    'Load Devices Failure': props<{ error: string }>(),
    'Update Device': props<{ device: Device }>(),
    'Remove Device': props<{ id: string }>(),
    'Remove Device Success': props<{ id: string }>(),
    'Add Device': props<{ device: Partial<Device> }>(),
    'Add Device Success': props<{ device: Device }>(),
    'Update Sensor Data': props<{ id: string; temperature: number; humidity: number; energy: number; pressure: number }>(),
  },
});
