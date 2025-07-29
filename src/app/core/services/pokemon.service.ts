import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, shareReplay, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Pokemon, PokemonListResponse, PokemonFilters } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE = 'https://pokeapi.co/api/v2';
  
  // State management avec signals
  private readonly pokemonsState = signal<Pokemon[]>([]);
  private readonly favoritesState = signal<Set<number>>(this.loadFavoritesFromStorage());
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly filtersState = signal<PokemonFilters>({
    search: '',
    type: null,
    generation: null
  });

  // Public computed values
  readonly pokemons = computed(() => this.pokemonsState());
  readonly favorites = computed(() => 
    this.pokemonsState().filter(p => this.favoritesState().has(p.id))
  );
  readonly isLoading = computed(() => this.loadingState());
  readonly error = computed(() => this.errorState());
  readonly filters = computed(() => this.filtersState());

  // Filtered pokemons based on current filters
  readonly filteredPokemons = computed(() => {
    const allPokemons = this.pokemonsState();
    const currentFilters = this.filtersState();
    
    return allPokemons.filter(pokemon => {
      const matchesSearch = !currentFilters.search || 
        pokemon.name.toLowerCase().includes(currentFilters.search.toLowerCase());
      
      const matchesType = !currentFilters.type || 
        pokemon.types?.some(t => t.type.name === currentFilters.type);
      
      return matchesSearch && matchesType;
    });
  });

  // RxJS-based search for reactive patterns
  private readonly searchSubject = new BehaviorSubject<string>('');
  readonly search$ = this.searchSubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor() {
    this.loadInitialPokemons();
  }

  // Load initial Pokemon list
  async loadInitialPokemons(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    
    try {
      // Load first 151 Pokemon (Gen 1)
      const response = await this.http.get<PokemonListResponse>(
        `${this.API_BASE}/pokemon?limit=151&offset=0`
      ).toPromise();

      if (response?.results) {
        // Load detailed data for each Pokemon
        const detailedPokemons = await Promise.all(
          response.results.map(pokemon => this.loadPokemonDetails(pokemon.url))
        );
        
        this.pokemonsState.set(detailedPokemons.filter(p => p !== null) as Pokemon[]);
      }
    } catch (error) {
      this.errorState.set('Erreur lors du chargement des Pokémon');
      console.error('Error loading pokemons:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  // Load detailed Pokemon data
  private async loadPokemonDetails(url: string): Promise<Pokemon | null> {
    try {
      const pokemon = await this.http.get<Pokemon>(url).toPromise();
      return pokemon || null;
    } catch (error) {
      console.error('Error loading pokemon details:', error);
      return null;
    }
  }

  // Get specific Pokemon by ID using signals
  getPokemonById(id: number): Observable<Pokemon | null> {
    return this.http.get<Pokemon>(`${this.API_BASE}/pokemon/${id}`).pipe(
      catchError(error => {
        console.error('Error loading pokemon by ID:', error);
        return of(null);
      }),
      shareReplay(1)
    );
  }

  // Convert Pokemon Observable to Signal
  getPokemonSignal(id: number) {
    return toSignal(this.getPokemonById(id), { initialValue: null });
  }

  // Update search filter
  updateSearch(searchTerm: string): void {
    this.filtersState.update(filters => ({
      ...filters,
      search: searchTerm
    }));
    this.searchSubject.next(searchTerm);
  }

  // Update type filter
  updateTypeFilter(type: string | null): void {
    this.filtersState.update(filters => ({
      ...filters,
      type
    }));
  }

  // Update generation filter
  updateGenerationFilter(generation: number | null): void {
    this.filtersState.update(filters => ({
      ...filters,
      generation
    }));
  }

  // Toggle favorite status
  toggleFavorite(pokemonId: number): void {
    const currentFavorites = new Set(this.favoritesState());
    
    if (currentFavorites.has(pokemonId)) {
      currentFavorites.delete(pokemonId);
    } else {
      currentFavorites.add(pokemonId);
    }
    
    this.favoritesState.set(currentFavorites);
    this.saveFavoritesToStorage();
  }

  // Check if Pokemon is favorite
  isFavorite(pokemonId: number): boolean {
    return this.favoritesState().has(pokemonId);
  }

  // Get Pokemon types for filtering
  getAvailableTypes(): string[] {
    const allTypes = new Set<string>();
    this.pokemonsState().forEach(pokemon => {
      pokemon.types?.forEach(typeInfo => {
        allTypes.add(typeInfo.type.name);
      });
    });
    return Array.from(allTypes).sort();
  }

  // Load more Pokemon (for pagination)
  async loadMorePokemons(offset: number = 151, limit: number = 50): Promise<void> {
    if (this.loadingState()) return;
    
    this.loadingState.set(true);
    
    try {
      const response = await this.http.get<PokemonListResponse>(
        `${this.API_BASE}/pokemon?limit=${limit}&offset=${offset}`
      ).toPromise();

      if (response?.results) {
        const newPokemons = await Promise.all(
          response.results.map(pokemon => this.loadPokemonDetails(pokemon.url))
        );
        
        const validNewPokemons = newPokemons.filter(p => p !== null) as Pokemon[];
        
        this.pokemonsState.update(currentPokemons => [
          ...currentPokemons,
          ...validNewPokemons
        ]);
      }
    } catch (error) {
      this.errorState.set('Erreur lors du chargement de plus de Pokémon');
      console.error('Error loading more pokemons:', error);
    } finally {
      this.loadingState.set(false);
    }
  }

  // Clear all filters
  clearFilters(): void {
    this.filtersState.set({
      search: '',
      type: null,
      generation: null
    });
    this.searchSubject.next('');
  }

  // Private methods for localStorage
  private loadFavoritesFromStorage(): Set<number> {
    try {
      const stored = localStorage.getItem('pokemon-favorites');
      if (stored) {
        const favorites = JSON.parse(stored) as number[];
        return new Set(favorites);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
    }
    return new Set();
  }

  private saveFavoritesToStorage(): void {
    try {
      const favorites = Array.from(this.favoritesState());
      localStorage.setItem('pokemon-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }
}