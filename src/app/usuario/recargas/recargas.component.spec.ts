/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { RecargasComponent } from './recargas.component';
import { FormControl, FormGroup } from '@angular/forms';
import { HeaderComponent } from 'src/app/app-header/header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { throwError } from 'rxjs';

describe('RecargasComponent', () => {
  let component: RecargasComponent;
  let fixture: ComponentFixture<RecargasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecargasComponent, HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: UsuarioService,
          useValue: {
            recargarSaldo: (userId: number, monto: number, token: string) =>
              of({}),
            getUsuarios: () =>
              of([{ usuario: 'admin', nombre: 'Administrador' }]),
            username: 'admin',
            userById: (id: number) =>
              of({ id, usuario: 'admin', nombre: 'Administrador' }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { userId: '1', userToken: 'token' } },
          },
        },
        { provide: Router, useValue: { navigate: () => {} } },
        {
          provide: ToastrService,
          useValue: { success: () => {}, error: () => {}, warning: () => {} },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargasComponent);
    component = fixture.componentInstance;

    // Inicializa el FormGroup antes de ejecutar la prueba
    component.recargaForm = new FormGroup({
      monto: new FormControl(''),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error when the amount is less than zero', () => {
    component.ngOnInit();
    fixture.detectChanges();

    // permite simular un monto inválido de recarga
    component.recargaForm.controls['monto'].setValue(-1);

    // crear un espía sobre el método 'error' del ToastrService
    const toastrService = TestBed.inject(ToastrService);
    spyOn(toastrService, 'error');

    // llamar a la función para recargar saldo
    component.recargarSaldo();

    // verificar el error del ToastrService
    expect(toastrService.error).toHaveBeenCalledWith(
      'Monto inválido. Debe ser un número mayor a cero.',
      'Error'
    );
  });

  it('should display the success message when the amount is charged in the database', () => {
    component.ngOnInit();
    fixture.detectChanges();

    // permite simular un monto inválido de recarga
    component.recargaForm.controls['monto'].setValue(20000);

    // crear un espía sobre el método 'success' del ToastrService
    const toastrService = TestBed.inject(ToastrService);
    spyOn(toastrService, 'success');

    // crear un espía sobre la función para recargar saldo
    const usuarioService = TestBed.inject(UsuarioService);
    spyOn(usuarioService, 'recargarSaldo').and.returnValue(of({}));

    // llamar a la función para recargar saldo
    component.recargaForm.controls['monto'].setValue(20000);
    component.recargarSaldo();

    // verificar el error del ToastrService
    expect(toastrService.success).toHaveBeenCalledWith(
      'Saldo recargado exitosamente'
    );
  });

  it('should show warning when the token is invalid', () => {
    // crear un espía para el ToastrService
    const toastrService = TestBed.inject(ToastrService);
    spyOn(toastrService, 'warning');

    // crear un espía para el UsuarioService.getUsuarios()
    const usuarioService = TestBed.inject(UsuarioService);
    spyOn(usuarioService, 'getUsuarios').and.returnValue(
      throwError({ statusText: 'UNAUTHORIZED' })
    );

    // inicializar componente
    component.ngOnInit();
    fixture.detectChanges();

    // traer los usuarios
    component.getUsuarios();

    // verificar el warning
    expect(toastrService.warning).toHaveBeenCalledWith(
      'Su sesión ha caducado, por favor vuelva a iniciar sesión.',
      'Error de autenticación'
    );
  });

  it('should show error when the token is invalid', () => {
    // crear un espía para el ToastrService
    const toastrService = TestBed.inject(ToastrService);
    spyOn(toastrService, 'error');

    // crear un espía para el UsuarioService.getUsuarios()
    const usuarioService = TestBed.inject(UsuarioService);
    spyOn(usuarioService, 'getUsuarios').and.returnValue(
      throwError({ statusText: 'UNPROCESSABLE ENTITY' })
    );

    // inicializar componente
    component.ngOnInit();
    fixture.detectChanges();

    // traer los usuarios
    component.getUsuarios();

    // verificar el warning
    expect(toastrService.error).toHaveBeenCalledWith(
      'No hemos podido identificarlo, por favor vuelva a iniciar sesión.',
      'Error'
    );
  });

  it('should display error when id is invalid or token is empty', () => {
    // crear espía para showError
    spyOn(component, 'showError');

    // simular error
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.params.userId = 'invalid';
    route.snapshot.params.userToken = ' ';

    component.ngOnInit();

    // verificar que se ha mostrado el error
    expect(component.showError).toHaveBeenCalledWith(
      'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
    );
  });

  it('should reset the form when press cancelar', () => {
    // crear un espía para verificar que se hace reset del form
    spyOn(component.recargaForm, 'reset');

    // inicializar los valores de userId y token
    component.userId = 2;
    component.token = 'token';

    // llamar a la función cancelarRecarga al presionar cancelar
    component.cancelarRecarga();

    // verificar que el formulario haya sido reseteado
    expect(component.recargaForm.reset).toHaveBeenCalled();
  });

  it('should change the numero_tarjeta and saldo based on user information', () => {
    // crear usuario
    const user = {
      id: 1,
      nombre: '',
      albumes: [],
      usuario: 'admin',
      saldo: 0,
      numero_tarjeta: 'Tarjeta Administrador',
    };
    component.usuario = {
      id: 1,
      nombre: '',
      albumes: [],
      usuario: 'admin',
      saldo: 0,
      numero_tarjeta: 'Tarjeta Administrador',
    };

    // crear un espía para el UsuarioService.getUsuarios()
    const usuarioService = TestBed.inject(UsuarioService);
    spyOn(usuarioService, 'getUsuarios').and.returnValue(of([user]));

    // llama a la función getUsuarios
    component.getUsuarios();

    // verificar número de tarjeta y saldo
    expect(component.numero_tarjeta).toBe('Tarjeta Administrador');
    expect(component.saldo).toBe(0);
    expect(component.usuario.saldo).toBe(0);
  });

  describe('with user different to Administrador', () => {
    let fixture: ComponentFixture<RecargasComponent>;
    let component: RecargasComponent;

    beforeEach(() => {
      // configurar usuario para recibir saldo null
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [RecargasComponent, HeaderComponent],
        imports: [ReactiveFormsModule],
        providers: [
          FormBuilder,
          {
            provide: UsuarioService,
            useValue: {
              getUsuarios: () =>
                of([
                  { usuario: 'username', nombre: 'usuario', saldo: null },
                ]),
              username: 'username',
              userById: (id: number) =>
                of({
                  id,
                  usuario: 'username',
                  nombre: 'usuario',
                  saldo: null,
                }),
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { params: { userId: '1', userToken: 'token' } },
            },
          },
          { provide: Router, useValue: { navigate: () => {} } },
          {
            provide: ToastrService,
            useValue: { success: () => {}, error: () => {}, warning: () => {} },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(RecargasComponent);
      component = fixture.componentInstance;
    });

    // it('should set saldo to 0 when user saldo is null', () => {
      
    //   component.ngOnInit();
    //   fixture.detectChanges();

    //   // obtener el saldo nulo
    //   const usuarioService = TestBed.inject(UsuarioService);
    //   spyOn(usuarioService, 'userById').and.returnValue(
    //     of({ usuario: 'current', nombre: 'Usuario Actual', saldo: null })
    //   );

    //   // llamar a la función getUsuarios
    //   component.getUsuarios();

    //   // verificar que el saldo sea 0
    //   expect(component.saldo).toBe(0);
    //   expect(component.usuario.saldo).toBe(0);
    // });
  });
});
