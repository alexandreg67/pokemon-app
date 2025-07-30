import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon } from '../../core/models/pokemon.model';
import { PokemonBorder } from '../../directives/pokemon-border';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ScrollingModule,
    PokemonBorder
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  private readonly route = inject(ActivatedRoute);

  // Signals from service
  readonly pokemons = this.pokemonService.pokemons;
  readonly favorites = this.pokemonService.favorites;
  readonly isLoading = this.pokemonService.isLoading;
  readonly error = this.pokemonService.error;
  readonly filteredPokemons = this.pokemonService.filteredPokemons;

  // Signal pour les query parameters
  private readonly queryParams = toSignal(
    this.route.queryParams,
    { initialValue: {} }
  );

  // Local component signals
  readonly searchTerm = signal('');
  readonly selectedType = signal<string | null>(null);

  // Computed values
  readonly availableTypes = computed(() => this.pokemonService.getAvailableTypes());
  readonly favoritesCount = computed(() => this.favorites().length);

  constructor() {
    // Effect pour appliquer les filtres depuis les query parameters
    effect(() => {
      const params = this.queryParams();
      if (params && 'type' in params) {
        const typeParam = params['type'] as string;
        if (typeParam && typeParam !== this.selectedType()) {
          this.selectedType.set(typeParam);
          this.pokemonService.updateTypeFilter(typeParam);
        }
      }
    });
  }

  ngOnInit() {
    // Initialisation déjà faite dans le service
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchTerm.set(value);
    this.pokemonService.updateSearch(value);
  }

  onTypeChange(type: string | null): void {
    this.selectedType.set(type);
    this.pokemonService.updateTypeFilter(type);
  }

  toggleFavorite(event: Event, pokemonId: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.pokemonService.toggleFavorite(pokemonId);
  }

  isFavorite(pokemonId: number): boolean {
    return this.pokemonService.isFavorite(pokemonId);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedType.set(null);
    this.pokemonService.clearFilters();
  }

  retryLoading(): void {
    this.pokemonService.loadInitialPokemons();
  }

  onScroll(index: number): void {
    const totalItems = this.filteredPokemons().length;
    const threshold = Math.max(10, totalItems - 20);
    
    if (index >= threshold && !this.isLoading()) {
      this.pokemonService.loadMorePokemons();
    }
  }

  onImageError(event: Event, pokemon: Pokemon): void {
    const img = event.target as HTMLImageElement;
    // Fallback vers l'image par défaut si l'artwork officiel ne marche pas
    if (pokemon.sprites?.front_default) {
      img.src = pokemon.sprites.front_default;
    }
  }

  getStatValue(pokemon: Pokemon, statName: string): number {
    const stat = pokemon.stats?.find(s => s.stat.name === statName);
    return stat?.base_stat || 0;
  }
}
