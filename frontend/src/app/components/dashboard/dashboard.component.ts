import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SystemService } from '../../services/system.service';
import { OpenclawService } from '../../services/openclaw.service';
import { SystemInfo, CpuInfo, MemoryInfo, OpenclawStatus } from '../../models';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">Tableau de bord</h2>
        <span class="text-sm text-gray-500">{{ currentTime | date:'medium' }}</span>
      </div>

      <!-- Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- System Status -->
        <mat-card class="p-4">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <mat-icon class="text-green-600">computer</mat-icon>
            </div>
            <div>
              <p class="text-sm text-gray-500">Système</p>
              <p class="text-lg font-semibold text-green-600">En ligne</p>
              <p class="text-xs text-gray-400">{{ systemInfo?.uptime_formatted }}</p>
            </div>
          </div>
        </mat-card>

        <!-- OpenClaw Status -->
        <mat-card class="p-4">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                 [class.bg-green-100]="openclawStatus?.status === 'online'"
                 [class.bg-red-100]="openclawStatus?.status !== 'online'">
              <mat-icon class="text-green-600" *ngIf="openclawStatus?.status === 'online'">smart_toy</mat-icon>
              <mat-icon class="text-red-600" *ngIf="openclawStatus?.status !== 'online'">smart_toy</mat-icon>
            </div>
            <div>
              <p class="text-sm text-gray-500">OpenClaw</p>
              <p class="text-lg font-semibold" 
                 [class.text-green-600]="openclawStatus?.status === 'online'"
                 [class.text-red-600]="openclawStatus?.status !== 'online'">
                {{ openclawStatus?.status === 'online' ? 'En ligne' : 'Hors ligne' }}
              </p>
              <p class="text-xs text-gray-400">Port 18789</p>
            </div>
          </div>
        </mat-card>

        <!-- CPU -->
        <mat-card class="p-4">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <mat-icon class="text-blue-600">memory</mat-icon>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">CPU</p>
              <p class="text-lg font-semibold">{{ cpuInfo?.percent | number:'1.0-1' }}%</p>
              <mat-progress-bar mode="determinate" [value]="cpuInfo?.percent || 0"></mat-progress-bar>
            </div>
          </div>
        </mat-card>

        <!-- Memory -->
        <mat-card class="p-4">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <mat-icon class="text-purple-600">sd_storage</mat-icon>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Mémoire</p>
              <p class="text-lg font-semibold">{{ memoryInfo?.percent | number:'1.0-1' }}%</p>
              <mat-progress-bar mode="determinate" [value]="memoryInfo?.percent || 0" color="accent"></mat-progress-bar>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- System Info -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <mat-icon class="mr-2">info</mat-icon>
            Informations système
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Hostname:</span>
              <span>{{ systemInfo?.hostname }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">OS:</span>
              <span>{{ systemInfo?.platform }} {{ systemInfo?.platform_version }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Architecture:</span>
              <span>{{ systemInfo?.architecture }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Python:</span>
              <span>{{ systemInfo?.python_version }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Boot:</span>
              <span>{{ systemInfo?.boot_time | date:'short' }}</span>
            </div>
          </div>
        </mat-card>

        <!-- Quick Stats -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <mat-icon class="mr-2">speed</mat-icon>
            Ressources
          </h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-500">CPU Cores</span>
                <span>{{ cpuInfo?.count_physical }} physiques / {{ cpuInfo?.count_logical }} logiques</span>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-500">Mémoire totale</span>
                <span>{{ memoryInfo?.total }}</span>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-500">Mémoire disponible</span>
                <span>{{ memoryInfo?.available }}</span>
              </div>
            </div>
            <div *ngIf="cpuInfo?.load_average">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-500">Load Average</span>
                <span>{{ cpuInfo?.load_average?.[0] | number:'1.2-2' }} | 
                      {{ cpuInfo?.load_average?.[1] | number:'1.2-2' }} | 
                      {{ cpuInfo?.load_average?.[2] | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  systemInfo: SystemInfo | null = null;
  cpuInfo: CpuInfo | null = null;
  memoryInfo: MemoryInfo | null = null;
  openclawStatus: OpenclawStatus | null = null;
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
  }
}
