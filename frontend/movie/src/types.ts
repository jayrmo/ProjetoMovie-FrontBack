// src/types.ts

export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
}

export interface Director {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  synopsis: string;
  average_rating: string;
  review_count: number;
  director: Director;
  actors: Actor[];
  genres: Genre[];
  url?: string;
  is_deleted?: boolean;
}


export interface MovieCardProps {
  movie: Movie;
}

export interface MovieFormData {
  title: string;
  release_date: string;
  synopsis: string;
  url: string;
  director_id: string;
  actor_ids: string[];
  genre_ids: string[];
}