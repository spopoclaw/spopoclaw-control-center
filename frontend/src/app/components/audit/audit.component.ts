import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuditService } from '../../services/openclaw.service';
import { AuditEvent } from '../../models';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatChipsModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Journal d'audit</h2>

      <mat-card class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold flex items-center">
            <mat-icon class="mr-2">history</mat-icon>
            Événements récents
          </h3>
          <span class="text-sm text-gray-500">Total: {{ totalEvents }}</span>
        </div>

        <table mat-table [dataSource]="events" class="w-full">
          <ng-container matColumnDef="timestamp">
            <th mat-header-cell *matHeaderCellDef>Date/Heure</th>
            <td mat-cell *matCellDef="let event">
              {{ event.timestamp | date:'short' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let event">
              <mat-chip [color]="getEventColor(event.type)" selected>
                {{ event.type }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let event">
              {{ event.description }}
            </td>
          </ng-container>

          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef>Utilisateur</th>
            <td mat-cell *matCellDef="let event">
              {{ event.user || 'Système' }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="!events.length" class="text-center py-8 text-gray-500">
          <mat-icon class="text-4xl mb-2">inbox</mat-icon>
          <p>Aucun événement enregistré</p>
        </div>
      </mat-card>
    </div>
  `
})
export class AuditComponent implements OnInit {
  events: AuditEvent[] = [];
  totalEvents = 0;
  displayedColumns = ['timestamp', 'type', 'description', 'user'];

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.auditService.getEvents(50).subscribe(data => {
      this.events = data.events;
      this.totalEvents = data.total;
    });
  }

  getEventColor(type: string): string {
    switch (type) {
      case 'system': return 'primary';
      case 'error': return 'warn';
      case 'auth': return 'accent';
      default: return '';
    }
  }
}
