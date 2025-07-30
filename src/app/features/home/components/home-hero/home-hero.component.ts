import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Bienvenue dans le Pokédex</h1>
          <p>Découvrez l'univers fantastique des Pokémon ! Explorez les statistiques, capacités et détails de vos créatures préférées.</p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" size="large" routerLink="/pokemon">
              <mat-icon>explore</mat-icon>
              Explorer les Pokémon
            </button>
            <button mat-outlined-button routerLink="/favorites">
              <mat-icon>favorite</mat-icon>
              Mes Favoris ({{ favoritesCount }})
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="pokeball-animation">
            <div class="pokeball">
              <div class="pokeball-top"></div>
              <div class="pokeball-middle"></div>
              <div class="pokeball-bottom"></div>
              <div class="pokeball-center"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./home-hero.component.scss']
})
export class HomeHeroComponent {
  @Input() favoritesCount: number = 0;
}