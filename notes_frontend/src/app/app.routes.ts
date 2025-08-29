import { Routes } from '@angular/router';
import { NotesLayoutComponent } from './pages/notes-layout/notes-layout.component';
import { EditorComponent } from './components/editor/editor.component';

export const routes: Routes = [
  {
    path: '',
    component: NotesLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: EditorComponent }, // empty state
      { path: 'notes/:id', component: EditorComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
