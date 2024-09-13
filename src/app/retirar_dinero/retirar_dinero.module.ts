import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Retirar_dineroComponent } from './retirar_dinero.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApuestaService } from '../apuesta/apuesta.service';
import { Carrera, Competidor, Apuesta } from '../carrera/carrera';
import { CarreraService } from '../carrera/carrera.service';
import { AppHeaderModule } from "../app-header/app-header.module";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [Retirar_dineroComponent],
  imports: [CommonModule,ToastrModule,AppHeaderModule],
  exports: [Retirar_dineroComponent]
})
export class Retirar_dineroModule {
}
