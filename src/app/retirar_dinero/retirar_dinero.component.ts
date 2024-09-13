import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { Usuario } from '../usuario/usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-retirar_dinero',
  templateUrl: './retirar_dinero.component.html',
  styleUrls: ['./retirar_dinero.component.css']
})
export class Retirar_dineroComponent implements OnInit {

  userId: number;
  token: string;
  retiroDineroForm!: FormGroup;
  saldo: string = "";
  usuario: Usuario;
  permiteRetirar: boolean = false;
  valorRetiro: number = 0;
  mensajeAdvertencia: string = "";
  mensajeSaldoActualizado: string = "";

  constructor(
    private usuarioService: UsuarioService,
    private router: ActivatedRoute,
    private toastr: ToastrService) {
 
  }

  ngOnInit() {

    this.permiteRetirar = false;
    this.valorRetiro = 0;
    this.mensajeAdvertencia = "";
    this.mensajeSaldoActualizado = "";

    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken

      this.usuarioService.userById(this.userId).subscribe(u => {
        this.usuario = u;

        if (this.usuario !== undefined && this.usuario.saldo > 0) {
          this.saldo = "$" + this.usuario.saldo;
        } else {
          this.saldo = "$ 0";
        }

        
      }, (error) => {
        this.showError('Error al obtener el usuario.');
        console.error('Error al obtener el usuario:', error);
      });

    }

  }

  onValorRetiroChange(event: any): void {
    this.valorRetiro = event.target.value;

    if (this.usuario !== undefined && this.usuario.saldo > 10000 && this.valorRetiro < 10000) {
      this.mensajeAdvertencia = 'El retiro mínimo es de 10000.';
      this.permiteRetirar = false;
    }
    else
      if (this.usuario !== undefined && this.usuario.saldo > 10000) {

        if (this.usuario.saldo - this.valorRetiro >= 0) {
          this.mensajeAdvertencia = ''; // Limpiar el mensaje si no hay errores


          this.permiteRetirar = true;
        } else {
          this.mensajeSaldoActualizado = ""
          this.mensajeAdvertencia = 'El retiro no puede exceder el saldo disponible.';
          this.permiteRetirar = false;
        }
      } else {
        this.permiteRetirar = false;
        this.mensajeAdvertencia = 'Verifique que el saldo sea mayor a 10000.';
        this.mensajeSaldoActualizado = ""
      }

  }

  retirar(): void {

    const confirmacion = confirm('¿Está seguro de que desea realizar este retiro?');
    if (confirmacion) {

      if (this.permiteRetirar && this.valorRetiro >= 10000) {
        this.usuario.saldo = (this.usuario.saldo - this.valorRetiro);

        this.usuarioService.actualizarSaldo(this.userId, this.usuario.saldo).subscribe(u => {
          this.usuario = u;

          if (this.usuario !== undefined && this.usuario.saldo >= 0) {
            this.saldo = "$ " + this.usuario.saldo;
            this.mensajeSaldoActualizado = "Saldo actualizado correctamente."
            this.valorRetiro = 0;
            this.permiteRetirar=false;
          } else {
            this.saldo = "$ 0";
          }

        
        }, (error) => {
          this.showError('Error al actualizar el saldo del usuario');
          console.error('Error al actualizar el saldo del usuario', error);
        });
      }

    }

  }


  validarNumero(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

} 
