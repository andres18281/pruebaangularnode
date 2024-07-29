import { TestBed } from '@angular/core/testing';

import { DateutilsService } from './dateutils.service';

describe('DateutilsService', () => {
  let service: DateutilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateutilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
