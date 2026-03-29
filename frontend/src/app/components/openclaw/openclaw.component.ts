import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { OpenclawService } from '../../services/openclaw.service';
import { OpenclawStatus } from '../../models';

@Component({
  selector: 'app-openclaw',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, MatListModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Supervision OpenClaw</h2>

      <!-- Status Card -->
      <mat-card class="p-6" [class.border-l-4]="true" 
                [class.border-green-500]="openclawStatus?.status === 'online'"
                [class.border-red-500]="openclawStatus?.status !== 'online'">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                 [class.bg-green-100]="openclawStatus?.status === 'online'"
                 [class.bg-red-100]="openclawStatus?.status !== 'online'">
              <mat-icon class="text-4xl" 
                       [class.text-green-600]="openclawStatus?.status === 'online'"
                       [class.text-red-600]="openclawStatus?.status !== 'online'">
                {{ openclawStatus?.status === 'online' ? 'check_circle' : 'error' }}
              </mat-icon>
            </div>
            <div>
              <h3 class="text-xl font-semibold">Gateway OpenClaw</h3>
              <p class="text-lg" 
                 [class.text-green-600]="openclawStatus?.status === 'online'"
                 [class.text-red-600]="openclawStatus?.status !== 'online'">
                {{ openclawStatus?.status === 'online' ? 'En ligne' : 'Hors ligne' }}
              </p>
              <p class="text-sm text-gray-500">{{ openclawStatus?.gateway_url }}</p>
            </div>
          </div>
          <div class="text-right text-sm text-gray-500">
            <p>Dernière vérification:</p>
            <p>{{ openclawStatus?.timestamp | date:'medium' }}</p>
          </div>
        </div>
      </mat-card>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" *ngIf="openclawInfo">
        <!-- Configuration -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <mat-icon class="mr-2">settings</mat-icon>
            Configuration
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Version:</span>
              <span>{{ openclawInfo?.version || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Gateway Port:</span>
              <span>{{ openclawInfo?.gateway_port }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Workspace:</span>
              <span class="text-xs">{{ openclawInfo?.workspace }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Config:</span>
              <span class="text-xs">{{ openclawInfo?.config_path }}</span>
            </div>
          </div>
        </mat-card>

        <!-- Channels -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <mat-icon class="mr-2">chat</mat-icon>
            Canaux configurés
          </h3>
          <div class="flex flex-wrap gap-2">
            <mat-chip *ngFor="let channel of openclawInfo?.channels" color="primary" selected>
              {{ channel }}
            </mat-chip>
            <p *ngIf="!openclawInfo?.channels?.length" class="text-gray-500 italic">
              Aucun canal configuré
            </p>
          </div>
        </mat-card>
      </div>

      <!-- Recent Logs -->
      <mat-card class="p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <mat-icon class="mr-2">article</mat-icon>
          Journaux récents
        </h3>
        <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
          <div *ngFor="let log of logs" class="py-1">
            {{ log }}
          </div>
          <p *ngIf="!logs?.length" class="text-gray-500">
            Aucun journal disponible
          </p>
        </div>
      </mat-card>
    </div>
  `
})
export class OpenclawComponent implements OnInit {
  openclawStatus: OpenclawStatus | null = null;
  openclawInfo: any = null;
  logs: string[] = [];

  constructor(private openclawService: OpenclawService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.openclawService.getStatus().subscribe(data => this.openclawStatus = data);
    this.openclawService.getInfo().subscribe(data => this.openclawInfo = data);
    this.openclawService.getLogs(30).subscribe(data => this.logs = data.logs);
  }
}
