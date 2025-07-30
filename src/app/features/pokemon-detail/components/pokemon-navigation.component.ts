import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="navigation-card">
      <button mat-raised-button
              [disabled]="pokemonId <= 1"
              (click)="onNavigateToPrevious()"
              class="nav-button prev">
        <mat-icon>chevron_left</mat-icon>
        Précédent
      </button>
      
      <button mat-raised-button
              color="primary"
              routerLink="/pokemon"
              class="nav-button list">
        <mat-icon>list</mat-icon>
        Retour à la liste
      </button>
      
      <button mat-raised-button
              [disabled]="pokemonId >= 1000"
              (click)="onNavigateToNext()"
              class="nav-button next">
        Suivant
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .navigation-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: var(--mat-sys-surface-container-high);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      
      @media (max-width: 480px) {
        flex-direction: column;
        gap: 12px;
        
        .nav-button {
          width: 100%;
        }
      }
      
      .nav-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 500;
        
        &.prev,
        &.next {
          min-width: 140px;
        }
        
        &.list {
          min-width: 160px;
        }
      }
    }
  `]
})
export class PokemonNavigationComponent {
  @Input({ required: true }) pokemonId!: number;
  @Output() navigateToPokemon = new EventEmitter<number>();

  onNavigateToPrevious(): void {
    if (this.pokemonId > 1) {
      this.navigateToPokemon.emit(this.pokemonId - 1);
    }
  }

  onNavigateToNext(): void {
    if (this.pokemonId < 1000) {
      this.navigateToPokemon.emit(this.pokemonId + 1);
    }
  }
}