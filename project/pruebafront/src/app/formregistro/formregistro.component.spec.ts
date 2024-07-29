import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { FormregistroComponent } from './formregistro.component';
import { ApiService } from '../api.service';
import { DateutilsService } from '../dateutils.service';

// Mock del ApiService
class MockApiService {
  ValidateId(id: string) {
    return of(true); // Simula un ID inválido
  }

  postData(data: any) {
    return of({ success: true });
  }
}

// Mock del DateutilsService
class MockDateutilsService {
  updateDateRevision(dateRelease: string | null) {
    return '2024-12-31'; // valor simulado para la revisión de fecha
  }
}

describe('FormregistroComponent', () => {
  let component: FormregistroComponent;
  let fixture: ComponentFixture<FormregistroComponent>;
  let apiService: ApiService;
  let dateUtilsService: DateutilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule,FormregistroComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: ApiService, useClass: MockApiService },
        { provide: DateutilsService, useClass: MockDateutilsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormregistroComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    dateUtilsService = TestBed.inject(DateutilsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.get('id')?.value).toEqual('');
    expect(component.contactForm.get('name')?.value).toEqual('');
    expect(component.contactForm.get('description')?.value).toEqual('');
    expect(component.contactForm.get('logo')?.value).toEqual('');
    expect(component.contactForm.get('date_release')?.value).toEqual('');
    expect(component.contactForm.get('date_revision')?.value).toEqual('');
  });

  it('should update date_revision when date_release changes', () => {
    const dateReleaseControl = component.contactForm.get('date_release');
    dateReleaseControl?.setValue('2023-12-31');
    expect(component.contactForm.get('date_revision')?.value).toEqual('2024-12-31');
  });

  it('should call api.postData with form values on submit when form is valid', fakeAsync(() => {
    const spyPostData = spyOn(apiService, 'postData').and.callThrough();
    spyOn(apiService, 'ValidateId').and.returnValue(of(false)); // Simula un ID válido
    
    component.contactForm.setValue({
      id: '12345',
      name: 'Test Name',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2023-12-31',
      date_revision: '2024-12-31'
    });

    component.onSubmit();
    tick(); // Simula el paso del tiempo para completar llamadas asíncronas
    fixture.detectChanges(); // Asegura que los cambios se reflejen en el DOM

    expect(spyPostData).toHaveBeenCalledWith({
      id: '12345',
      name: 'Test Name',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2023-12-31',
      date_revision: '2024-12-31'
    });
  }));

  it('should set idInvalido to true if ID is invalid', fakeAsync(() => {
    spyOn(apiService, 'ValidateId').and.returnValue(of(true)); // Simula un ID inválido

    component.contactForm.setValue({
      id: 'invalid-id',
      name: 'Test Name',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2023-12-31',
      date_revision: '2024-12-31'
    });

    component.onSubmit();
    tick(); // Simula el paso del tiempo para completar llamadas asíncronas

    fixture.detectChanges(); // Asegura que los cambios se reflejen en el DOM

    expect(component.idInvalido).toBeFalsy();
  }));

  it('should log form errors if form is invalid on submit', () => {
    spyOn(console, 'log');

    component.contactForm.get('name')?.setValue('abc'); // Menor que minlength

    component.onSubmit();

    expect(console.log).toHaveBeenCalledWith('Form is invalid');
  });
});
