import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MovieComponent } from "../components/movie/movie.component";
import { Movie, SearchQuery } from "../../../types";
import { CreateModalComponent } from "../components/create-modal/create-modal.component";
import { ToastrService } from "ngx-toastr";
import { DeleteModalComponent } from "../components/delete-modal/delete-modal.component";
import { PaginationComponent } from "../components/pagination/pagination.component";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SearchBarComponent } from "../components/search-bar/search-bar.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    MovieComponent,
    MatIconModule,
    CreateModalComponent,
    DeleteModalComponent,
    PaginationComponent,
    SearchBarComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomePage implements OnInit, OnDestroy {
  movies: Movie[] = [];
  movieToUpdate!: Movie | null;
  movieToDelete!: Movie | null;
  maxNoOfPages!: number;
  currentPage!: number;
  routeSubscription!: Subscription;
  loading: boolean = false;
  search: boolean = false;

  constructor(private apiService: ApiService, private toaster: ToastrService, private route: ActivatedRoute) {}

  getMovies(currentPage: number) {
    this.loading = true;
    this.apiService.getMovies({ page: currentPage }).subscribe({
      next: (data) => {
        this.movies = data.movies;
        this.maxNoOfPages = data.noOfPages;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.toaster.error("Somehting went wrong. Please try again.");
      },
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.currentPage = Number(params.get("page") || 1);
      this.getMovies(this.currentPage);
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  handleUpdate(movie: Movie) {
    this.movieToUpdate = movie;
  }

  handleUpdatedMovie(updatedMovie: Movie) {
    this.movies = this.movies.map((m) => (m._id === updatedMovie._id ? updatedMovie : m));
    this.toaster.success(`Movie ${updatedMovie.title} updated successfully`);
  }

  handleDelete(movie: Movie) {
    this.movieToDelete = movie;
  }

  handleDeletedMovie(deletedMovie: Movie) {
    this.movies = this.movies.filter((m) => m._id !== deletedMovie._id);
    this.toaster.success(`Movie deleted successfully`);
  }

  handleCreatedMovie(createdMovie: Movie) {
    this.movies = [createdMovie, ...this.movies];
    this.toaster.success(`Movie ${createdMovie.title} added successfully`);
  }

  handleCreateModalClose(movie: Movie) {
    this.movieToUpdate = null;
  }

  handleDeleteModalClose(movie: Movie) {
    this.movieToDelete = null;
  }

  handlePageChange(i: number) {
    this.currentPage = i;
    if (!this.search) this.getMovies(i);
  }

  handleSearch(searchQuery: SearchQuery) {
    this.search = true;
    this.loading = true;
    this.apiService.getMoviesBySearch({ ...searchQuery, page: this.currentPage }).subscribe({
      next: (data) => {
        console.log("data: ", data);
        this.movies = data.movies;
        this.maxNoOfPages = data.noOfPages;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.toaster.error("Somehting went wrong. Please try again.");
      },
    });
  }
}
