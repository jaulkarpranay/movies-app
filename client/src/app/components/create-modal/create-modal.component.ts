import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { ApiService } from "../../services/api.service";
import { Movie } from "../../../../types";
import { Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-modal",
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, RouterModule],
  templateUrl: "./create-modal.component.html",
  styleUrl: "./create-modal.component.css",
})
export class CreateModalComponent implements OnChanges {
  isOpen: boolean = false;
  hasError: boolean = false;
  loading: boolean = false;
  @Input() movieToUpdate!: Movie | null;
  @Output() close = new EventEmitter();
  @Output() updated = new EventEmitter<Movie>();
  @Output() created = new EventEmitter<Movie>();

  movieData: Movie = {
    title: "",
    directors: "",
    rating: 0,
    releaseYear: 0,
    imdbId: "",
  };

  formError: {
    title: string;
    directors: string;
    releaseYear: string;
    rating: string;
    imdbId: string;
  } = {
    title: "",
    directors: "",
    rating: "",
    releaseYear: "",
    imdbId: "",
  };

  constructor(private apiService: ApiService, private toaster: ToastrService) {}

  clearMovieData() {
    this.movieData = {
      title: "",
      directors: "",
      rating: 0,
      releaseYear: 0,
      imdbId: "",
    };
  }

  clearFormError() {
    this.formError = {
      title: "",
      directors: "",
      rating: "",
      releaseYear: "",
      imdbId: "",
    };
  }

  open() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.close.emit();
    this.clearFormError();
  }

  updateMovie() {
    this.loading = true;
    this.apiService.updateMovie(this.movieData._id!, this.movieData).subscribe({
      next: (updatedMovie) => {
        this.isOpen = false;
        this.clearFormError();
        this.clearMovieData();
        this.toaster.success(`Updated Movie ${updatedMovie.title} succesfully.`);

        this.updated.emit(updatedMovie);
      },
      error: (error) => {
        console.log("error: ", error);
        this.isOpen = false;
        this.clearFormError();
        this.clearMovieData();

        this.toaster.error("Something went wrong. Please try again");
      },
    });
  }

  addMovie() {
    this.loading = true;
    this.apiService.addMovie(this.movieData).subscribe({
      next: (data) => {
        this.isOpen = false;
        this.clearFormError();
        this.clearMovieData();
        this.created.emit(data);
      },
      error: (error) => {
        console.log("error: ", error);
        this.isOpen = false;
        this.clearFormError();
        this.clearMovieData();

        this.toaster.error("Something went wrong. please try again");
      },
    });
  }

  handleSubmit(event: any) {
    this.clearFormError();

    if (!this.movieData.title.trim().length) {
      this.hasError = true;
      this.formError = { ...this.formError, title: "Title is required" };
    }
    if (this.movieData.directors instanceof String && !this.movieData.directors.trim().length) {
      this.hasError = true;
      this.formError = {
        ...this.formError,
        directors: "Directors is required",
      };
    }

    if (!this.movieData.releaseYear) {
      this.hasError = true;
      this.formError = {
        ...this.formError,
        releaseYear: "Release Date is required",
      };
    } else if (this.movieData.releaseYear > 2030 || this.movieData.releaseYear < 1900) {
      this.hasError = true;
      this.formError = {
        ...this.formError,
        releaseYear: "Release Date must be between 1900 and 2030",
      };
    }

    if (!this.movieData.rating) {
      this.hasError = true;
      this.formError = {
        ...this.formError,
        rating: "Rating is required",
      };
    } else if (this.movieData.rating > (this.movieToUpdate ? 100 : 10) || this.movieData.rating < 0) {
      this.hasError = true;
      this.formError = {
        ...this.formError,
        rating: "Rating must be between 0 and 10",
      };
    }

    //  Update Movie
    if (!this.hasError && this.movieToUpdate) {
      this.updateMovie();
    }
    // Add movie
    else if (!this.hasError) {
      this.addMovie();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["movieToUpdate"].currentValue) {
      this.isOpen = true;
      this.movieData = {
        ...this.movieToUpdate,
        directors: Array.isArray(this.movieToUpdate?.directors) && this.movieToUpdate?.directors.join(", "),
      } as Movie;
    } else {
      this.isOpen = false;
      this.clearMovieData();
      this.clearFormError();
    }
  }
}
