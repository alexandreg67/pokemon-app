import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { Pokemon, PokemonListResponse } from '../models/pokemon.model';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  const mockPokemon: Pokemon = {
    id: 1,
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
    sprites: {
      front_default: 'https://example.com/bulbasaur.png'
    },
    types: [{
      slot: 1,
      type: {
        name: 'grass',
        url: 'https://pokeapi.co/api/v2/type/12/'
      }
    }],
    stats: [{
      base_stat: 45,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/'
      }
    }]
  };

  const mockPokemonListResponse: PokemonListResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockPokemon]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial pokemons', async () => {
    const loadPromise = service.loadInitialPokemons();

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemonListResponse);

    // Mock the detailed Pokemon request
    const detailReq = httpMock.expectOne(mockPokemon.url);
    expect(detailReq.request.method).toBe('GET');
    detailReq.flush(mockPokemon);

    await loadPromise;

    expect(service.pokemons().length).toBe(1);
    expect(service.pokemons()[0].name).toBe('bulbasaur');
  });

  it('should get pokemon by id', (done) => {
    const pokemonId = 1;

    service.getPokemonById(pokemonId).subscribe(pokemon => {
      expect(pokemon).toEqual(mockPokemon);
      done();
    });

    const req = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemon);
  });

  it('should toggle favorite', () => {
    const pokemonId = 1;
    
    // Initially not favorite
    expect(service.isFavorite(pokemonId)).toBeFalse();
    
    // Toggle to favorite
    service.toggleFavorite(pokemonId);
    expect(service.isFavorite(pokemonId)).toBeTrue();
    
    // Toggle back to not favorite
    service.toggleFavorite(pokemonId);
    expect(service.isFavorite(pokemonId)).toBeFalse();
  });

  it('should update search filter', () => {
    const searchTerm = 'pikachu';
    
    service.updateSearch(searchTerm);
    
    expect(service.filters().search).toBe(searchTerm);
  });

  it('should update type filter', () => {
    const type = 'fire';
    
    service.updateTypeFilter(type);
    
    expect(service.filters().type).toBe(type);
  });

  it('should clear all filters', () => {
    // Set some filters
    service.updateSearch('test');
    service.updateTypeFilter('fire');
    service.updateGenerationFilter(1);
    
    // Clear filters
    service.clearFilters();
    
    expect(service.filters().search).toBe('');
    expect(service.filters().type).toBeNull();
    expect(service.filters().generation).toBeNull();
  });
});