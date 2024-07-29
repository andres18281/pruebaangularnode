import { Component } from '@angular/core';
import { ListaComponent } from '../lista/lista.component';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [ListaComponent,RouterModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
