export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites?: {
    front_default: string;
    front_shiny?: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types?: PokemonType[];
  stats?: PokemonStat[];
  abilities?: PokemonAbility[];
  height?: number;
  weight?: number;
  base_experience?: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonFilters {
  search: string;
  type: string | null;
  generation: number | null;
}