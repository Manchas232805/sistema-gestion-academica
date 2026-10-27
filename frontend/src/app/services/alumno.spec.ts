
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AlumnoService } from './alumno';

describe('AlumnoService', () => {
  let service: AlumnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlumnoService,
        {
          provide: HttpClient,
          useValue: {}
        }
      ]
    });

    service = TestBed.inject(AlumnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
