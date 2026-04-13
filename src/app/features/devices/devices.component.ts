import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DevicesActions } from '../../store/devices/devices.actions';
import { selectAllDevices, selectDevicesLoading } from '../../store/devices/devices.selectors';
import { Device, DeviceStatus, DeviceType } from '../../core/models';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, FormsModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  devices$ = this.store.select(selectAllDevices);
  loading$ = this.store.select(selectDevicesLoading);

  searchQuery = signal('');
  statusFilter = signal<DeviceStatus | 'all'>('all');
  typeFilter = signal<DeviceType | 'all'>('all');
  sortField = signal<'name' | 'temperature' | 'energy' | 'lastSeen'>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(5);

  showCreateModal = signal(false);
  newDevice = signal<Partial<Device>>({ name: '', type: 'sensor', location: '', firmware: 'v1.0.0' });

  onSearch(value: string): void { this.searchQuery.set(value); this.currentPage.set(1); }
  onStatusFilter(value: string): void { this.statusFilter.set(value as DeviceStatus | 'all'); this.currentPage.set(1); }
  onTypeFilter(value: string): void { this.typeFilter.set(value as DeviceType | 'all'); this.currentPage.set(1); }

  onSort(field: 'name' | 'temperature' | 'energy' | 'lastSeen'): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  filterAndSort(devices: Device[]): Device[] {
    let filtered = devices;
    const q = this.searchQuery().toLowerCase();
    if (q) filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q));
    if (this.statusFilter() !== 'all') filtered = filtered.filter(d => d.status === this.statusFilter());
    if (this.typeFilter() !== 'all') filtered = filtered.filter(d => d.type === this.typeFilter());

    const field = this.sortField();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;
    filtered = [...filtered].sort((a, b) => {
      const va = a[field];
      const vb = b[field];
      if (typeof va === 'string') return va.localeCompare(vb as string) * dir;
      return ((va as number) - (vb as number)) * dir;
    });

    return filtered;
  }

  paginate(devices: Device[]): Device[] {
    const start = (this.currentPage() - 1) * this.pageSize();
    return devices.slice(start, start + this.pageSize());
  }

  totalPages(total: number): number {
    return Math.ceil(total / this.pageSize());
  }

  openDetail(id: string): void {
    this.router.navigate(['/devices', id]);
  }

  confirmDelete(id: string, name: string, event: Event): void {
    event.stopPropagation();
    if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
      this.store.dispatch(DevicesActions.removeDevice({ id }));
    }
  }

  updateNewDevice(field: string, value: string): void {
    this.newDevice.update(d => ({ ...d, [field]: value }));
  }

  openCreate(): void {
    this.showCreateModal.set(true);
    this.newDevice.set({ name: '', type: 'sensor', location: '', firmware: 'v1.0.0' });
  }

  createDevice(): void {
    const d = this.newDevice();
    if (!d.name) return;
    this.store.dispatch(DevicesActions.addDevice({
      device: {
        name: d.name!,
        type: d.type as DeviceType,
        status: 'online',
        location: d.location || 'Unknown',
        firmware: d.firmware || 'v1.0.0',
        temperature: 22,
        humidity: 45,
        energy: 0,
        pressure: 1013,
        batteryLevel: 100,
        signalStrength: -40,
        uptimeHours: 0,
      }
    }));
    this.showCreateModal.set(false);
  }

  getStatusClass(status: string): string { return `status--${status}`; }

  ngOnInit(): void {
    this.store.dispatch(DevicesActions.loadDevices());
  }
}
