import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notes = inject(NotesService);

  note = signal<Note | null>(null);

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.note.set(null);
        return;
      }
      const n = this.notes.getNoteById(id);
      if (!n) {
        // Navigate to root if note not found
        this.router.navigateByUrl('/');
        return;
      }
      this.note.set({ ...n });
    });
  }

  onTitleInput(value: string) {
    const current = this.note();
    if (!current) return;
    this.note.set({ ...current, title: value });
    this.notes.updateNote(current.id, { title: value });
  }

  onContentInput(value: string) {
    const current = this.note();
    if (!current) return;
    this.note.set({ ...current, content: value });
    this.notes.updateNote(current.id, { content: value });
  }
}
