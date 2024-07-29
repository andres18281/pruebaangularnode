import { Component } from '@angular/core';
import { ModalService } from '../modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  showModal: boolean = false;
  productId: string | null = null;
  onConfirm: (() => void) | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.modalState$.subscribe(data => {
      this.productId = data.id;
      this.onConfirm = data.onConfirm;
      this.showModal = true;
    });

    
  }

  closeModal() {
    this.modalService.closeModal();
  }

  Confirmar() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.closeModal();
  }
}
