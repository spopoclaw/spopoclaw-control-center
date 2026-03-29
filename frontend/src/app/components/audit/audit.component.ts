import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AuditService } from '../../services/openclaw.service';
import { AuditEvent } from '../../models';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule],
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
              <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    [class.bg-blue-100]="event.type === 'system'"
                    [class.text-blue-800]="event.type === 'system'"
                    [class.bg-red-100]="event.type === 'error'"
                    [class.text-red-800]="event.type === 'error'"
                    [class.bg-purple-100]="event.type === 'auth'"
                    [class.text-purple-800]="event.type === 'auth'"
                    [class.bg-gray-100]="event.type !== 'system' && event.type !== 'error' && event.type !== 'auth'"
                    [class.text-gray-800]="event.type !== 'system' && event.type !== 'error' && event.type !== 'auth'">
                {{ event.type }}
              </span>
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
}
