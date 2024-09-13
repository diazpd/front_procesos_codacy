/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ApuestaCreateComponent } from './apuesta-create.component';
import { ApuestaService } from '../apuesta.service';
import { CarreraService } from 'src/app/carrera/carrera.service';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HeaderComponent } from 'src/app/app-header/header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { throwError } from 'rxjs';

// pruebas unitarias
describe('ApuestaCreateComponent', () => {
  let component: ApuestaCreateComponent;
  let fixture: ComponentFixture<ApuestaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApuestaCreateComponent, HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ApuestaService, useValue: { crearApuesta: () => of({}) } },
        { provide: CarreraService, useValue: { getCarreras: () => of([]), getCarrerasApostador: () => of([]) } },
        { provide: UsuarioService, useValue: {
          getUsuarios: () => of([{ usuario: 'admin', nombre: 'Administrador' }]),
          userById: (id: number) => of({ id, usuario: 'admin', nombre: 'Administrador' }),
        }},
        { provide: ActivatedRoute, useValue: { snapshot: { params: { userId: '1', userToken: 'token' } } }},
        { provide: Router, useValue: { navigate: () => {} }},
        { provide: ToastrService, useValue: { success: () => {}, error: () => {}, warning: () => {} }}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuestaCreateComponent);
    component = fixture.componentInstance;

    // Inicializa el FormGroup antes de ejecutar la prueba
    component.apuestaForm = new FormGroup({
      id_carrera: new FormControl(''),
      id_competidor: new FormControl(''),
      nombre_apostador: new FormControl(''),
      valor_apostado: new FormControl(0),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when there is no apostador selected', () => {
    // Inicializa el componente y detecta cambios
    component.ngOnInit(); 
    fixture.detectChanges();

    // Permite simular que no se selecciona un apostador
    component.apuestaForm.get('nombre_apostador')!.setValue('');
    component.apuestaForm.get('nombre_apostador')!.markAsTouched();
    fixture.detectChanges();

    const errorAlert = fixture.nativeElement.querySelector('.alert-danger');

    // Verifica que el error se muestre
    expect(errorAlert).toBeTruthy();
    expect(errorAlert.textContent).toContain('Debe seleccionar un apostador');
  });

  it('should display a list including Administrador', () => {
    component.ngOnInit(); 
    fixture.detectChanges(); 

    const selectElement: HTMLSelectElement = fixture.nativeElement.querySelector('select[formControlName="nombre_apostador"]');

    // Verifica que dentro del listado se encuentre "Administrador"
    const options = Array.from(selectElement.options);
    const adminOption = options.some(option => option.textContent?.trim() === 'Administrador');
    expect(adminOption).toBeTrue();
  });

  describe('with user different to Administrador', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [ApuestaCreateComponent, HeaderComponent],
        imports: [ReactiveFormsModule],
        providers: [
          FormBuilder,
          { provide: ApuestaService, useValue: { crearApuesta: () => of({}) } },
          { provide: CarreraService, useValue: { getCarreras: () => of([]), getCarrerasApostador: () => of([]) } },
          { provide: UsuarioService, useValue: {
            getUsuarios: () => of([{ usuario: 'current', nombre: 'Usuario Actual' }]),
            userById: (id: number) => of({ id: id, usuario: 'current', nombre: 'Usuario Actual' }),
          }},
          { provide: ActivatedRoute, useValue: { snapshot: { params: { userId: '1', userToken: 'token' } } }},
          { provide: Router, useValue: { navigate: () => {} }},
          { provide: ToastrService, useValue: { success: () => {}, error: () => {}, warning: () => {} }}
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ApuestaCreateComponent);
      component = fixture.componentInstance;
    });

    it('should display a list with the current user', () => {
      component.ngOnInit(); 
      fixture.detectChanges(); 

      // obtiene el dropdown donde se listan los apostadores
      const selectElement: HTMLSelectElement = fixture.nativeElement.querySelector('select[formControlName="nombre_apostador"]');

      // verifica que dentro del listado solo se encuentre "Usuario Actual"
      const options = Array.from(selectElement.options);
      const userOption = options.some(option => option.textContent?.trim() === 'Usuario Actual');
      expect(userOption).toBeTrue(); 
      const adminOption = options.some(option => option.textContent?.trim() === 'Administrador');
      expect(adminOption).toBeFalse(); 
    });
  });

  it('should show warning when the token is invalid', () => {
    const toastrService = TestBed.inject(ToastrService);
    spyOn(toastrService, 'warning');

    const usuarioService = TestBed.inject(UsuarioService);
    spyOn(usuarioService, 'getUsuarios').and.returnValue(
      throwError({ statusText: 'UNAUTHORIZED' })
    );

    component.ngOnInit();
    fixture.detectChanges();
    component.getUsuarios();

    expect(toastrService.warning).toHaveBeenCalledWith(
      'Su sesión ha caducado, por favor vuelva a iniciar sesión.',
      'Error de autenticación'
    );
  });

  it('should show error when the token is invalid', () => {
    const toastrService = TestBed.inject(ToastrService);
    spyOn(toastrService, 'error');

    const usuarioService = TestBed.inject(UsuarioService);
    spyOn(usuarioService, 'getUsuarios').and.returnValue(
      throwError({ statusText: 'UNPROCESSABLE ENTITY' })
    );

    component.ngOnInit();
    fixture.detectChanges();
    component.getUsuarios();

    expect(toastrService.error).toHaveBeenCalledWith(
      'No hemos podido identificarlo, por favor vuelva a iniciar sesión.', 'Error'
    );
  });

  it('should reset the form when cancel button is pressed', () => {
    spyOn(component.apuestaForm, 'reset');

    component.userId = 2; 
    component.token = 'token'; 

    component.cancelCreate();

    expect(component.apuestaForm.reset).toHaveBeenCalled();
  });
  
  it('should display error when id is invalid or token is empty', () => {
    spyOn(component, 'showError');
  
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.params.userId = 'invalid';
    route.snapshot.params.userToken = ' ';
  
    component.ngOnInit();
  
    expect(component.showError).toHaveBeenCalledWith(
      'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
    );
  });

  it('should load carreras on initialization', () => {
    const carreraService = TestBed.inject(CarreraService);
    spyOn(carreraService, 'getCarreras').and.returnValue(
      of([{ id: 1, nombre_carrera: 'Carrera 1', abierta: true, usuario: 1, competidores: [], apuestas: [] }])
    );

    component.ngOnInit();  // Llama a ngOnInit

    expect(carreraService.getCarreras).toHaveBeenCalledWith(component.userId, component.token);  // Verifica si el servicio fue llamado
    expect(component.carreras.length).toBe(1);  // Verifica que se cargue una carrera
    expect(component.carreras[0].nombre_carrera).toBe('Carrera 1');  // Verifica el nombre de la carrera
  });

  it('should show an error if carrera service returns an error', () => {
    const toastrService = TestBed.inject(ToastrService);
    spyOn(toastrService, 'error'); 

    const carreraService = TestBed.inject(CarreraService);
    spyOn(carreraService, 'getCarreras').and.returnValue(throwError({ statusText: 'UNPROCESSABLE ENTITY' }));

    component.ngOnInit();
    // Llamada para cargar carreras 
    component.getCarreras(true);  

    expect(toastrService.error).toHaveBeenCalledWith(
      'No hemos podido identificarlo, por favor vuelva a iniciar sesión.', 'Error'
    );
  });


  it('should filter competidores based on selected carrera', () => {
    component.carreras = [
      { id: 1, nombre_carrera: 'Carrera 1', competidores: [{ id: 1, nombre_competidor: 'Competidor 1' , probabilidad: 0.6 }], abierta: true, usuario: 1, apuestas: [] },
      { id: 2, nombre_carrera: 'Carrera 2', competidores: [{ id: 2, nombre_competidor: 'Competidor 2',  probabilidad: 0.4 }], abierta: true, usuario: 1, apuestas: []  }
    ];

    // Llama al método con el ID de la carrera
    component.onCarreraSelect(1);  
     // Verifica que se cargue al menos un competidor
    expect(component.competidores.length).toBe(1); 
    // Verifica el competidor asociado
    expect(component.competidores[0].nombre_competidor).toBe('Competidor 1');  
  });


});