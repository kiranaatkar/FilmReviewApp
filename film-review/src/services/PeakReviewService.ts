import client from "./client";
import { Film } from "../types/FilmTypes"
import { Rating } from "../types/GraphTypes";
class FilmService {
  static async getFilms(): Promise<Film[]> {
    try {
      const response = await client.get("/films");
      return response.data;
    } catch (error) {
      console.error("Error fetching film titles:", error);
      return [
        { id: 1, title: "LEG", year: 2025, poster_url: "/assets/lighthouse.png" },
        { id: 2, title: "Matrix", year: 1999, poster_url: "/assets/matrix.png" },
        { id: 3, title: "LEG", year: 2025, poster_url: "/assets/lighthouse.png" },
        { id: 4, title: "Matrix", year: 1999, poster_url: "/assets/matrix.png" },
        { id: 5, title: "LEG", year: 2025, poster_url: "/assets/lighthouse.png" },
        { id: 6, title: "Matrix", year: 1999, poster_url: "/assets/matrix.png" },
        { id: 7, title: "LEG", year: 2025, poster_url: "/assets/lighthouse.png" },
        { id: 8, title: "Matrix", year: 1999, poster_url: "/assets/matrix.png" },
        { id: 9, title: "LEG", year: 2025, poster_url: "/assets/lighthouse.png" },
        { id: 10, title: "Matrix", year: 1999, poster_url: "/assets/matrix.png" },
      ];
      //throw new Error("Failed to fetch film titles. Please try again.");
    }
  }

  static async getFilm(title: string): Promise<Film> {
    try {
      const response = await client.get(`/films/${title}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching film ${title}:`, error);
      return { id: 1, title: "LEG", year: 2025, poster_url: "/assets/lighthouse.png" };
      //throw new Error("Failed to load film details.");
    }
  }

  static async postRating(rating: Rating) {
    try {
      const response = await client.post(`/films/${rating.filmId}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error(`Error rating film ${rating.filmId}:`, error);
      console.log(rating)
      //throw new Error("Failed to submit rating.");
    }
  }
}

export default FilmService;
