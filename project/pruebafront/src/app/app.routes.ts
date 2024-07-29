import { Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { FormregistroComponent } from './formregistro/formregistro.component';
import { EditregistroComponent } from './editregistro/editregistro.component';

export const routes: Routes = [
    { path: '', component: PrincipalComponent },
    { path: 'form', component: FormregistroComponent },
    { path: 'edit/:id', component: EditregistroComponent }

];
