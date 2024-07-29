import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { ProductInterface } from '../product';
import { RouterModule, Routes } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../modal.service';
@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule,RouterModule,ModalComponent],
  providers: [ModalService],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit{
  products: ProductInterface[] = [];
  cant:number = 0;
  constructor(private api:ApiService,
              private modalService: ModalService

  ){

  }

  ngOnInit(): void {
      this.api.getAllData().subscribe(
        data=>{
          this.products = data.data;
          console.log(data.data.lenght);
          this.cant = this.products.length;
        },
        error => {
        }
      )
  }

  showConfirmDeleteModal(id: string) {
    this.modalService.showModal(id, () => this.Eliminar(id));
  }

  Eliminar(id: string) {
    this.api.Delete(id).subscribe(
      data => {
        // Manejo exitoso de la eliminación
        console.log('Producto eliminado', data);
        // Opcionalmente, puedes actualizar la lista de productos aquí
        this.products = this.products.filter(product => product.id !== id);
      },
      error => {
        console.error('Error eliminando producto', error);
      }
    );
  }

  

  

  

}
