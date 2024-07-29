import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validatorfechaliberacion } from '../utils/validators'; 
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { DateutilsService } from '../dateutils.service'; 
@Component({
  selector: 'app-formregistro',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './formregistro.component.html',
  styleUrl: './formregistro.component.css'
})
export class FormregistroComponent implements OnInit{
  
  contactForm: FormGroup = this.fb.group({});
  idInvalido:boolean = false;
  constructor(private fb: FormBuilder,
              private api:ApiService,
              private dateUtils: DateutilsService){

  }
 

  ngOnInit() {
    this.contactForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, Validatorfechaliberacion()]], 
      date_revision:[{ value: '', disabled: true },[Validators.required]]
    });
    this.contactForm.get('date_release')?.valueChanges.subscribe(date => {
      this.updateDateRevision(date);
    });
  }

  onSubmit() {
    
    if (this.contactForm.valid) {
      this.contactForm.get('date_revision')?.enable();
      this.api.ValidateId(this.contactForm.get('id')?.value).subscribe(
        data=>{
          if(!data){
            this.api.postData(this.contactForm.value).subscribe(
              data => {
                console.log(data);
                this.contactForm.get('date_revision')?.disable();
              },
              error => {
                console.error(error);
                this.contactForm.get('date_revision')?.disable();
              }
            );
          }else{
            this.idInvalido = true;
          }
          
        }

      )
     
    } else {
     
      console.log('Form is invalid');
    }
  } 

  updateDateRevision(dateRelease: string | null) {
    const dateRevisionValue = this.dateUtils.updateDateRevision(dateRelease);
    this.contactForm.get('date_revision')?.setValue(dateRevisionValue, { emitEvent: false });
  }


  
  
  



  

}
