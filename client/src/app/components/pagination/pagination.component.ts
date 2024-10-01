import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.css",
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() maxNoOfPages!: number;
  @Output() pageChange = new EventEmitter<number>();

  range(lowerLimit: number, upperLimit: number) {
    const array = [];
    lowerLimit = lowerLimit < 0 ? 1 : lowerLimit;
    upperLimit = upperLimit > this.maxNoOfPages ? this.maxNoOfPages + 1 : upperLimit;

    for (let i = lowerLimit; i < upperLimit; i++) {
      array.push(i);
    }
    return array;
  }

  handleClick(i: number) {
    this.pageChange.emit(i);
  }

  incrementPage() {
    const newPage = this.maxNoOfPages > this.currentPage ? this.currentPage + 1 : this.maxNoOfPages;
    if (this.currentPage < this.maxNoOfPages) this.pageChange.emit(newPage);
  }
  decrementPage() {
    const newPage = this.currentPage <= 1 ? 1 : this.currentPage - 1;
    if (this.currentPage > 1) this.pageChange.emit(newPage);
  }
}
