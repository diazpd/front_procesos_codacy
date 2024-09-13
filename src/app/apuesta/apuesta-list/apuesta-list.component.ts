import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarreraService } from 'src/app/carrera/carrera.service';
import { Apuesta } from '../apuesta';
import { ApuestaService } from '../apuesta.service';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { Usuario } from 'src/app/usuario/usuario';


@Component({
  selector: 'app-apuesta-list',
  templateUrl: './apuesta-list.component.html',
  styleUrls: ['./apuesta-list.component.css']
})
export class ApuestaListComponent implements OnInit {

  constructor(
    public apuestaService: ApuestaService,
    public carreraService: CarreraService,
    public usuarioService: UsuarioService,
    public routerPath: Router,
    public router: ActivatedRoute,
    public toastr: ToastrService
  ) { }

  userId: number
  usuario: Usuario
  token: string
  apuestas: Array<Apuesta>
  mostrarApuestas: Array<Apuesta>
  apuestaSeleccionada: Apuesta
  indiceSeleccionado: number = 0
  nombreCarrera: string
  nombreCompetidor: string


  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      // Obtener los datos del usuario
      this.getUser();
    }
  }

  getUser(): void {
    this.usuarioService.userById(this.userId).subscribe(user => {
      // Guardar los datos del usuario
      this.usuario = user

      // Obtener la listas de las apuestas
      this.getApuestas();

    }, (error) => {
      this.showError("El usuario no existe")
    })
  }

  getApuestas(): void{
    // Validar si el usuario es admin o no
    if (this.usuario.usuario.toUpperCase() === 'ADMIN') {
      // Si el ususario es admin, traer toda la lista de apuestas
      this.apuestaService.getApuestas(this.token)
      .subscribe(apuestas => {
        this.apuestas = apuestas
        this.mostrarApuestas = apuestas
        this.onSelect(this.mostrarApuestas[0], 0)
      })
    } else {
      // Si el usuario es apostador, traer solo la lista de las apuestas que le pertenecen
      this.apuestaService.getApuestasApostador(this.userId, this.token)
      .subscribe(apuestas => {
        this.apuestas = apuestas
        this.mostrarApuestas = apuestas
        this.onSelect(this.mostrarApuestas[0], 0)
      })
    }
   
  }

  onSelect(apuesta: Apuesta, indice: number) {
    if (apuesta != null) {
      this.indiceSeleccionado = indice
      this.apuestaSeleccionada = apuesta
      // Obtener la info de la carrera de la apuesta
      this.getInfo()
    }
  }

  getInfo(): void {
    this.carreraService.getCarrera(this.apuestaSeleccionada.id_carrera, this.token)
      .subscribe(carrera => {
        this.nombreCarrera = carrera.nombre_carrera
        var competidor = carrera.competidores.filter(x => x.id == this.apuestaSeleccionada.id_competidor)[0]
        this.nombreCompetidor = competidor.nombre_competidor
      },
        error => {
          if (error.statusText === "UNAUTHORIZED") {
            this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
          }
          else if (error.statusText === "UNPROCESSABLE ENTITY") {
            this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
          }
          else {
            this.showError("Ha ocurrido un error. " + error.message)
          }
        })
  }

  buscarApuesta(busqueda: string) {
    let apuestasBusqueda: Array<Apuesta> = []
    this.apuestas.map(apuesta => {
      if (apuesta.nombre_apostador.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())) {
        apuestasBusqueda.push(apuesta)
      }
    })
    this.mostrarApuestas = apuestasBusqueda
  }

  irCrearApuesta() {
    this.routerPath.navigate([`/apuestas/crear/${this.userId}/${this.token}`])
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La apuesta fue eliminada`, "Eliminada exitosamente");
  }

}
