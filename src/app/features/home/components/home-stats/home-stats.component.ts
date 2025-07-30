import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stats-section">
      <h2>Statistiques du Pokédex</h2>
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">catching_pokemon</mat-icon>
              <div class="stat-info">
                <span class="stat-number">{{ totalPokemons }}</span>
                <span class="stat-label">Pokémon découverts</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon" color="warn">favorite</mat-icon>
              <div class="stat-info">
                <span class="stat-number">{{ favoritesCount }}</span>
                <span class="stat-label">Favoris</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon" color="accent">category</mat-icon>
              <div class="stat-info">
                <span class="stat-number">{{ availableTypesCount }}</span>
                <span class="stat-label">Types disponibles</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
  `,
  styleUrls: ['./home-stats.component.scss']
})
export class HomeStatsComponent {
  @Input() totalPokemons: number = 0;
  @Input() favoritesCount: number = 0;
  @Input() availableTypesCount: number = 0;
}