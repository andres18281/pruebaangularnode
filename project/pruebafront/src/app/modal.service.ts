import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalSubject = new Subject<{ id: string, onConfirm: () => void }>();
   modalState$ = this.modalSubject.asObservable();
   
   showModal(id: string, onConfirm: () => void) {
    this.modalSubject.next({ id, onConfirm });
    this.closeModal();
  }

  private modalVisibilitySource = new BehaviorSubject<boolean>(false);
  modalVisibility$ = this.modalVisibilitySource.asObservable();

  private productIdSource = new BehaviorSubject<string | null>(null);
  productId$ = this.productIdSource.asObservable();

  

  closeModal() {
    this.modalVisibilitySource.next(false);
  }
}
