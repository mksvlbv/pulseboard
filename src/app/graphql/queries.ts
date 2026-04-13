import { gql } from 'apollo-angular';

export const GET_DEVICES = gql`
  query GetDevices {
    devices {
      id
      name
      type
      status
      location
      firmware
      lastSeen
      temperature
      humidity
      energy
      pressure
      batteryLevel
      signalStrength
      uptimeHours
    }
  }
`;

export const GET_DEVICE = gql`
  query GetDevice($id: ID!) {
    device(id: $id) {
      id
      name
      type
      status
      location
      firmware
      lastSeen
      temperature
      humidity
      energy
      pressure
      batteryLevel
      signalStrength
      uptimeHours
      readings {
        timestamp
        temperature
        humidity
        energy
        pressure
      }
    }
  }
`;

export const GET_ALERTS = gql`
  query GetAlerts {
    alerts {
      id
      deviceId
      deviceName
      severity
      status
      message
      metric
      value
      threshold
      timestamp
    }
  }
`;

export const UPDATE_DEVICE = gql`
  mutation UpdateDevice($id: ID!, $input: DeviceInput!) {
    updateDevice(id: $id, input: $input) {
      id
      name
      status
    }
  }
`;

export const DELETE_DEVICE = gql`
  mutation DeleteDevice($id: ID!) {
    deleteDevice(id: $id)
  }
`;

export const CREATE_DEVICE = gql`
  mutation CreateDevice($input: DeviceInput!) {
    createDevice(input: $input) {
      id
      name
      type
      status
      location
    }
  }
`;

export const ACKNOWLEDGE_ALERT = gql`
  mutation AcknowledgeAlert($id: ID!) {
    acknowledgeAlert(id: $id) {
      id
      status
    }
  }
`;

export const RESOLVE_ALERT = gql`
  mutation ResolveAlert($id: ID!) {
    resolveAlert(id: $id) {
      id
      status
    }
  }
`;
