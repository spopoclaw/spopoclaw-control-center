import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { SystemService } from '../../services/system.service';
import { DiskPartition, NetworkInterface, ProcessInfo, ServiceInfo } from '../../models';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatProgressBarModule, MatChipsModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Supervision Système</h2>

      <!-- Disk Usage -->
      <mat-card class="p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <mat-icon class="mr-2">storage</mat-icon>
          Disques
        </h3>
        <table mat-table [dataSource]="diskPartitions" class="w-full">
          <ng-container matColumnDef="device">
            <th mat-header-cell *matHeaderCellDef>Périphérique</th>
            <td mat-cell *matCellDef="let partition">{{ partition.device }}</td>
          </ng-container>

          <ng-container matColumnDef="mountpoint">
            <th mat-header-cell *matHeaderCellDef>Point de montage</th>
            <td mat-cell *matCellDef="let partition">{{ partition.mountpoint }}</td>
          </ng-container>

          <ng-container matColumnDef="fstype">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let partition">{{ partition.fstype }}</td>
          </ng-container>

          <ng-container matColumnDef="usage">
            <th mat-header-cell *matHeaderCellDef>Utilisation</th>
            <td mat-cell *matCellDef="let partition">
              <div class="flex items-center">
                <span class="mr-2">{{ partition.percent }}%</span>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="partition.percent"
                  [color]="partition.percent > 90 ? 'warn' : 'primary'"
                  class="w-24">
                </mat-progress-bar>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="size">
            <th mat-header-cell *matHeaderCellDef>Taille</th>
            <td mat-cell *matCellDef="let partition">{{ partition.total }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="diskColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: diskColumns;"></tr>
        </table>
      </mat-card>

      <!-- Network Interfaces -->
      <mat-card class="p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <mat-icon class="mr-2">network_check</mat-icon>
          Interfaces réseau
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let iface of networkInterfaces" class="border rounded-lg p-4">
            <div class="flex items-center mb-2">
              <mat-icon class="mr-2 text-primary-600">wifi</mat-icon>
              <span class="font-semibold">{{ iface.name }}</span>
            </div>
            <div class="text-sm space-y-1">
              <div *ngFor="let addr of iface.addresses">
                <span class="text-gray-500">{{ addr.family }}:</span> {{ addr.address }}
              </div>
              <div class="mt-2 pt-2 border-t text-xs text-gray-500">
                <span>RX: {{ formatBytes(iface.bytes_recv) }}</span>
                <span class="mx-2">|</span>
                <span>TX: {{ formatBytes(iface.bytes_sent) }}</span>
              </div>
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Services -->
      <mat-card class="p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <mat-icon class="mr-2">miscellaneous_services</mat-icon>
          Services
        </h3>
        <div class="flex flex-wrap gap-2">
          <mat-chip-listbox>
            <mat-chip *ngFor="let service of services" 
                      [color]="service.status === 'running' ? 'primary' : 'warn'"
                      selected="{{ service.status === 'running' }}">
              <mat-icon matChipAvatar *ngIf="service.status === 'running'">check_circle</mat-icon>
              <mat-icon matChipAvatar *ngIf="service.status !== 'running'">error</mat-icon>
              {{ service.name }}
            </mat-chip>
          </mat-chip-listbox>
        </div>
      </mat-card>

      <!-- Top Processes -->
      <mat-card class="p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <mat-icon class="mr-2">view_list</mat-icon>
          Processus actifs (Top CPU)
        </h3>
        <table mat-table [dataSource]="processes" class="w-full">
          <ng-container matColumnDef="pid">
            <th mat-header-cell *matHeaderCellDef>PID</th>
            <td mat-cell *matCellDef="let proc">{{ proc.pid }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let proc">{{ proc.name }}</td>
          </ng-container>

          <ng-container matColumnDef="cpu">
            <th mat-header-cell *matHeaderCellDef>CPU %</th>
            <td mat-cell *matCellDef="let proc">{{ proc.cpu_percent | number:'1.1-1' }}</td>
          </ng-container>

          <ng-container matColumnDef="memory">
            <th mat-header-cell *matHeaderCellDef>Mémoire %</th>
            <td mat-cell *matCellDef="let proc">{{ proc.memory_percent | number:'1.1-1' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="processColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: processColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `
})
export class SystemComponent implements OnInit {
  diskPartitions: DiskPartition[] = [];
  networkInterfaces: NetworkInterface[] = [];
  services: ServiceInfo[] = [];
  processes: ProcessInfo[] = [];

  diskColumns = ['device', 'mountpoint', 'fstype', 'usage', 'size'];
  processColumns = ['pid', 'name', 'cpu', 'memory'];

  constructor(private systemService: SystemService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.systemService.getDiskInfo().subscribe(data => this.diskPartitions = data.partitions);
    this.systemService.getNetworkInfo().subscribe(data => this.networkInterfaces = data.interfaces);
    this.systemService.getServices().subscribe(data => this.services = data.services);
    this.systemService.getProcesses(15).subscribe(data => this.processes = data.processes);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
