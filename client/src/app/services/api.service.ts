import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Movie } from "../../../types";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  baseUrl: string = environment.production ? "/api" : "http://localhost:5000/api";
  constructor(private httpClient: HttpClient) {}

  getMovie(id: string) {
    return this.httpClient.get(`${this.baseUrl}/movies/${id}`) as Observable<Movie>;
  }

  getMovies({ page }: { page: number }) {
    return this.httpClient.get(`${this.baseUrl}/movies?page=${page}`) as Observable<{
      noOfPages: number;
      movies: Movie[];
    }>;
  }

  getMoviesBySearch({
    query,
    rating,
    releaseYear,
    sortBy,
    page,
  }: {
    sortBy?: string;
    rating?: number;
    query?: string;
    releaseYear?: number;
    page: number;
  }) {
    return this.httpClient.get(
      `${this.baseUrl}/movies/search?page=${
        page || 1
      }&q=${query}&rating=${rating}&releaseYear=${releaseYear}&sortBy=${sortBy}`
    ) as Observable<{
      noOfPages: number;
      movies: Movie[];
    }>;
  }

  addMovie(movieData: Movie) {
    return this.httpClient.post(`${this.baseUrl}/movies`, movieData) as Observable<Movie>;
  }

  deleteMovie(id: string) {
    return this.httpClient.delete(`${this.baseUrl}/movies/${id}`) as Observable<Movie>;
  }

  updateMovie(id: string, data: Movie) {
    return this.httpClient.patch(`${this.baseUrl}/movies/${id}`, data) as Observable<Movie>;
  }
}
