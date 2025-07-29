import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';

import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon } from '../../core/models/pokemon.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatGridListModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home-container">
      <!-- Hero Section -->
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
                Mes Favoris ({{ favoritesCount() }})
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

      <!-- Statistics Section -->
      <section class="stats-section">
        <h2>Statistiques du Pokédex</h2>
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">catching_pokemon</mat-icon>
                <div class="stat-info">
                  <span class="stat-number">{{ totalPokemons() }}</span>
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
                  <span class="stat-number">{{ favoritesCount() }}</span>
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
                  <span class="stat-number">{{ availableTypesCount() }}</span>
                  <span class="stat-label">Types disponibles</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- Featured Pokemon Section -->
      <section class="featured-section">
        <h2>Pokémon Populaires</h2>
        @if (isLoading()) {
          <div class="loading-container">
            <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
            <p>Chargement des Pokémon populaires...</p>
          </div>
        } @else {
          <div class="featured-grid">
            @for (pokemon of featuredPokemons(); track pokemon.id) {
              <mat-card class="featured-card" [routerLink]="'/pokemon/' + pokemon.id">
                <div class="featured-image-container">
                  @if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
                    <img [src]="pokemon.sprites?.other?.['official-artwork']?.front_default || ''"
                         [alt]="pokemon.name"
                         class="featured-image"
                         loading="lazy">
                  } @else if (pokemon.sprites?.front_default) {
                    <img [src]="pokemon.sprites?.front_default || ''"
                         [alt]="pokemon.name"
                         class="featured-image"
                         loading="lazy">
                  } @else {
                    <div class="no-image">
                      <mat-icon>catching_pokemon</mat-icon>
                    </div>
                  }
                </div>
                
                <mat-card-content>
                  <h3>{{ pokemon.name | titlecase }}</h3>
                  <p class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
                  
                  <div class="types-container">
                    @for (typeInfo of pokemon.types; track typeInfo.type.name) {
                      <mat-chip [class]="'type-' + typeInfo.type.name">
                        {{ typeInfo.type.name | titlecase }}
                      </mat-chip>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>
        }
      </section>

      <!-- Quick Actions Section -->
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

          <mat-card class="action-card" (click)="showRandomPokemon()">
            <mat-card-content>
              <mat-icon class="action-icon" color="accent">shuffle</mat-icon>
              <h3>Pokémon Aléatoire</h3>
              <p>Découvrez un Pokémon choisi au hasard</p>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- Types Section -->
      <section class="types-section">
        <h2>Explorer par Type</h2>
        <div class="types-grid">
          @for (type of popularTypes(); track type) {
            <button 
              class="type-button"
              [class]="'type-' + type"
              [routerLink]="'/pokemon'"
              [queryParams]="{type: type}">
              {{ type | titlecase }}
            </button>
          }
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);

  // Signals from service
  readonly pokemons = this.pokemonService.pokemons;
  readonly favorites = this.pokemonService.favorites;
  readonly isLoading = this.pokemonService.isLoading;

  // Computed values
  readonly totalPokemons = computed(() => this.pokemons().length);
  readonly favoritesCount = computed(() => this.favorites().length);
  readonly availableTypesCount = computed(() => this.pokemonService.getAvailableTypes().length);
  
  // Featured Pokemon (first 6 popular ones)
  readonly featuredPokemons = computed(() => {
    const featured = [1, 4, 7, 25, 39, 54, 104, 143]; // Bulbasaur, Charmander, Squirtle, Pikachu, etc.
    return this.pokemons().filter(p => featured.includes(p.id)).slice(0, 6);
  });

  // Popular types for quick navigation
  readonly popularTypes = computed(() => {
    return ['fire', 'water', 'grass', 'electric', 'psychic', 'dragon'];
  });

  ngOnInit(): void {
    // Le service charge déjà les Pokémon automatiquement
  }

  showRandomPokemon(): void {
    const allPokemons = this.pokemons();
    if (allPokemons.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPokemons.length);
      const randomPokemon = allPokemons[randomIndex];
      
      // Navigation Angular vers le Pokémon aléatoire
      this.router.navigate(['/pokemon', randomPokemon.id]);
    }
  }
}
