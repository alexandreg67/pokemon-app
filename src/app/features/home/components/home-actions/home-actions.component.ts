import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-actions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="actions-section">
      <h2>Actions Rapides</h2>
      <div class="actions-grid">
        <mat-card class="action-card" routerLink="/pokemon">
          <mat-card-content>
            <mat-icon class="action-icon">list</mat-icon>
            <h3>Parcourir Tous</h3>
            <p>Explorez la liste complète des Pokémon avec filtres avancés</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card" routerLink="/favorites">
          <mat-card-content>
            <mat-icon class="action-icon" color="warn">favorite</mat-icon>
            <h3>Mes Favoris</h3>
            <p>Accédez rapidement à vos Pokémon préférés</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card" (click)="onRandomPokemonClick()">
          <mat-card-content>
            <mat-icon class="action-icon" color="accent">shuffle</mat-icon>
            <h3>Pokémon Aléatoire</h3>
            <p>Découvrez un Pokémon choisi au hasard</p>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
  `,
  styleUrls: ['./home-actions.component.scss']
})
export class HomeActionsComponent {
  @Output() randomPokemon = new EventEmitter<void>();

  onRandomPokemonClick(): void {
    this.randomPokemon.emit();
  }
}