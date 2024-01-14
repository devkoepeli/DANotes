import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  firestore: Firestore = inject(Firestore);

  normalNotes: Note[] = [];
  trashNotes: Note[] = [];  

  unsubNotes;
  unsubTrash;

  constructor() {
    this.unsubNotes = this.subNotesList();

    this.unsubTrash = this.subTrashList();
   }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (notes) => {
      this.normalNotes = []; 
      notes.forEach(note => {
        this.normalNotes.push(this.setNoteObject(note.data(), note.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (trash) => {
      trash.forEach(trashNote => {
        this.trashNotes.push(this.setNoteObject(trashNote.data(), trashNote.id));
        console.log(this.setNoteObject(trashNote.data(), trashNote.id))
      })
    })
  }

/**
 * setting Note object based on firebase data
 * input note property of NoteComponent has to get right properties assigned to the right property
 * in order to display the correct properties in the view
 * @param obj current List, either "notes" or "trash"
 * @param id id of current document
 * @returns an object in accordance to the note interface
 */
  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.description || '',
      marked: obj.marked || false
    }
  }
}