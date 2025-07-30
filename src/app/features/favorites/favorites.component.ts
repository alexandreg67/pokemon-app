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
  templateUrl: './favorites.component.html',
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