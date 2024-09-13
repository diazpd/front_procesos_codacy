import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioLoginComponent } from './usuario-login/usuario-login.component';
import { UsuarioSignupComponent } from './usuario-signup/usuario-signup.component';
import { TransaccionesComponent } from './transacciones/transacciones.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { RecargasComponent } from './recargas/recargas.component';


@NgModule({
  declarations: [UsuarioLoginComponent, UsuarioSignupComponent, TransaccionesComponent, RecargasComponent],
  imports: [
    CommonModule, ReactiveFormsModule, AppHeaderModule
  ],
  exports: [UsuarioLoginComponent, UsuarioSignupComponent, TransaccionesComponent, RecargasComponent]
})
export class UsuarioModule { }
