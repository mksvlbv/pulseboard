import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WebSocketSimulatorService, SensorUpdate } from './websocket-simulator.service';
import { take } from 'rxjs/operators';

describe('WebSocketSimulatorService', () => {
  let service: WebSocketSimulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketSimulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have sensorStream$ observable', () => {
    expect(service.sensorStream$).toBeDefined();
  });

  it('should have alertStream$ observable', () => {
    expect(service.alertStream$).toBeDefined();
  });

  it('should emit sensor updates with correct shape', fakeAsync(() => {
    let update: SensorUpdate | undefined;

    service.sensorStream$.pipe(take(1)).subscribe(u => update = u);
    tick(3100);

    expect(update).toBeDefined();
    expect(update!.deviceId).toMatch(/^dev-\d{3}$/);
    expect(typeof update!.temperature).toBe('number');
    expect(typeof update!.humidity).toBe('number');
    expect(typeof update!.energy).toBe('number');
    expect(typeof update!.pressure).toBe('number');
    expect(typeof update!.timestamp).toBe('number');

    service.disconnect();
  }));

  it('should stop emitting after disconnect', fakeAsync(() => {
    let count = 0;
    service.sensorStream$.subscribe(() => count++);

    tick(3100);
    expect(count).toBe(1);

    service.disconnect();
    tick(6200);
    expect(count).toBe(1);
  }));
});
