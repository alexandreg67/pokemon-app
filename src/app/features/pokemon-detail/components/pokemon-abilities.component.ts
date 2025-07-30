import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { PokemonAbility } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-abilities',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="abilities-card">
      <mat-card-header>
        <mat-card-title>Capacités</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="abilities-list">
          @for (abilityInfo of abilities; track abilityInfo.ability.name) {
            <div class="ability-item" [class.hidden]="abilityInfo.is_hidden">
              <div class="ability-name">
                {{ abilityInfo.ability.name | titlecase }}
                @if (abilityInfo.is_hidden) {
                  <mat-chip color="accent" class="hidden-chip">Cachée</mat-chip>
                }
              </div>
              <div class="ability-slot">Slot {{ abilityInfo.slot }}</div>
            </div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .abilities-card {
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

    .abilities-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .ability-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: var(--mat-sys-surface-container);
        border-radius: 12px;
        border-left: 4px solid var(--mat-sys-primary);
        
        &.hidden {
          border-left-color: var(--mat-sys-secondary);
          background: var(--mat-sys-secondary-container);
        }
        
        .ability-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: var(--mat-sys-on-surface);
          
          .hidden-chip {
            font-size: 0.75rem;
          }
        }
        
        .ability-slot {
          color: var(--mat-sys-on-surface-variant);
          font-size: 0.875rem;
        }
      }
    }
  `]
})
export class PokemonAbilitiesComponent {
  @Input({ required: true }) abilities!: PokemonAbility[];
}