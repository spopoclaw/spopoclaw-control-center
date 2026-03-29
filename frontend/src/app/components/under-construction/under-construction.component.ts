import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div class="w-24 h-24 rounded-2xl bg-dark-800 flex items-center justify-center mb-6">
        <mat-icon class="text-5xl text-primary-400">construction</mat-icon>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">En développement</h2>
      <p class="text-dark-400 text-center max-w-md">
        La page <span class="text-primary-400">{{ title }}</span> est en cours de construction.
        Cette fonctionnalité sera disponible prochainement.
      </p>
    </div>
  `
})
export class UnderConstructionComponent {
  private route = inject(ActivatedRoute);
  title = this.route.snapshot.data['title'] || 'Cette page';
}
