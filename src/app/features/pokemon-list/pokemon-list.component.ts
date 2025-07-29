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
  template: `
    <div class="pokemon-list-container">
      <!-- Toolbar avec filtres -->
      <mat-toolbar color="primary" class="filters-toolbar">
        <span>Pokédex</span>
        <span class="spacer"></span>
        
        <!-- Champ de recherche -->
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Rechercher un Pokémon</mat-label>
          <input matInput 
                 [value]="searchTerm()"
                 (input)="onSearchChange($event)"
                 placeholder="Pikachu, Charizard...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <!-- Filtre par type -->
        <mat-form-field appearance="outline" class="type-filter">
          <mat-label>Filtrer par type</mat-label>
          <mat-select [value]="selectedType()" (selectionChange)="onTypeChange($event.value)">
            <mat-option [value]="null">Tous les types</mat-option>
            @for (type of availableTypes(); track type) {
              <mat-option [value]="type">{{ type | titlecase }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <!-- Bouton pour les favoris -->
        <button mat-icon-button routerLink="/favorites" title="Mes favoris">
          <mat-icon>favorite</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Statistiques -->
      <div class="stats-bar">
        <mat-chip-set>
          <mat-chip>{{ filteredPokemons().length }} Pokémon{{ filteredPokemons().length > 1 ? 's' : '' }}</mat-chip>
          <mat-chip>{{ favoritesCount() }} Favori{{ favoritesCount() > 1 ? 's' : '' }}</mat-chip>
        </mat-chip-set>
      </div>

      <!-- Zone de contenu -->
      <div class="content-area">
        <!-- État de chargement -->
        @if (isLoading()) {
          <div class="loading-container">
            <mat-progress-spinner mode="indeterminate" diameter="80"></mat-progress-spinner>
            <p>Chargement des Pokémon...</p>
          </div>
        } 
        <!-- Erreur -->
        @else if (error()) {
          <div class="error-container">
            <mat-icon color="warn">error</mat-icon>
            <h3>Erreur de chargement</h3>
            <p>{{ error() }}</p>
            <button mat-raised-button color="primary" (click)="retryLoading()">
              Réessayer
            </button>
          </div>
        }
        <!-- Liste des Pokémon avec Virtual Scrolling -->
        @else {
          <cdk-virtual-scroll-viewport 
            itemSize="300" 
            class="pokemon-viewport"
            (scrolledIndexChange)="onScroll($event)">
            
            <div class="pokemon-grid">
              @for (pokemon of filteredPokemons(); track pokemon.id; let i = $index) {
                @if (pokemon.types && pokemon.types.length > 0) {
                  <mat-card class="pokemon-card"
                            [routerLink]="'/pokemon/' + pokemon.id"
                            [class.favorite]="isFavorite(pokemon.id)"
                            [appPokemonBorder]="pokemon.types[0].type.name">
                    <mat-card-header>
                      <mat-card-title>{{ pokemon.name | titlecase }}</mat-card-title>
                      <mat-card-subtitle>#{{ pokemon.id.toString().padStart(3, '0') }}</mat-card-subtitle>
                      
                      <!-- Bouton favori -->
                      <button mat-icon-button
                              class="favorite-button"
                              (click)="toggleFavorite($event, pokemon.id)"
                              [attr.aria-label]="isFavorite(pokemon.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                        <mat-icon [color]="isFavorite(pokemon.id) ? 'warn' : ''">
                          {{ isFavorite(pokemon.id) ? 'favorite' : 'favorite_border' }}
                        </mat-icon>
                      </button>
                    </mat-card-header>

                    <!-- Image du Pokémon -->
                    <div class="pokemon-image-container">
                      @if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
                        <img [src]="pokemon.sprites?.other?.['official-artwork']?.front_default || ''"
                             [alt]="pokemon.name"
                             class="pokemon-image"
                             loading="lazy"
                             (error)="onImageError($event, pokemon)">
                      } @else if (pokemon.sprites?.front_default) {
                        <img [src]="pokemon.sprites?.front_default || ''"
                             [alt]="pokemon.name"
                             class="pokemon-image"
                             loading="lazy"
                             (error)="onImageError($event, pokemon)">
                      } @else {
                        <div class="no-image">
                          <mat-icon>catching_pokemon</mat-icon>
                        </div>
                      }
                    </div>

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
                  </mat-card>
                }
              } @empty {
                <div class="no-results">
                  <mat-icon>search_off</mat-icon>
                  <h3>Aucun Pokémon trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche</p>
                  <button mat-raised-button color="primary" (click)="clearFilters()">
                    Effacer les filtres
                  </button>
                </div>
              }
            </div>
          </cdk-virtual-scroll-viewport>
        }
      </div>
    </div>
  `,
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
