import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Pokemon } from '../../../core/models/pokemon.model';
import { PokemonBorder } from '../../../directives/pokemon-border';

@Component({
  selector: 'app-pokemon-hero',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    PokemonBorder
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="hero-card">
      <div class="hero-content">
        <div class="pokemon-image-section">
          @if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
            @if (pokemon.types && pokemon.types.length > 0) {
              <img [src]="pokemon.sprites?.other?.['official-artwork']?.front_default || ''"
                   [alt]="pokemon.name"
                   class="main-image"
                   loading="eager"
                   [appPokemonBorder]="pokemon.types[0].type.name">
            }
          } @else if (pokemon.sprites?.front_default) {
            @if (pokemon.types && pokemon.types.length > 0) {
              <img [src]="pokemon.sprites?.front_default || ''"
                   [alt]="pokemon.name"
                   class="main-image"
                   loading="eager"
                   [appPokemonBorder]="pokemon.types[0].type.name">
            }
          } @else {
            <div class="no-image">
              <mat-icon>catching_pokemon</mat-icon>
            </div>
          }
        </div>

        <div class="pokemon-info-section">
          <h1>{{ pokemon.name | titlecase }}</h1>
          <div class="basic-info">
            @if (pokemon.types) {
              <div class="types">
                <h3>Types</h3>
                <div class="type-chips">
                  @for (typeInfo of pokemon.types; track typeInfo.type.name) {
                    <mat-chip [class]="'type-' + typeInfo.type.name">
                      {{ typeInfo.type.name | titlecase }}
                    </mat-chip>
                  }
                </div>
              </div>
            }

            <div class="measurements">
              @if (pokemon.height) {
                <div class="measurement">
                  <span class="label">Taille</span>
                  <span class="value">{{ (pokemon.height / 10).toFixed(1) }} m</span>
                </div>
              }
              @if (pokemon.weight) {
                <div class="measurement">
                  <span class="label">Poids</span>
                  <span class="value">{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
                </div>
              }
              @if (pokemon.base_experience) {
                <div class="measurement">
                  <span class="label">Exp. de base</span>
                  <span class="value">{{ pokemon.base_experience }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .hero-card {
      margin-bottom: 24px;
      border-radius: 24px;
      overflow: hidden;
      background: var(--mat-sys-surface-container-high);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      
      .hero-content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 32px;
        padding: 32px;
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          gap: 24px;
          padding: 24px;
          text-align: center;
        }
        
        @media (max-width: 480px) {
          padding: 16px;
          gap: 16px;
        }
      }
    }

    .pokemon-image-section {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, 
        var(--mat-sys-primary-container) 0%, 
        var(--mat-sys-secondary-container) 100%);
      border-radius: 20px;
      min-height: 250px;
      position: relative;
      overflow: hidden;
      
      .main-image {
        max-width: 200px;
        max-height: 200px;
        object-fit: contain;
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
        animation: float 3s ease-in-out infinite;
        
        @media (max-width: 480px) {
          max-width: 150px;
          max-height: 150px;
        }
      }
      
      .no-image {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--mat-sys-on-primary-container);
        opacity: 0.6;
        
        mat-icon {
          font-size: 80px;
          width: 80px;
          height: 80px;
        }
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .pokemon-info-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 24px;
      
      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        color: var(--mat-sys-on-surface);
        background: linear-gradient(45deg, var(--mat-sys-primary), var(--mat-sys-secondary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        
        @media (max-width: 480px) {
          font-size: 2rem;
        }
      }
    }

    .basic-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      .types {
        h3 {
          margin: 0 0 8px 0;
          color: var(--mat-sys-on-surface);
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .type-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          
          mat-chip {
            font-weight: 600;
            font-size: 0.9rem;
            
            // Types colors
            &.type-fire { background-color: #ff6b6b; color: white; }
            &.type-water { background-color: #4ecdc4; color: white; }
            &.type-grass { background-color: #51cf66; color: white; }
            &.type-electric { background-color: #ffd43b; color: #333; }
            &.type-psychic { background-color: #da77f2; color: white; }
            &.type-ice { background-color: #74c0fc; color: white; }
            &.type-dragon { background-color: #845ef7; color: white; }
            &.type-dark { background-color: #495057; color: white; }
            &.type-fairy { background-color: #f783ac; color: white; }
            &.type-normal { background-color: #adb5bd; color: white; }
            &.type-fighting { background-color: #f76707; color: white; }
            &.type-poison { background-color: #9775fa; color: white; }
            &.type-ground { background-color: #fab005; color: white; }
            &.type-flying { background-color: #91a7ff; color: white; }
            &.type-bug { background-color: #8ce99a; color: white; }
            &.type-rock { background-color: #868e96; color: white; }
            &.type-ghost { background-color: #6c5ce7; color: white; }
            &.type-steel { background-color: #ced4da; color: #333; }
          }
        }
      }
      
      .measurements {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 16px;
        
        .measurement {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: var(--mat-sys-surface-container);
          border-radius: 12px;
          text-align: center;
          
          .label {
            font-size: 0.875rem;
            color: var(--mat-sys-on-surface-variant);
            margin-bottom: 4px;
            font-weight: 500;
          }
          
          .value {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--mat-sys-on-surface);
          }
        }
      }
    }
  `]
})
export class PokemonHeroComponent {
  @Input({ required: true }) pokemon!: Pokemon;
}