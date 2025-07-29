import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon } from '../../core/models/pokemon.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="favorites-container">
      <!-- Toolbar -->
      <mat-toolbar color="primary" class="favorites-toolbar">
        <button mat-icon-button routerLink="/pokemon" title="Retour à la liste">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Mes Pokémon Favoris</span>
        <span class="spacer"></span>
        <mat-chip>{{ favoritesCount() }} Favori{{ favoritesCount() > 1 ? 's' : '' }}</mat-chip>
      </mat-toolbar>

      <!-- Contenu -->
      <div class="favorites-content">
        @if (favorites().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">favorite_border</mat-icon>
            <h2>Aucun favori pour le moment</h2>
            <p>Ajoutez des Pokémon à vos favoris en cliquant sur l'icône cœur dans la liste ou les détails.</p>
            <button mat-raised-button color="primary" routerLink="/pokemon">
              <mat-icon>explore</mat-icon>
              Découvrir des Pokémon
            </button>
          </div>
        } @else {
          <div class="favorites-grid">
            @for (pokemon of favorites(); track pokemon.id) {
              <mat-card class="favorite-card" [routerLink]="'/pokemon/' + pokemon.id">
                <div class="favorite-image-container">
                  @if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
                    <img [src]="pokemon.sprites?.other?.['official-artwork']?.front_default || ''"
                         [alt]="pokemon.name"
                         class="favorite-image"
                         loading="lazy">
                  } @else if (pokemon.sprites?.front_default) {
                    <img [src]="pokemon.sprites?.front_default || ''"
                         [alt]="pokemon.name"
                         class="favorite-image"
                         loading="lazy">
                  } @else {
                    <div class="no-image">
                      <mat-icon>catching_pokemon</mat-icon>
                    </div>
                  }
                  
                  <!-- Badge favori -->
                  <div class="favorite-badge">
                    <mat-icon color="warn">favorite</mat-icon>
                  </div>

                  <!-- Bouton pour retirer des favoris -->
                  <button mat-icon-button 
                          class="remove-favorite-button"
                          (click)="removeFavorite($event, pokemon.id)"
                          title="Retirer des favoris">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>

                <mat-card-header>
                  <mat-card-title>{{ pokemon.name | titlecase }}</mat-card-title>
                  <mat-card-subtitle>#{{ pokemon.id.toString().padStart(3, '0') }}</mat-card-subtitle>
                </mat-card-header>

                <mat-card-content>
                  <!-- Types -->
                  <div class="types-container">
                    @for (typeInfo of pokemon.types; track typeInfo.type.name) {
                      <mat-chip [class]="'type-' + typeInfo.type.name">
                        {{ typeInfo.type.name | titlecase }}
                      </mat-chip>
                    }
                  </div>

                  <!-- Stats de base -->
                  @if (pokemon.stats && pokemon.stats.length > 0) {
                    <div class="basic-stats">
                      <span>HP: {{ getStatValue(pokemon, 'hp') }}</span>
                      <span>ATK: {{ getStatValue(pokemon, 'attack') }}</span>
                      <span>DEF: {{ getStatValue(pokemon, 'defense') }}</span>
                    </div>
                  }
                </mat-card-content>

                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>visibility</mat-icon>
                    Voir les détails
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>

          <!-- Actions de groupe -->
          <div class="group-actions">
            <button mat-outlined-button 
                    color="warn" 
                    (click)="clearAllFavorites()"
                    [disabled]="favorites().length === 0">
              <mat-icon>clear_all</mat-icon>
              Vider tous les favoris
            </button>
            
            <button mat-raised-button 
                    color="primary" 
                    routerLink="/pokemon">
              <mat-icon>add</mat-icon>
              Ajouter plus de favoris
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  private readonly pokemonService = inject(PokemonService);

  // Signals from service
  readonly favorites = this.pokemonService.favorites;
  
  // Computed values
  readonly favoritesCount = computed(() => this.favorites().length);

  removeFavorite(event: Event, pokemonId: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.pokemonService.toggleFavorite(pokemonId);
  }

  clearAllFavorites(): void {
    // Confirmation avant de tout supprimer
    if (confirm('Êtes-vous sûr de vouloir retirer tous les Pokémon de vos favoris ?')) {
      this.favorites().forEach(pokemon => {
        this.pokemonService.toggleFavorite(pokemon.id);
      });
    }
  }

  getStatValue(pokemon: Pokemon, statName: string): number {
    const stat = pokemon.stats?.find(s => s.stat.name === statName);
    return stat?.base_stat || 0;
  }
}