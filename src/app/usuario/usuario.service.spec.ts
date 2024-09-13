/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('Service: Usuario', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should ...', inject([UsuarioService], (service: UsuarioService) => {
    expect(service).toBeTruthy();
  }));

  it('should send a POST request to the correct URL with the correct body for userLogIn', () => {
    const loginData = {
      usuario: 'johndoe',
      contrasena: 'password123'
    };

    service.userLogIn(loginData.usuario, loginData.contrasena).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginData);
    req.flush({}); // Mock de la respuesta
  });

  it('should send a POST request to the correct URL with the correct body', () => {
    const testData = {
      nombre: 'John Doe',
      correo: 'john.doe@example.com',
      numero_tarjeta: '1234567890123456',
      usuario: 'johndoe',
      contrasena: 'password123'
    };

    service.userSignUp(testData.nombre, testData.correo, testData.numero_tarjeta, testData.usuario, testData.contrasena).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/signin`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testData);
    req.flush({}); // Mock de la respuesta
  });

});
