/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { CarreraService } from './carrera.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: Carrera', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarreraService]
    });
  });

  it('should ...', inject([CarreraService], (service: CarreraService) => {
    expect(service).toBeTruthy();
  }));
});
