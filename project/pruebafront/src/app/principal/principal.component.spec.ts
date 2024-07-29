import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalComponent } from './principal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { DateutilsService } from '../dateutils.service';
import { ActivatedRoute } from '@angular/router';

describe('PrincipalComponent', () => {
  let component: PrincipalComponent;
  let fixture: ComponentFixture<PrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [  ReactiveFormsModule,
        HttpClientTestingModule,,PrincipalComponent],
        providers: [
          ApiService,
          DateutilsService,
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { paramMap: { get: () => '123' } } }
          }
        ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
