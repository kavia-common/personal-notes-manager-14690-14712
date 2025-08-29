import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from '../models/note.model';
import { StorageService } from './storage.service';

const NOTES_KEY = 'notes_app__notes_v1';

function safeRandomUUID(): string {
  try {
    // eslint-disable-next-line no-undef
    const g = globalThis as unknown as { crypto?: Crypto };
    if (g.crypto && typeof g.crypto.randomUUID === 'function') {
      return g.crypto.randomUUID();
    }
  } catch {
    // ignore and fallback
  }
  // Fallback UUID v4 generator
  // PUBLIC_INTERFACE
  /**
   * Generate a RFC4122-ish UUID v4 when crypto.randomUUID is unavailable.
   */
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return template.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Injectable({ providedIn: 'root' })
/**
 * PUBLIC_INTERFACE
 * NotesService manages CRUD operations for notes and persists them via StorageService.
 */
export class NotesService {
  private storage = new StorageService();
  private notesSubject = new BehaviorSubject<Note[]>(this.loadNotes());
  // PUBLIC_INTERFACE
  /** Observable stream of notes for UI components to subscribe to. */
  notes$ = this.notesSubject.asObservable();

  private loadNotes(): Note[] {
    const raw = this.storage.getItem(NOTES_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as Note[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persist(notes: Note[]) {
    this.storage.setItem(NOTES_KEY, JSON.stringify(notes));
    this.notesSubject.next([...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }

  // PUBLIC_INTERFACE
  /** Get the latest snapshot of notes (synchronously). */
  getNotesSnapshot(): Note[] {
    return this.notesSubject.getValue();
  }

  // PUBLIC_INTERFACE
  /** Create a new empty note and persist. Returns created note ID. */
  createNote(): string {
    const id = safeRandomUUID();
    const now = new Date().toISOString();
    const newNote: Note = {
      id,
      title: 'Untitled',
      content: '',
      updatedAt: now,
    };
    const notes = this.getNotesSnapshot();
    this.persist([newNote, ...notes]);
    return id;
  }

  // PUBLIC_INTERFACE
  /** Update an existing note by id. No-op if not found. */
  updateNote(id: string, patch: Partial<Pick<Note, 'title' | 'content'>>): void {
    const notes = this.getNotesSnapshot();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return;
    const updated: Note = {
      ...notes[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    const next = [...notes];
    next[idx] = updated;
    this.persist(next);
  }

  // PUBLIC_INTERFACE
  /** Delete a note by id. */
  deleteNote(id: string): void {
    const notes = this.getNotesSnapshot().filter(n => n.id !== id);
    this.persist(notes);
  }

  // PUBLIC_INTERFACE
  /** Find a note by id from the latest snapshot. */
  getNoteById(id: string): Note | undefined {
    return this.getNotesSnapshot().find(n => n.id === id);
  }
}
