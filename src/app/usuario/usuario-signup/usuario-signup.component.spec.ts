/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsuarioSignupComponent } from './usuario-signup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

describe('UsuarioSignupComponent', () => { 
  let component: UsuarioSignupComponent;
  let fixture: ComponentFixture<UsuarioSignupComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let helper: jasmine.SpyObj<JwtHelperService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['userSignUp']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const helperSpy = jasmine.createSpyObj('JwtHelperService', ['decodeToken']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['error','success']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), ReactiveFormsModule],
      declarations: [UsuarioSignupComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: JwtHelperService, useValue: helperSpy },
        { provide: Router, useValue: routerSpy },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioSignupComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    helper = TestBed.inject(JwtHelperService) as jasmine.SpyObj<JwtHelperService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>; // Inyectar Router
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userSignUp with the correct parameters', () => {
    component.usuarioForm.setValue({
      nombre: 'John Doe',
      correo: 'john@example.com',
      numero_tarjeta: '1234567890123456',
      usuario: 'john123',
      password: 'password',
      confirmPassword: 'password',
    });

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    usuarioService.userSignUp.and.returnValue(of({ token: mockToken }));
    const decodedToken = { sub: '123' };
    helper.decodeToken.and.returnValue(decodedToken);

    component.registrarUsuario();

    expect(usuarioService.userSignUp).toHaveBeenCalledWith('John Doe', 'john@example.com', '1234567890123456', 'john123', 'password');
  });

  it('should call toastr.error with the correct message on signup failure', () => {
    spyOn(component, 'showError');
    const errorMessage = 'Error en el registro';
    usuarioService.userSignUp.and.returnValue(throwError({ error: { error: errorMessage } }));
    component.registrarUsuario();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should call toastr.error with the correct parameters', () => {
    const errorMessage = 'An error occurred';
    component.showError(errorMessage);
    expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
  });

  it('should call toastr.success with the correct parameters', () => {
    component.showSuccess();
    expect(toastrService.success).toHaveBeenCalledWith('Se ha registrado exitosamente', 'Registro exitoso');
  });

  it('should allow numbers (0-9) and Backspace & Tab', () => {
    const numerosValidos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Tab'];
    numerosValidos.forEach(tecla => {
      const event = new KeyboardEvent('keydown', { key: tecla });
      spyOn(event, 'preventDefault');  // Espía la función preventDefault
      component.validarNumeros(event);
      expect(event.preventDefault).not.toHaveBeenCalled();  // preventDefault no debe ser llamado
    });
  });

  it('should prevent characters not numeric like letters and simbols', () => {
    const teclasInvalidas = ['a', '+', '-', '*', '/', '!', 'A', 'z'];
    teclasInvalidas.forEach(tecla => {
      const event = new KeyboardEvent('keydown', { key: tecla });
      spyOn(event, 'preventDefault');  // Espía la función preventDefault
      component.validarNumeros(event);
      expect(event.preventDefault).toHaveBeenCalled();  // preventDefault debe ser llamado
    });
  });


});
