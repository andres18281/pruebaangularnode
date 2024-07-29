import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validatorfechaliberacion } from '../utils/validators'; 

import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { ProductInterface } from '../product';
import { DateutilsService } from '../dateutils.service';

@Component({
  selector: 'app-editregistro',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './editregistro.component.html',
  styleUrl: './editregistro.component.css'
})
export class EditregistroComponent implements OnInit{
  id: string = "";
  product: ProductInterface = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: new Date(),
    date_revision: new Date()
  };
  contactForm: FormGroup = this.fb.group({});
  constructor(private fb: FormBuilder,
              private api:ApiService,
              private route: ActivatedRoute,
              private dateUtils: DateutilsService
            ){
              

  }
 

  ngOnInit() {
    this.contactForm = this.fb.group({
      id: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, Validatorfechaliberacion()]], // Asegúrate de que sea un validador sincrónico
      date_revision:[{ value: '', disabled: true },[Validators.required]]
    });

    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (idFromRoute) {
      this.id = idFromRoute;
      this.loadData(idFromRoute);
    } else {
      // Manejar el caso donde el ID no está presente
      console.error('ID no encontrado en la ruta');
    }

    this.contactForm.get('date_release')?.valueChanges.subscribe(date => {
      this.updateDateRevision(date);
    });

    
  }

  updateDateRevision(dateRelease: string | null) {
    const dateRevisionValue = this.dateUtils.updateDateRevision(dateRelease);
    this.contactForm.get('date_revision')?.setValue(dateRevisionValue, { emitEvent: false });
  }

  loadData(id:string){
    this.api.getDataById(id).subscribe(
      data => {
        console.log(data);
        this.product = data.data
        this.contactForm.patchValue({
          id: this.product.id,
          name: this.product.name,
          description: this.product.description,
          logo: this.product.logo,
          date_release: this.product.date_release.toISOString().split('T')[0],
          date_revision: this.product.date_revision.toISOString().split('T')[0]
        });


      },
      error => {
        console.error(error);
      }
    );
  }


  onSubmit() {
    
    if (this.contactForm.valid) {
      this.contactForm.get('date_revision')?.enable();
      this.api.EditData(this.id,this.contactForm.value).subscribe(
        data => {
          this.contactForm.get('date_revision')?.disable();
         
        },
        error => {
          this.contactForm.get('date_revision')?.disable();
        }
      );
    } else {
      this.logFormErrors();
      console.log('Form is invalid');
    }
  } 


  logFormErrors() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control instanceof FormControl) {
        if (control.errors) {
          console.log(`Error in ${key}:`, control.errors);
        }
      } else if (control instanceof FormGroup) {
        this.logGroupErrors(control, key);
      }
    });
  }
  
  logGroupErrors(group: FormGroup, groupName: string) {
    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      if (control instanceof FormControl) {
        if (control.errors) {
          console.log(`Error in ${groupName} - ${key}:`, control.errors);
        }
      } else if (control instanceof FormGroup) {
        this.logGroupErrors(control, `${groupName} - ${key}`);
      }
    });
  }


  Reiniciar(){
    const currentId = this.contactForm.get('id')?.value;
    
    this.contactForm.patchValue({
      name: "",
      description: "",
      logo: "",
      date_release: "",
      date_revision: ""
    });
  
    // Restablecer el valor de 'id' después de llamar a patchValue
    this.contactForm.get('id')?.setValue(currentId);
    console.log(currentId)
   
  }



}
