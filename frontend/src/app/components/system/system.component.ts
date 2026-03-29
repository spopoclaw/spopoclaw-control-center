import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SystemService } from '../../services/system.service';
import { DiskPartition, NetworkInterface, ProcessInfo, ServiceInfo } from '../../models';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">Supervision Système</h2>
          <p class="text-dark-400 mt-1">Métriques et ressources système</p>
        </div>
        <button class="btn-secondary gap-2" (click)="loadData()">
          <mat-icon class="text-sm">refresh</mat-icon>
          Rafraîchir
        </button>
      </div>

      <!-- Disk Usage -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center">
              <mat-icon class="text-primary-400">storage</mat-icon>
            </div>
            <div>
              <h3 class="font-semibold text-white">Stockage</h3>
              <p class="text-xs text-dark-400">Partitions et utilisation disque</p>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Périphérique</th>
                <th>Point de montage</th>
                <th>Type</th>
                <th>Utilisation</th>
                <th>Taille</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let partition of diskPartitions">
                <td class="font-mono text-dark-300">{{ partition.device }}</td>
                <td>{{ partition.mountpoint }}</td>
                <td><span class="badge bg-dark-800 text-dark-300">{{ partition.fstype }}</span></td>
                <td>
                  <div class="flex items-center gap-3">
                    <span class="text-dark-200 w-12">{{ partition.percent }}%</span>
                    <div class="w-24 h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500"
                           [class.bg-success-DEFAULT]="partition.percent < 70"
                           [class.bg-warning-DEFAULT]="partition.percent >= 70 && partition.percent < 90"
                           [class.bg-danger-DEFAULT]="partition.percent >= 90"
                           [style.width.%]="partition.percent"></div>
                    </div>
                  </div>
                </td>
                <td class="text-dark-300">{{ partition.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Network & Services Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Network Interfaces -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center">
                <mat-icon class="text-primary-400">network_check</mat-icon>
              </div>
              <div>
                <h3 class="font-semibold text-white">Réseau</h3>
                <p class="text-xs text-dark-400">Interfaces et statistiques</p>
              </div>
            </div>
          </div>
          <div class="card-body space-y-4 max-h-96 overflow-y-auto">
            <div *ngFor="let iface of networkInterfaces" class="p-4 rounded-lg bg-dark-800/30 border border-dark-800">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-primary-400">wifi</mat-icon>
                  <span class="font-semibold text-white">{{ iface.name }}</span>
                </div>
              </div>
              <div class="space-y-1 text-sm">
                <div *ngFor="let addr of iface.addresses" class="flex justify-between">
                  <span class="text-dark-500">{{ addr.family }}:</span>
                  <span class="text-dark-300 font-mono">{{ addr.address }}</span>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-dark-800 flex justify-between text-xs">
                <span class="text-success-DEFAULT">↓ {{ formatBytes(iface.bytes_recv) }}</span>
                <span class="text-primary-400">↑ {{ formatBytes(iface.bytes_sent) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center">
                <mat-icon class="text-primary-400">miscellaneous_services</mat-icon>
              </div>
              <div>
                <h3 class="font-semibold text-white">Services</h3>
                <p class="text-xs text-dark-400">État des services système</p>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-2 gap-3">
              <div *ngFor="let service of services" 
                   class="flex items-center gap-3 p-3 rounded-lg border"
                   [style.background-color]="service.status === 'running' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'"
                   [style.border-color]="service.status === 'running' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'">
                <div class="w-2 h-2 rounded-full"
                     [class.bg-success-DEFAULT]="service.status === 'running'"
                     [class.bg-danger-DEFAULT]="service.status !== 'running'"
                     [class.animate-pulse]="service.status === 'running'"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">{{ service.name }}</p>
                  <p class="text-xs" [class.text-success-light]="service.status === 'running'" [class.text-danger-light]="service.status !== 'running'">
                    {{ service.status === 'running' ? 'En cours' : 'Arrêté' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SystemComponent implements OnInit {
  diskPartitions: DiskPartition[] = [];
  networkInterfaces: NetworkInterface[] = [];
  services: ServiceInfo[] = [];

  constructor(private systemService: SystemService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.systemService.getDiskInfo().subscribe(data => this.diskPartitions = data.partitions);
    this.systemService.getNetworkInfo().subscribe(data => this.networkInterfaces = data.interfaces);
    this.systemService.getServices().subscribe(data => this.services = data.services);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
