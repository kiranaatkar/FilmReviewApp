export type Genre = {
  id: number;
  name: string;
}

export type Actor = {
  id: number;
  name: string;
}

export type Director = {
  id: number;
  name: string;
}

export type Film = {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  runtime: number;
  genres: Genre[];
  directors: Director[];
  actors: Actor[];
  createdAt: string;
}
