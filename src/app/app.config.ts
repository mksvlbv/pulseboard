import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { devicesReducer } from './store/devices/devices.reducer';
import { alertsReducer } from './store/alerts/alerts.reducer';
import { DevicesEffects } from './store/devices/devices.effects';
import { AlertsEffects } from './store/alerts/alerts.effects';
import { provideGraphQL } from './graphql/graphql.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ devices: devicesReducer, alerts: alertsReducer }),
    provideEffects([DevicesEffects, AlertsEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    provideGraphQL(),
  ],
};
