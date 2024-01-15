import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service'

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  @Input() note!:Note;
  edit = false;
  hovered = false;
  
  constructor(private noteService: NoteListService){}

  ngOnInit(): void {
    // console.log(this.note);
  }

  changeMarkedStatus(){
    this.note.marked = !this.note.marked;
    this.saveNote();
  }

  deleteHovered(){
    if(!this.edit){
      this.hovered = false;
    }
  }

  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    this.edit = false;
    this.saveNote();
  }

  moveToTrash(){
    if (this.note.id != undefined) {
      this.note.type = 'trash';
      const docId = this.note.id;
      // delete note id object property only in database to get 4 fields
      delete this.note.id;
      this.noteService.addNote(this.note, 'trash');
      this.noteService.deleteNote('notes', docId);
    }
  }

  // restore button
  moveToNotes(){
    if (this.note.id != undefined) {
      this.note.type = 'note';
      const docId = this.note.id;
      delete this.note.id;
      this.noteService.addNote(this.note, 'notes');
      this.noteService.deleteNote('trash', docId)
    }
  }

  // delete note in the trash
  deleteNote(){
    if (this.note.id != undefined) {
      this.noteService.deleteNote('trash', this.note.id);
    }
  }

  saveNote(){
    this.noteService.updateNote(this.note);
  }

}
