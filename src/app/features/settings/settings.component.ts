import { Component, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly STORAGE_KEY = 'pulseboard_settings';

  // All state managed via Angular Signals — restored from localStorage
  darkMode = signal(true);
  compactView = signal(false);
  showOfflineDevices = signal(true);
  autoRefreshInterval = signal(3);
  temperatureUnit = signal<'celsius' | 'fahrenheit'>('celsius');
  alertSound = signal(true);
  alertEmail = signal(false);
  emailAddress = signal('');
  criticalAlerts = signal(true);
  warningAlerts = signal(true);
  infoAlerts = signal(false);
  dashboardColumns = signal(4);
  chartAnimations = signal(true);
  language = signal('en');

  // Computed signals
  notificationSummary = computed(() => {
    const types: string[] = [];
    if (this.criticalAlerts()) types.push('Critical');
    if (this.warningAlerts()) types.push('Warning');
    if (this.infoAlerts()) types.push('Info');
    return types.length > 0 ? types.join(', ') : 'None';
  });

  refreshLabel = computed(() => `${this.autoRefreshInterval()}s`);

  settingsSaved = signal(false);

  constructor() {
    this.loadFromStorage();

    // Effect — persists settings on change (demonstrates effect() API)
    effect(() => {
      const snapshot = {
        interval: this.autoRefreshInterval(),
        unit: this.temperatureUnit(),
        notifications: this.notificationSummary(),
      };
      localStorage.setItem(this.STORAGE_KEY + ':last', JSON.stringify(snapshot));
    });
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.darkMode !== undefined) this.darkMode.set(saved.darkMode);
      if (saved.compactView !== undefined) this.compactView.set(saved.compactView);
      if (saved.showOfflineDevices !== undefined) this.showOfflineDevices.set(saved.showOfflineDevices);
      if (saved.autoRefreshInterval !== undefined) this.autoRefreshInterval.set(saved.autoRefreshInterval);
      if (saved.temperatureUnit !== undefined) this.temperatureUnit.set(saved.temperatureUnit);
      if (saved.alertSound !== undefined) this.alertSound.set(saved.alertSound);
      if (saved.alertEmail !== undefined) this.alertEmail.set(saved.alertEmail);
      if (saved.emailAddress !== undefined) this.emailAddress.set(saved.emailAddress);
      if (saved.criticalAlerts !== undefined) this.criticalAlerts.set(saved.criticalAlerts);
      if (saved.warningAlerts !== undefined) this.warningAlerts.set(saved.warningAlerts);
      if (saved.infoAlerts !== undefined) this.infoAlerts.set(saved.infoAlerts);
      if (saved.dashboardColumns !== undefined) this.dashboardColumns.set(saved.dashboardColumns);
      if (saved.chartAnimations !== undefined) this.chartAnimations.set(saved.chartAnimations);
      if (saved.language !== undefined) this.language.set(saved.language);
    } catch { /* ignore corrupt data */ }
  }

  onIntervalChange(value: string): void {
    this.autoRefreshInterval.set(Number(value));
  }

  onColumnsChange(value: string): void {
    this.dashboardColumns.set(Number(value));
  }

  onEmailChange(value: string): void {
    this.emailAddress.set(value);
  }

  saveSettings(): void {
    const data = {
      darkMode: this.darkMode(),
      compactView: this.compactView(),
      showOfflineDevices: this.showOfflineDevices(),
      autoRefreshInterval: this.autoRefreshInterval(),
      temperatureUnit: this.temperatureUnit(),
      alertSound: this.alertSound(),
      alertEmail: this.alertEmail(),
      emailAddress: this.emailAddress(),
      criticalAlerts: this.criticalAlerts(),
      warningAlerts: this.warningAlerts(),
      infoAlerts: this.infoAlerts(),
      dashboardColumns: this.dashboardColumns(),
      chartAnimations: this.chartAnimations(),
      language: this.language(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this.settingsSaved.set(true);
    setTimeout(() => this.settingsSaved.set(false), 2000);
  }

  resetDefaults(): void {
    this.darkMode.set(true);
    this.compactView.set(false);
    this.showOfflineDevices.set(true);
    this.autoRefreshInterval.set(3);
    this.temperatureUnit.set('celsius');
    this.alertSound.set(true);
    this.alertEmail.set(false);
    this.emailAddress.set('');
    this.criticalAlerts.set(true);
    this.warningAlerts.set(true);
    this.infoAlerts.set(false);
    this.dashboardColumns.set(4);
    this.chartAnimations.set(true);
    this.language.set('en');
  }
}
