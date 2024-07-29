import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { EditregistroComponent } from './editregistro.component';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { DateutilsService } from '../dateutils.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { ProductInterface } from '../product';

describe('EditregistroComponent', () => {
  let component: EditregistroComponent;
  let fixture: ComponentFixture<EditregistroComponent>;
  let apiService: ApiService;
  let dateUtils: DateutilsService;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        EditregistroComponent  // Importar el componente standalone aquí
      ],
      providers: [
        ApiService,
        DateutilsService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditregistroComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    dateUtils = TestBed.inject(DateutilsService);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    fixture.detectChanges(); // Asegúrate de que los cambios se reflejen

    // Verifica que el formulario esté inicializado con los valores correctos
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.controls['id'].value).toBe(''); // Valor inicial predeterminado
  });

  it('should call loadData with the correct id', () => {
    spyOn(component, 'loadData');
    component.ngOnInit();
    expect(component.loadData).toHaveBeenCalledWith('123');
  });

  it('should load data and patch the form values', fakeAsync(() => {
    const productData: ProductInterface = {
      id: '123',
      name: 'Product Name',
      description: 'Product Description',
      logo: 'Product Logo',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2025-01-01')
    };
  
    spyOn(apiService, 'getDataById').and.returnValue(of({ data: productData }));
  
    component.loadData('123');
    tick(); // Simula el paso del tiempo para que las actualizaciones se reflejen
    fixture.detectChanges(); // Asegúrate de que los cambios se reflejen
  
    expect(component.contactForm.get('id')?.value).toEqual(productData.id);
    expect(component.contactForm.get('name')?.value).toEqual(productData.name);
    expect(component.contactForm.get('description')?.value).toEqual(productData.description);
    expect(component.contactForm.get('logo')?.value).toEqual(productData.logo);
    expect(component.contactForm.get('date_release')?.value).toEqual(productData.date_release.toISOString().split('T')[0]);
    expect(component.contactForm.get('date_revision')?.value).toEqual(productData.date_revision.toISOString().split('T')[0]);
  }));

  it('should update date_revision when date_release changes', () => {
    const updatedDate = '2024-01-01';
    const revisionDate = '2025-01-01';
    spyOn(dateUtils, 'updateDateRevision').and.returnValue(revisionDate);

    component.contactForm.get('date_release')?.setValue(updatedDate);
    fixture.detectChanges();  // Asegúrate de que los cambios se reflejen

    expect(component.contactForm.get('date_revision')?.value).toBe(revisionDate);
  });

  it('should reset form but keep id unchanged', () => {
    component.contactForm.patchValue({
      id: '123',
      name: 'Product Name',
      description: 'Product Description',
      logo: 'Product Logo',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    component.Reiniciar();
    fixture.detectChanges();  // Asegúrate de que los cambios se reflejen

    expect(component.contactForm.get('id')?.value).toBe('123');
    expect(component.contactForm.get('name')?.value).toBe('');
    expect(component.contactForm.get('description')?.value).toBe('');
    expect(component.contactForm.get('logo')?.value).toBe('');
    expect(component.contactForm.get('date_release')?.value).toBe('');
    expect(component.contactForm.get('date_revision')?.value).toBe('');
  });
});
