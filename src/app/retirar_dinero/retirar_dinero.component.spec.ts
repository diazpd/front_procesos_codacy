import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Retirar_dineroComponent } from './retirar_dinero.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UsuarioService } from '../usuario/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../app-header/header/header.component';

describe('RetirarSaldoComponent', () => {
  let component: Retirar_dineroComponent;
  let fixture: ComponentFixture<Retirar_dineroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Retirar_dineroComponent, HeaderComponent], // Declara el componente y el header
      imports: [FormsModule, HttpClientModule, RouterTestingModule,
        HttpClientModule, ToastrModule.forRoot()],  // Configura ToastrModule en el módulo de pruebas] ,
      providers: [
        UsuarioService,
        ToastrService,
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Retirar_dineroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia mostrar el balance', () => {
    component.saldo = '$10000';
    fixture.detectChanges();
    const balanceLabel = fixture.debugElement.query(By.css('label[for="id_carrera"]')).nativeElement;
    expect(balanceLabel.textContent).toBeTruthy();
  });

  it('deberia permitir mostrar el boton Retirar', () => {
    component.permiteRetirar = true;
    fixture.detectChanges();
    const retirarButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(retirarButton.disabled).toBeFalse();
  });

  it('No deberia permitir mostrar el boton de retirar', () => {
    component.permiteRetirar = false;
    fixture.detectChanges();
    const retirarButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(retirarButton.disabled).toBeFalse();
  });

  it('deberia mostrar el mensaje de advertencia', () => {
    component.mensajeAdvertencia = 'El retiro mínimo es de 10000.';
    fixture.detectChanges();
    const warningAlert = fixture.debugElement.query(By.css('.alert-danger')).nativeElement;
    expect(warningAlert.textContent).toContain('El retiro mínimo es de 10000.');
  });

  it('deberia mostrar el mensaje de saldo actualizado', () => {
    component.mensajeSaldoActualizado = 'Saldo actualizado correctamente.';
    fixture.detectChanges();
    const successAlert = fixture.debugElement.query(By.css('.alert-info')).nativeElement;
    expect(successAlert.textContent).toContain('Saldo actualizado correctamente.');
  });

  it('debria renderizar el encabezado', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
  });
});
