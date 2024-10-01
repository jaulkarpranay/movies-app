import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Movie } from '../../../../types';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
})
export class DeleteModalComponent implements OnChanges {
  @Input() movieToDelete!: Movie | null;
  @Output() deleted = new EventEmitter<Movie>();
  @Output() close = new EventEmitter();
  isOpen: boolean = false;
  loading: boolean = false;

  constructor(private apiService: ApiService, private toaster: ToastrService) {}

  handleSubmit(event: any) {
    this.loading = true;
    this.apiService.deleteMovie(this.movieToDelete!._id!).subscribe({
      next: (deletedMovie) => {
        this.isOpen = false;
        this.loading = false;
        this.toaster.success('Movie sucessfully deleted.');
        this.deleted.emit(deletedMovie);
      },
      error: (error) => {
        console.log('error: ', error);
        this.isOpen = false;
        this.loading = false;
        this.toaster.error('Something went wrong. Please try again.');
      },
    });
  }

  closeModal() {
    this.close.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieToDelete'].currentValue) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }
}
