import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-notes-layout',
  standalone: true,
  imports: [TopbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './notes-layout.component.html',
  styleUrls: ['./notes-layout.component.css']
})
export class NotesLayoutComponent {
  constructor(private router: Router, private notes: NotesService) {}

  handleCreate() {
    const id = this.notes.createNote();
    this.router.navigate(['/notes', id]);
  }

  handleDelete(id: string) {
    this.notes.deleteNote(id);
    // If currently viewing the deleted note, redirect to root
    const url = this.router.url;
    if (url.includes(id)) {
      this.router.navigateByUrl('/');
    }
  }
}
