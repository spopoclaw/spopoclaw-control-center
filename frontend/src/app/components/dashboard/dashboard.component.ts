import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { SystemService } from '../../services/system.service';
import { OpenclawService } from '../../services/openclaw.service';
import { SystemInfo, CpuInfo, MemoryInfo, OpenclawStatus } from '../../models';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatTableModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">Tableau de bord</h2>
          <p class="text-dark-400 mt-1">Vue d'ensemble du système et des services</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-dark-400">
          <div class="w-2 h-2 rounded-full bg-success-DEFAULT animate-pulse"></div>
          <span>Dernière mise à jour: {{ currentTime | date:'HH:mm:ss' }}</span>
        </div>
      </div>

      <!-- Status Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- System Status -->
        <div class="metric-card glow-success">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-success-dark/30 flex items-center justify-center">
              <mat-icon class="text-success-DEFAULT text-2xl">computer</mat-icon>
            </div>
            <span class="badge-success">Online</span>
          </div>
          <div class="metric-value">{{ systemInfo?.uptime_formatted || '--' }}</div>
          <div class="metric-label">Uptime Système</div>
        </div>

        <!-- OpenClaw Status -->
        <div class="metric-card" [class.glow-success]="openclawStatus?.status === 'online'" [class.glow-danger]="openclawStatus?.status !== 'online'">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" 
                 [class.bg-success-dark/30]="openclawStatus?.status === 'online'"
                 [class.bg-danger-dark/30]="openclawStatus?.status !== 'online'">
              <mat-icon class="text-2xl" [class.text-success-DEFAULT]="openclawStatus?.status === 'online'" [class.text-danger-DEFAULT]="openclawStatus?.status !== 'online'">smart_toy</mat-icon>
            </div>
            <span class="badge" [class.badge-success]="openclawStatus?.status === 'online'" [class.badge-danger]="openclawStatus?.status !== 'online'">
              {{ openclawStatus?.status === 'online' ? 'Online' : 'Offline' }}
            </span>
          </div>
          <div class="metric-value text-lg">OpenClaw Gateway</div>
          <div class="metric-label">Port 18789 • {{ openclawStatus?.timestamp | date:'HH:mm' }}</div>
        </div>

        <!-- CPU Usage -->
        <div class="metric-card">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-primary-900/50 flex items-center justify-center">
              <mat-icon class="text-primary-400 text-2xl">memory</mat-icon>
            </div>
            <span class="badge" [class.badge-success]="cpuInfo?.percent! < 50" [class.badge-warning]="cpuInfo?.percent! >= 50 && cpuInfo?.percent! < 80" [class.badge-danger]="cpuInfo?.percent! >= 80">
              {{ cpuInfo?.percent | number:'1.0-0' }}%
            </span>
          </div>
          <div class="metric-value">{{ cpuInfo?.percent | number:'1.1-1' }}%</div>
          <div class="metric-label">Utilisation CPU</div>
          <div class="mt-3">
            <div class="h-2 bg-dark-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                   [style.width.%]="cpuInfo?.percent || 0"></div>
            </div>
          </div>
        </div>

        <!-- Memory Usage -->
        <div class="metric-card">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center">
              <mat-icon class="text-purple-400 text-2xl">storage</mat-icon>
            </div>
            <span class="badge" [class.badge-success]="memoryInfo?.percent! < 60" [class.badge-warning]="memoryInfo?.percent! >= 60 && memoryInfo?.percent! < 85" [class.badge-danger]="memoryInfo?.percent! >= 85">
              {{ memoryInfo?.percent | number:'1.0-0' }}%
            </span>
          </div>
          <div class="metric-value">{{ memoryInfo?.percent | number:'1.1-1' }}%</div>
          <div class="metric-label">Utilisation Mémoire</div>
          <div class="mt-3">
            <div class="h-2 bg-dark-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                   [style.width.%]="memoryInfo?.percent || 0"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- System Info -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center">
                <mat-icon class="text-primary-400">info</mat-icon>
              </div>
              <div>
                <h3 class="font-semibold text-white">Informations système</h3>
                <p class="text-xs text-dark-400">{{ systemInfo?.hostname }}</p>
              </div>
            </div>
          </div>
          <div class="card-body space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-dark-800/50">
              <span class="text-dark-400">Plateforme</span>
              <span class="text-dark-200 font-medium">{{ systemInfo?.platform }} {{ systemInfo?.architecture }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-dark-800/50">
              <span class="text-dark-400">Processeur</span>
              <span class="text-dark-200 font-medium">{{ cpuInfo?.count_logical }} cœurs</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-dark-800/50">
              <span class="text-dark-400">Mémoire totale</span>
              <span class="text-dark-200 font-medium">{{ memoryInfo?.total }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-dark-800/50">
              <span class="text-dark-400">Python</span>
              <span class="text-dark-200 font-medium">{{ systemInfo?.python_version }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-dark-400">Démarrage</span>
              <span class="text-dark-200 font-medium">{{ systemInfo?.boot_time | date:'short' }}</span>
            </div>
          </div>
        </div>

        <!-- CPU Details -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center">
                <mat-icon class="text-primary-400">speed</mat-icon>
              </div>
              <div>
                <h3 class="font-semibold text-white">Détails CPU</h3>
                <p class="text-xs text-dark-400">Performance en temps réel</p>
              </div>
            </div>
          </div>
          <div class="card-body space-y-4">
            <div *ngIf="cpuInfo?.load_average" class="space-y-2">
              <p class="text-sm text-dark-400 mb-3">Load Average</p>
              <div class="grid grid-cols-3 gap-3">
                <div class="text-center p-3 rounded-lg bg-dark-800/50">
                  <div class="text-lg font-bold text-white">{{ cpuInfo?.load_average?.[0] | number:'1.2-2' }}</div>
                  <div class="text-xs text-dark-500">1m</div>
                </div>
                <div class="text-center p-3 rounded-lg bg-dark-800/50">
                  <div class="text-lg font-bold text-white">{{ cpuInfo?.load_average?.[1] | number:'1.2-2' }}</div>
                  <div class="text-xs text-dark-500">5m</div>
                </div>
                <div class="text-center p-3 rounded-lg bg-dark-800/50">
                  <div class="text-lg font-bold text-white">{{ cpuInfo?.load_average?.[2] | number:'1.2-2' }}</div>
                  <div class="text-xs text-dark-500">15m</div>
                </div>
              </div>
            </div>
            <div *ngIf="cpuInfo?.frequency_mhz" class="pt-4 border-t border-dark-800/50">
              <div class="flex justify-between items-center">
                <span class="text-dark-400">Fréquence</span>
                <span class="text-dark-200 font-medium">{{ cpuInfo?.frequency_mhz | number:'1.0-0' }} MHz</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center">
                <mat-icon class="text-primary-400">bolt</mat-icon>
              </div>
              <div>
                <h3 class="font-semibold text-white">Actions rapides</h3>
                <p class="text-xs text-dark-400">Contrôles système</p>
              </div>
            </div>
          </div>
          <div class="card-body space-y-3">
            <button class="w-full btn-secondary justify-between group">
              <span class="flex items-center gap-3">
                <mat-icon class="text-dark-400 group-hover:text-primary-400 transition-colors">refresh</mat-icon>
                Rafraîchir les données
              </span>
              <mat-icon class="text-dark-600 text-sm">chevron_right</mat-icon>
            </button>
            <button class="w-full btn-secondary justify-between group">
              <span class="flex items-center gap-3">
                <mat-icon class="text-dark-400 group-hover:text-primary-400 transition-colors">assessment</mat-icon>
                Voir les logs système
              </span>
              <mat-icon class="text-dark-600 text-sm">chevron_right</mat-icon>
            </button>
            <button class="w-full btn-secondary justify-between group">
              <span class="flex items-center gap-3">
                <mat-icon class="text-dark-400 group-hover:text-primary-400 transition-colors">settings</mat-icon>
                Configuration
              </span>
              <mat-icon class="text-dark-600 text-sm">chevron_right</mat-icon>
            </button>
            <button class="w-full btn-secondary justify-between group">
              <span class="flex items-center gap-3">
                <mat-icon class="text-dark-400 group-hover:text-danger-DEFAULT transition-colors">logout</mat-icon>
                Redémarrer OpenClaw
              </span>
              <mat-icon class="text-dark-600 text-sm">chevron_right</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Section: OpenClaw Details -->
      <div class="card" *ngIf="openclawInfo">
        <div class="card-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center">
              <mat-icon class="text-primary-400">smart_toy</mat-icon>
            </div>
            <div>
              <h3 class="font-semibold text-white">État OpenClaw</h3>
              <p class="text-xs text-dark-400">Runtime et configuration</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge" [class.badge-success]="openclawStatus?.status === 'online'" [class.badge-danger]="openclawStatus?.status !== 'online'">
              {{ openclawStatus?.status === 'online' ? 'En ligne' : 'Hors ligne' }}
            </span>
          </div>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 rounded-lg bg-dark-800/30">
              <p class="text-xs text-dark-500 uppercase tracking-wider mb-1">Version</p>
              <p class="text-white font-medium">{{ openclawInfo?.version || 'N/A' }}</p>
            </div>
            <div class="p-4 rounded-lg bg-dark-800/30">
              <p class="text-xs text-dark-500 uppercase tracking-wider mb-1">Gateway Port</p>
              <p class="text-white font-medium">{{ openclawInfo?.gateway_port }}</p>
            </div>
            <div class="p-4 rounded-lg bg-dark-800/30">
              <p class="text-xs text-dark-500 uppercase tracking-wider mb-1">Canaux</p>
              <div class="flex gap-2">
                <span *ngFor="let channel of openclawInfo?.channels" class="badge-info">{{ channel }}</span>
                <span *ngIf="!openclawInfo?.channels?.length" class="text-dark-500">-</span>
              </div>
            </div>
            <div class="p-4 rounded-lg bg-dark-800/30">
              <p class="text-xs text-dark-500 uppercase tracking-wider mb-1">Workspace</p>
              <p class="text-white font-medium truncate">~/.openclaw</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  systemInfo: SystemInfo | null = null;
  cpuInfo: CpuInfo | null = null;
  memoryInfo: MemoryInfo | null = null;
  openclawStatus: OpenclawStatus | null = null;
  openclawInfo: any = null;
  currentTime = new Date();

  private subscriptions: Subscription[] = [];

  constructor(
    private systemService: SystemService,
    private openclawService: OpenclawService
  ) {}

  ngOnInit(): void {
    this.loadData();
    
    // Refresh every 5 seconds
    const refreshSub = interval(5000).subscribe(() => {
      this.loadData();
      this.currentTime = new Date();
    });
    this.subscriptions.push(refreshSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData(): void {
    this.systemService.getSystemInfo().subscribe(data => this.systemInfo = data);
    this.systemService.getCpuInfo().subscribe(data => this.cpuInfo = data);
    this.systemService.getMemoryInfo().subscribe(data => this.memoryInfo = data);
    this.openclawService.getStatus().subscribe(data => this.openclawStatus = data);
    this.openclawService.getInfo().subscribe(data => this.openclawInfo = data);
  }
}
