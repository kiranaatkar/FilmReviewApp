import client from "./client";

class MovieService {
  static async getMovies() {
    const response = await client.get("/movies");
    return response.data;
  }

  static async getMovie(id: string) {
    const response = await client.get(`/movies/${id}`);
    return response.data;
  }

  static async rateMovie(id: string, rating: number) {
    const response = await client.post(`/movies/${id}/rate`, { rating });
    return response.data;
  }
}

export default MovieService;
