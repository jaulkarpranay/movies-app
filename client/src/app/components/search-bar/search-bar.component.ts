import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SearchQuery } from "../../../../types";

@Component({
  selector: "app-search-bar",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./search-bar.component.html",
  styleUrl: "./search-bar.component.css",
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchQuery: {
    rating: string;
    releaseYear: string;
    query: string;
    sortBy: "-rating" | "rating" | "releaseYear" | "-releaseYear";
  } = {
    rating: "",
    releaseYear: "1900",
    query: "",
    sortBy: "-rating",
  };
  routeSubscription!: Subscription;
  @Output() search = new EventEmitter<SearchQuery>();

  constructor(private route: ActivatedRoute) {}

  counter(n: number) {
    let array = [];

    for (let i = 0; i < n; i++) {
      array.push(i);
    }
    return array;
  }

  handleSearch() {
    this.search.emit({
      ...this.searchQuery,
      rating: Number(this.searchQuery.rating || 0),
      releaseYear: Number(this.searchQuery.releaseYear || 1900),
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.searchQuery.query = params.get("q") || "";
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
