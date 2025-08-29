import { Component, EventEmitter, Output, signal } from '@angular/core';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NotesService } from '../../services/notes.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, DatePipe, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() create = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  selectedId = signal<string | null>(null);

  constructor(public notesService: NotesService) {}

  setSelected(id: string) {
    this.selectedId.set(id);
  }

  onCreate() {
    this.create.emit();
  }

  onDelete(id: string, e: any) {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    this.delete.emit(id);
  }
}
