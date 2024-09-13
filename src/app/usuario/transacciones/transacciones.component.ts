import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario.service';
import { Transaccion } from '../usuario';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.css'
})
export class TransaccionesComponent {

  userId: number
  token: string
  transacciones: Array<Transaccion> = [];

  constructor(private router: ActivatedRoute, private toastr: ToastrService, private usuarioService:UsuarioService) { }

  ngOnInit() {
    //Se valida si se envia el id del usuario y el token
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    } else {
      // Se almacenan las variables y se ejecuta la funcion que consulta las transacciones
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getTransacciones();
    }
  }

  //Se consultan las transacciones
  getTransacciones(): void {
    this.usuarioService.getTransacciones(this.userId, this.token)
      .subscribe((transacciones) => {
        //Se listan las transacciones
        this.transacciones = transacciones;
      })
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

}
