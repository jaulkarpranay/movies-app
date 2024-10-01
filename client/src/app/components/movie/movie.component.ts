import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Movie } from "../../../../types";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-movie",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./movie.component.html",
  styleUrl: "./movie.component.css",
})
export class MovieComponent {
  @Input() movie!: Movie;
  @Output() updateMovie = new EventEmitter<Movie>();
  @Output() deleteMovie = new EventEmitter<Movie>();

  handleDelete() {
    this.deleteMovie.emit(this.movie);
  }

  handleUpdate() {
    this.updateMovie.emit(this.movie);
  }
}
