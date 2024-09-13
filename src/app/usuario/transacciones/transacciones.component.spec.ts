import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransaccionesComponent } from './transacciones.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { of } from 'rxjs';

describe('TransaccionesComponent', () => {
  let component: TransaccionesComponent;
  let fixture: ComponentFixture<TransaccionesComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;

  beforeEach(waitForAsync(() => {
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['error','success']);
    const usuarioService = jasmine.createSpyObj('UsuarioService', ['getTransacciones']);

    usuarioService.getTransacciones.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot()],
      declarations: [TransaccionesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                userId: '123',
                userToken: 'token123'
              }
            }
          }
        },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: UsuarioService, useValue: usuarioService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaccionesComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTransacciones and set transacciones', () => {
    // Configura el mock para que retorne un Observable
    usuarioService.getTransacciones.and.returnValue(of([]));
    // Llama al método a probar
    component.getTransacciones();
    // Verifica que el servicio fue llamado correctamente
    expect(usuarioService.getTransacciones).toHaveBeenCalledWith(component.userId, component.token);
    
    // Verifica que el componente recibió y estableció correctamente las transacciones
    expect(component.transacciones).toEqual([]);
  });

  it('should call toastr.error with the correct parameters', () => {
    const errorMessage = 'An error occurred';
    component.showError(errorMessage);
    expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
  });

});
