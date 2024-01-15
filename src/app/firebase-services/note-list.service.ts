import { Injectable, inject, OnInit } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { AddNoteDialogComponent } from '../add-note-dialog/add-note-dialog.component';
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

  async addNote(item: Note, colId: 'notes' | 'trash') {
    if (colId == 'notes') {
      await addDoc(this.getNotesRef(), item)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      }).catch((err) => {
        console.error('Loading error: ', err);
      });
    } else {
      await addDoc(this.getTrashRef(), item)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      }).catch((err) => {
        console.error('Loading error: ', err);
      });
    }
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  async updateNote(item: Note) {
    if (item.id != undefined) {
      const docRef = this.getSingleDocRef(this.getColIdFromNote(item), item.id);

      await updateDoc(docRef, this.getCleanObject(item))
      .catch(err => console.error('Updating note error: ', err));
    }
  }

  getColIdFromNote(item: Note) {
    if (item.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  getCleanObject(item: Note): {} {
    return {
      type: item.type,
      title: item.title,
      content: item.content,
      marked: item.marked
    }
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId))
    .catch(err => console.error('Note update error: ', err));
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
      this.trashNotes = [];
      trash.forEach(trashNote => {
        this.trashNotes.push(this.setNoteObject(trashNote.data(), trashNote.id));
      })
    })
  }

/**
 * setting Note object (id) based on firebase data every time db receives change
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
      content: obj.content || '',
      marked: obj.marked || false
    }
  }
}