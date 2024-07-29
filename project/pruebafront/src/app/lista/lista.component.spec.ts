import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListaComponent } from './lista.component';
import { ApiService } from '../api.service';
import { ModalService } from '../modal.service';
import { ProductInterface } from '../product';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalComponent } from '../modal/modal.component';

// Mock del ApiService
class MockApiService {
  getAllData() {
    return of({
      data: [
        { id: '1', name: 'Product 1' } as ProductInterface,
        { id: '2', name: 'Product 2' } as ProductInterface,
      ],
    });
  }

  Delete(id: string) {
    return of({ success: true });
  }
}

// Mock del ModalService
class MockModalService {
  showModal(id: string, callback: () => void) {
    callback(); // Ejecuta el callback directamente
  }
}

describe('ListaComponent', () => {
  let component: ListaComponent;
  let fixture: ComponentFixture<ListaComponent>;
  let apiService: ApiService;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule,ListaComponent, ModalComponent],
      declarations: [],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: ModalService, useClass: MockModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize products and count on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick(); // Simula el paso del tiempo para completar llamadas asíncronas
    fixture.detectChanges(); // Asegura que los cambios se reflejen en el DOM

    expect(component.products.length).toBe(2);
    expect(component.cant).toBe(2);
  }));

  it('should call modalService.showModal and Eliminar on showConfirmDeleteModal', () => {
    // Espías para los métodos de ModalService y el método Eliminar
    spyOn(modalService, 'showModal').and.callThrough();
    spyOn(component, 'Eliminar').and.callThrough();

    // Llama a showConfirmDeleteModal con un ID de prueba
    component.showConfirmDeleteModal('1');

    // Verifica que showModal haya sido llamado con el ID y un callback
    expect(modalService.showModal).toHaveBeenCalledWith('1', jasmine.any(Function));

    // Verifica que Eliminar haya sido llamado con el ID
    expect(component.Eliminar).toHaveBeenCalledWith('1');
  });

  it('should call apiService.Delete and remove product from products on Eliminar', fakeAsync(() => {
    const id = '1';
    const initialProducts = component.products;
    const spyDelete = spyOn(apiService, 'Delete').and.callThrough();
    
    component.Eliminar(id);
    tick(); // Simula el paso del tiempo para completar llamadas asíncronas
    fixture.detectChanges(); // Asegura que los cambios se reflejen en el DOM

    expect(spyDelete).toHaveBeenCalledWith(id);
    expect(component.products.length).toBe(initialProducts.length - 1);
    expect(component.products.find(product => product.id === id)).toBeUndefined();
  }));

  it('should handle error in Eliminar gracefully', fakeAsync(() => {
    spyOn(apiService, 'Delete').and.returnValue(throwError(() => new Error('Error')));
    const id = '1';
    const spyError = spyOn(console, 'error');

    component.Eliminar(id);
    tick(); // Simula el paso del tiempo para completar llamadas asíncronas

    expect(spyError).toHaveBeenCalledWith('Error eliminando producto', jasmine.any(Error));
  }));
});
