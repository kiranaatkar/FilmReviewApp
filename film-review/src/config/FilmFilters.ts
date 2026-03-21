export type FilmSortOption =
  | "latestAdded"
  | "newest"
  | "oldest"
  | "titleAsc"
  | "titleDesc";

export const FILM_SORT_OPTIONS: { value: FilmSortOption; label: string }[] = [
  { value: "latestAdded", label: "Latest Added" },
  { value: "newest", label: "Release Date (Newest First)" },
  { value: "oldest", label: "Release Date (Oldest First)" },
  { value: "titleAsc", label: "Title (A–Z)" },
  { value: "titleDesc", label: "Title (Z–A)" },
];

export const DEFAULT_FILM_SORT: FilmSortOption = "latestAdded";