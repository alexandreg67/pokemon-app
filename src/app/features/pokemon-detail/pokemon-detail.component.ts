import { Component, signal, computed, inject, effect, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';

import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon } from '../../core/models/pokemon.model';
import { 
  PokemonHeroComponent,
  PokemonStatsComponent,
  PokemonAbilitiesComponent,
  PokemonSpritesComponent,
  PokemonNavigationComponent
} from './components';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    PokemonHeroComponent,
    PokemonStatsComponent,
    PokemonAbilitiesComponent,
    PokemonSpritesComponent,
    PokemonNavigationComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);

  // Signals pour l'état local
  readonly pokemon = signal<Pokemon | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  
  // Signal pour l'ID du Pokémon depuis la route
  private readonly pokemonId = toSignal(
    this.route.params.pipe(map(params => +params['id'])),
    { initialValue: 0 }
  );

  // Computed pour vérifier si c'est un favori
  readonly isFavorite = computed(() => {
    const poke = this.pokemon();
    return poke ? this.pokemonService.isFavorite(poke.id) : false;
  });


  constructor() {
    // Effect pour charger le Pokémon quand l'ID change
    effect(() => {
      const id = this.pokemonId();
      if (id > 0) {
        this.loadPokemon(id);
      }
    });
  }

  ngOnInit(): void {
    // L'effect s'occupera du chargement initial
  }

  private async loadPokemon(id: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const pokemon$ = this.pokemonService.getPokemonById(id);
      const pokemon = await lastValueFrom(pokemon$);
      if (pokemon) {
        this.pokemon.set(pokemon);
      } else {
        this.error.set('Pokémon introuvable');
      }
    } catch (err) {
      this.error.set('Erreur lors du chargement du Pokémon');
      console.error('Error loading Pokemon:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleFavorite(): void {
    const poke = this.pokemon();
    if (poke) {
      this.pokemonService.toggleFavorite(poke.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/pokemon']);
  }

  retry(): void {
    const id = this.pokemonId();
    if (id > 0) {
      this.loadPokemon(id);
    }
  }

  navigateToPokemon(id: number): void {
    this.router.navigate(['/pokemon', id]);
  }

}