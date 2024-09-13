import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Usuario } from '../usuario';
import { Transaccion } from '../usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-recargas',
  templateUrl: './recargas.component.html',
  styleUrls: ['./recargas.component.css'],
})
export class RecargasComponent implements OnInit {
  recargaForm: FormGroup;
  usuarios: Array<Usuario>; // Lista de usuarios
  userId: number;
  token: string;
  monto: number;
  saldo: number;
  numero_tarjeta: string;
  //variable encargada de cargar la información del usuario en la sesión actual
  public usuario: Usuario;

  constructor(
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private routerPath: Router
  ) {}

  ngOnInit() {
    if (
      !parseInt(this.router.snapshot.params.userId) ||
      this.router.snapshot.params.userToken === ' '
    ) {
      this.showError(
        'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
      );
    } else {
      this.userId = parseInt(this.router.snapshot.params.userId);
      this.token = this.router.snapshot.params.userToken;
      this.recargaForm = this.formBuilder.group({
        monto: [0, [Validators.required]],
      });
      // obtener id del usuario actual
      const userId = parseInt(this.router.snapshot.params.userId);
      this.usuarioService.userById(userId).subscribe(
        (user) => {
          this.usuario = user;
        },
        (error) => {
          console.error('Error al obtener el usuario:', error);
        }
      );

      // Llamado a la función para traer la lista de usuarios
      this.getUsuarios();
    }
  }

  // función para obtener el número de la tarjeta y saldo
  getUsuarios(): void {
    this.usuarioService.getUsuarios(this.token).subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        console.log(usuarios);
        usuarios.forEach((user) => {
          // consulta para el usuario admin
          if (user.usuario === 'admin') {
            this.numero_tarjeta = 'Tarjeta Administrador';
            if (user.saldo === null) {
              this.usuario.saldo = 0;
              this.saldo = this.usuario.saldo;
            } else {
              this.saldo = user.saldo;
            }
          } else if (user.usuario === this.usuario.usuario) {
            // consulta para el apostador
            this.numero_tarjeta = user.numero_tarjeta;
            if (user.saldo === null) {
              this.usuario.saldo = 0;
              this.saldo = this.usuario.saldo;
            } else {
              this.saldo = user.saldo;
            }
          }
        });
      },
      (error) => {
        console.log(error);
        if (error.statusText === 'UNAUTHORIZED') {
          this.showWarning(
            'Su sesión ha caducado, por favor vuelva a iniciar sesión.'
          );
        } else if (error.statusText === 'UNPROCESSABLE ENTITY') {
          this.showError(
            'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
          );
        } else {
          this.showError('Ha ocurrido un error. ' + error.message);
        }
      }
    );
  }


  // función para recargar saldo
  recargarSaldo() {
    this.monto = parseInt(this.recargaForm.get('monto')?.value);
    console.log(this.monto);
    console.log(this.userId);
    console.log(this.token);

    // validación del monto a recargar, debe ser mayor que cero
    if (isNaN(this.monto) || this.monto <= 0) {
      this.showError('Monto inválido. Debe ser un número mayor a cero.');
      return;
    }

    // envío al backend
    if (this.recargaForm.valid) {
      this.usuarioService
        .recargarSaldo(this.userId, this.monto, this.token)
        .subscribe(
          (response) => {
            console.log('Recarga exitosa', response);
            console.log('Saldo recargado');
            this.toastr.success('Saldo recargado exitosamente');
            this.recargaForm.reset();
            // obtener id del usuario actual para actualizar su saldo
            const userId = parseInt(this.router.snapshot.params.userId);
            this.usuarioService.userById(userId).subscribe(
              (user) => {
                this.usuario = user;
                this.saldo = this.usuario.saldo;
              },
              (error) => {
                console.error('Error al obtener el usuario:', error);
              }
            );
          },
          (error) => {
            console.error('Error en la recarga', error);
            this.showError('Error en la recarga');
          }
        );
    }
  }

  showError(error: string) {
    this.toastr.error(error, 'Error');
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, 'Error de autenticación');
  }

  cancelarRecarga() {
    this.recargaForm.reset();
    this.routerPath.navigate([`/recargar_saldo/${this.userId}/${this.token}`]);
  }
}
