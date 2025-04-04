import client from "./client";
import { Film } from "../types/FilmTypes";
import { Rating } from "../types/GraphTypes";
import { StatusCodes } from "http-status-codes";
import { DEFAULT_POINTS } from "../config/GraphConfig";
import { TokenResponse } from "../types/AuthTypes";

class FilmService {
  static async SignUp(
    username: string,
    password: string
  ): Promise<TokenResponse | string> {
    try {
      const response = await client.post("/users/create", {
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error creating user ${username}:`, error);
      switch (error.response.status) {
        case StatusCodes.BAD_REQUEST:
          throw new Error("Invalid rating.");
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw new Error("Failed to submit rating.");
        default:
          throw new Error("An unexpected error occurred.");
      }
    }
  }

  static async SignIn(
    username: string,
    password: string
  ): Promise<TokenResponse | string> {
    try {
      const response = await client.post("/users/signIn", {
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error logging in user ${username}:`, error);
      switch (error.response.status) {
        case StatusCodes.BAD_REQUEST:
          throw new Error("Invalid rating.");
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw new Error("Failed to submit rating.");
        default:
          throw new Error("An unexpected error occurred.");
      }
    }
  }

  static async getFilms(): Promise<Film[]> {
    try {
      const response = await client.get("/films");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching film titles:", error);
      switch (error.response.status) {
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw new Error("Failed to fetch film titles. Please try again.");
        default:
          throw new Error("An unexpected error occurred.");
        // return [
        //   {
        //     id: 1,
        //     title: "LEG",
        //     year: 2025,
        //     poster_url: "/assets/lighthouse.png",
        //   },
        //   {
        //     id: 2,
        //     title: "Matrix",
        //     year: 1999,
        //     poster_url: "/assets/matrix.png",
        //   },
        // ];
      }
    }
  }

  static async getFilm(title: string): Promise<Film> {
    try {
      const response = await client.get(`/films/${title}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching film ${title}:`, error);
      switch (error.response.status) {
        case StatusCodes.NOT_FOUND:
          throw new Error("Film not found.");
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw new Error("Failed to load film details.");
        default:
          throw new Error("An unexpected error occurred.");
      }
      // return {
      //   id: 1,
      //   title: "LEG",
      //   year: 2025,
      //   poster_url: "/assets/lighthouse.png",
      // };
    }
  }

  static async postRating(rating: Rating): Promise<void> {
    try {
      await client.post(`/films/${rating.filmId}/rate`, {
        rating,
      });
    } catch (error: any) {
      console.error(`Error rating film ${rating.filmId}:`, error);
      switch (error.response.status) {
        case StatusCodes.BAD_REQUEST:
          throw new Error("Invalid rating.");
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw new Error("Failed to submit rating.");
        default:
          throw new Error("An unexpected error occurred.");
      }
    }
  }

  static async getUserRating(filmId: number, userId: number): Promise<Rating> {
    try {
      const response = await client.get(`/films/${filmId}/rating/${userId}`);
      return response.data;
    } catch (error: any) {
      switch (error.response.status) {
        case StatusCodes.NOT_FOUND:
          // return default rating
          return { userId, filmId, points: DEFAULT_POINTS };
        case StatusCodes.INTERNAL_SERVER_ERROR:
          console.error(
            `Error fetching user rating for film ${filmId}:`,
            error
          );
          throw new Error("Failed to fetch user rating.");
        default:
          console.error(
            `Error fetching user rating for film ${filmId}:`,
            error
          );
          throw new Error("An unexpected error occurred.");
      }
      //return { userId: 1, filmId: 1, points: [] };
    }
  }

  static async getAverageRating(filmId: number) {
    try {
      const response = await client.get(`/films/${filmId}/average`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching average rating for film ${filmId}:`, error);
      switch (error.response.status) {
        case StatusCodes.NOT_FOUND:
          throw new Error("Rating not found.");
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw new Error("Failed to fetch average rating.");
        default:
          throw new Error("An unexpected error occurred.");
      }
    }
  }
}

export default FilmService;
