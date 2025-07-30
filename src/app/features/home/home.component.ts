import { Component, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PokemonService } from '../../core/services/pokemon.service';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { HomeStatsComponent } from './components/home-stats/home-stats.component';
import { HomeFeaturedComponent } from './components/home-featured/home-featured.component';
import { HomeActionsComponent } from './components/home-actions/home-actions.component';
import { HomeTypesComponent } from './components/home-types/home-types.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeHeroComponent,
    HomeStatsComponent,
    HomeFeaturedComponent,
    HomeActionsComponent,
    HomeTypesComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home-container">
      <app-home-hero [favoritesCount]="favoritesCount()"></app-home-hero>
      
      <app-home-stats 
        [totalPokemons]="totalPokemons()"
        [favoritesCount]="favoritesCount()"
        [availableTypesCount]="availableTypesCount()">
      </app-home-stats>
      
      <app-home-featured 
        [featuredPokemons]="featuredPokemons()"
        [isLoading]="isLoading()">
      </app-home-featured>
      
      <app-home-actions (randomPokemon)="showRandomPokemon()"></app-home-actions>
      
      <app-home-types [popularTypes]="popularTypes()"></app-home-types>
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
