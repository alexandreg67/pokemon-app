import { Component, Input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PokemonStat } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="stats-card">
      <mat-card-header>
        <mat-card-title>Statistiques de base</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="stats-list">
          @for (stat of stats; track stat.stat.name) {
            <div class="stat-item">
              <div class="stat-info">
                <span class="stat-name">{{ getStatDisplayName(stat.stat.name) }}</span>
                <span class="stat-value">{{ stat.base_stat }}</span>
              </div>
              <div class="stat-bar-container">
                <mat-progress-bar
                  mode="determinate"
                  [value]="getStatPercentage(stat.base_stat)"
                  [class]="getStatColorClass(stat.base_stat)">
                </mat-progress-bar>
              </div>
            </div>
          }
        </div>
        
        <div class="total-stats">
          <strong>Total: {{ totalStats() }}</strong>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stats-card {
      border-radius: 16px;
      background: var(--mat-sys-surface-container-high);
      
      mat-card-header {
        margin-bottom: 16px;
        
        .mat-mdc-card-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--mat-sys-on-surface);
        }
      }
    }

    .stats-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .stat-item {
        .stat-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          
          .stat-name {
            font-weight: 500;
            color: var(--mat-sys-on-surface);
          }
          
          .stat-value {
            font-weight: 600;
            color: var(--mat-sys-primary);
            font-size: 1.1rem;
          }
        }
        
        .stat-bar-container {
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          background-color: var(--mat-sys-surface-container-low);
          
          mat-progress-bar {
            height: 100%;
            border-radius: 4px;
            
            &.stat-excellent ::ng-deep .mdc-linear-progress__bar-inner {
              background-color: #51cf66;
            }
            &.stat-good ::ng-deep .mdc-linear-progress__bar-inner {
              background-color: #74c0fc;
            }
            &.stat-average ::ng-deep .mdc-linear-progress__bar-inner {
              background-color: #ffd43b;
            }
            &.stat-low ::ng-deep .mdc-linear-progress__bar-inner {
              background-color: #ff8787;
            }
          }
        }
      }
    }

    .total-stats {
      margin-top: 20px;
      padding: 16px;
      background: linear-gradient(135deg, 
        var(--mat-sys-primary-container) 0%, 
        var(--mat-sys-secondary-container) 100%);
      border-radius: 12px;
      text-align: center;
      font-size: 1.1rem;
      color: var(--mat-sys-on-primary-container);
    }
  `]
})
export class PokemonStatsComponent {
  @Input({ required: true }) stats!: PokemonStat[];

  // Computed signal pour le total des statistiques
  readonly totalStats = computed(() => {
    return this.stats?.reduce((total, stat) => total + stat.base_stat, 0) || 0;
  });

  getStatDisplayName(statName: string): string {
    const statMap: { [key: string]: string } = {
      'hp': 'PV',
      'attack': 'Attaque',
      'defense': 'Défense',
      'special-attack': 'Att. Spé.',
      'special-defense': 'Déf. Spé.',
      'speed': 'Vitesse'
    };
    return statMap[statName] || statName;
  }

  getStatPercentage(value: number): number {
    // Normalise la stat sur une échelle de 0-100 (max théorique ~255)
    return Math.min((value / 255) * 100, 100);
  }

  getStatColorClass(value: number): string {
    if (value >= 100) return 'stat-excellent';
    if (value >= 80) return 'stat-good';
    if (value >= 60) return 'stat-average';
    return 'stat-low';
  }
}