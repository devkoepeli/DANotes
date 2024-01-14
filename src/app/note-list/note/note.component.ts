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
    this.note.type = 'trash';
  }

  moveToNotes(){
    this.note.type = 'note';
  }

  deleteNote(){

  }

  saveNote(){
    
  }

}
