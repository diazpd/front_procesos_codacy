/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UsuarioService } from '../../../app/usuario/usuario.service' // Asegúrate de importar el servicio si lo necesitas
import { Usuario } from 'src/app/usuario/usuario';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule  // Asegúrate de incluir HttpClientModule en los imports
      ],
      declarations: [HeaderComponent],
      providers: [
        UsuarioService,  // Proporciona el servicio que depende de HttpClient
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar "Administrador" cuando el nombre de usuario no está disponible', () => {
    // Simula que el usuario no tiene nombre

    component.usuario = { 'id': 1, 'nombre': '', 'usuario': '', 'numero_tarjeta': '', 'albumes': [], 'saldo': 0 }
    
    fixture.detectChanges(); 

    const userNameElement = fixture.debugElement.query(By.css('#user_name'));

    expect(userNameElement).toBeTruthy();
    expect(userNameElement.nativeElement.textContent).toContain('Administrador');
  });

  it('no debería mostrar el nombre de usuario si no está disponible', () => {
    // Simula que el usuario es undefined

    fixture.detectChanges();

    const userNameElement = fixture.debugElement.query(By.css('#user_name'));

    expect(userNameElement).toBeFalsy();
  });
});
