import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloLink, Observable as ApolloObservable } from '@apollo/client/core';
import { MOCK_DEVICES } from '../core/data/mock-devices';
import { MOCK_ALERTS } from '../core/data/mock-alerts';
import { Device } from '../core/models/device.model';
import { Alert } from '../core/models/alert.model';

// In-memory mock data that can be mutated
let devices: Device[] = JSON.parse(JSON.stringify(MOCK_DEVICES));
let alerts: Alert[] = JSON.parse(JSON.stringify(MOCK_ALERTS));

function resolveQuery(operationName: string | undefined, variables: Record<string, unknown>) {
  switch (operationName) {
    case 'GetDevices':
      return { data: { devices: [...devices] } };
    case 'GetDevice':
      return { data: { device: devices.find(d => d.id === variables['id']) || null } };
    case 'GetAlerts':
      return { data: { alerts: [...alerts] } };
    default:
      return { data: null };
  }
}

function resolveMutation(operationName: string | undefined, variables: Record<string, unknown>) {
  switch (operationName) {
    case 'UpdateDevice': {
      const idx = devices.findIndex(d => d.id === variables['id']);
      if (idx >= 0) {
        devices[idx] = { ...devices[idx], ...(variables['input'] as Partial<Device>) };
        return { data: { updateDevice: devices[idx] } };
      }
      return { data: { updateDevice: null } };
    }
    case 'DeleteDevice': {
      devices = devices.filter(d => d.id !== variables['id']);
      return { data: { deleteDevice: true } };
    }
    case 'CreateDevice': {
      const newDevice: Device = {
        ...(variables['input'] as Device),
        id: 'dev-' + String(devices.length + 1).padStart(3, '0'),
        lastSeen: Date.now(),
        readings: [],
      };
      devices.push(newDevice);
      return { data: { createDevice: newDevice } };
    }
    case 'AcknowledgeAlert': {
      const aIdx = alerts.findIndex(a => a.id === variables['id']);
      if (aIdx >= 0) {
        alerts[aIdx] = { ...alerts[aIdx], status: 'acknowledged' };
        return { data: { acknowledgeAlert: alerts[aIdx] } };
      }
      return { data: { acknowledgeAlert: null } };
    }
    case 'ResolveAlert': {
      const rIdx = alerts.findIndex(a => a.id === variables['id']);
      if (rIdx >= 0) {
        alerts[rIdx] = { ...alerts[rIdx], status: 'resolved' };
        return { data: { resolveAlert: alerts[rIdx] } };
      }
      return { data: { resolveAlert: null } };
    }
    default:
      return { data: null };
  }
}

// Mock Apollo Link — resolves queries locally without a server
const mockLink = new ApolloLink((operation) => {
  return new ApolloObservable(observer => {
    const { operationName, variables } = operation;
    const definition = operation.query.definitions[0];
    const isMutation = definition && 'operation' in definition && definition.operation === 'mutation';

    // Simulate network delay
    setTimeout(() => {
      const result = isMutation
        ? resolveMutation(operationName, variables)
        : resolveQuery(operationName, variables);
      observer.next(result);
      observer.complete();
    }, 150 + Math.random() * 200);
  });
});

export function provideGraphQL() {
  return provideApollo(() => ({
    link: mockLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache' },
      query: { fetchPolicy: 'no-cache' },
    },
  }));
}
