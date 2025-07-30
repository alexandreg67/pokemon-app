import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface PokemonSprites {
  front_default: string;
  front_shiny?: string;
  other?: {
    'official-artwork'?: {
      front_default: string;
    };
  };
}

@Component({
  selector: 'app-pokemon-sprites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="sprites-card">
      <mat-card-header>
        <mat-card-title>Sprites</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="sprites-grid">
          @if (sprites.front_default || '') {
            <div class="sprite-item">
              <img [src]="sprites.front_default || ''"
                   [alt]="pokemonName + ' face'"
                   loading="lazy">
              <span>Face normale</span>
            </div>
          }
          @if (sprites.front_shiny) {
            <div class="sprite-item">
              <img [src]="sprites.front_shiny"
                   [alt]="pokemonName + ' face shiny'"
                   loading="lazy">
              <span>Face shiny</span>
            </div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .sprites-card {
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

    .sprites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      
      .sprite-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        background: var(--mat-sys-surface-container);
        border-radius: 12px;
        text-align: center;
        
        img {
          width: 96px;
          height: 96px;
          object-fit: contain;
          margin-bottom: 8px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        span {
          font-size: 0.875rem;
          color: var(--mat-sys-on-surface-variant);
          font-weight: 500;
        }
      }
    }
  `]
})
export class PokemonSpritesComponent {
  @Input({ required: true }) sprites!: PokemonSprites;
  @Input({ required: true }) pokemonName!: string;
}