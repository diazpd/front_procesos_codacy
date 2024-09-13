import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera, Competidor } from 'src/app/carrera/carrera';
import { CarreraService } from 'src/app/carrera/carrera.service';
import { Apuesta } from '../apuesta';
import { ApuestaService } from '../apuesta.service';
import { Usuario } from 'src/app/usuario/usuario';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-apuesta-create',
  templateUrl: './apuesta-create.component.html',
  styleUrls: ['./apuesta-create.component.css'],
})
export class ApuestaCreateComponent implements OnInit {
  userId: number;
  token: string;
  apuestaForm: FormGroup;
  carreras: Array<Carrera>;
  competidores: Array<Competidor>;
  // lista de usuarios
  usuarios: Array<Usuario>; 
  //variable encargada de cargar la información del usuario en la sesión actual
  public usuario: Usuario;

  constructor(
    private apuestaService: ApuestaService,
    private carreraService: CarreraService,
    // servicio para traer la lista de usuarios
    private usuarioService: UsuarioService, 
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService
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
      this.apuestaForm = this.formBuilder.group({
        id_carrera: ['', [Validators.required]],
        id_competidor: ['', [Validators.required]],
        nombre_apostador: ['', [Validators.required]],
        valor_apostado: [0, [Validators.required]],
      });
      // obtener id del usuario actual
      const userId = parseInt(this.router.snapshot.params.userId)
      this.usuarioService.userById(userId).subscribe(user => {
        this.usuario = user;  
      }, (error) => {
        console.error('Error al obtener el usuario:', error);
      });
      
      // llamado a la función para traer la lista de usuarios
      this.getUsuarios();
    }
  }

  onCarreraSelect(event: any): void {
    if (event != null && event != '') {
      var carreraSeleccionada = this.carreras.filter((x) => x.id == event)[0];
      this.competidores = carreraSeleccionada.competidores;
    }
  }

  getCarreras(admin: boolean): void {
    if (admin) {
      this.carreraService.getCarreras(this.userId, this.token).subscribe(
        (carreras) => {
          this.carreras = carreras;
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
    } else {
      this.carreraService.getCarrerasApostador(this.token).subscribe(
        (carreras) => {
          this.carreras = carreras;
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
   
  }

  // función para obtener el listado de usuarios
  getUsuarios(): void {
    this.usuarioService.getUsuarios(this.token).subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        usuarios.forEach((user) => {
          // Muestra el nombre "Administrador" cuando el usuario es admin
          if (user.usuario === 'admin') {
            user.nombre = 'Administrador';
            // traer carreras creadas por el apostador
            this.getCarreras(true);
          } else if (user.usuario === this.usuario.usuario) {
            // Muestra solo el usuario apostador en el listado, cuando está en su cuenta
            this.usuarios = [];
            this.usuarios.push(user);
            // Traer todas las carreas
            this.getCarreras(false);
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

  createApuesta(newApuesta: Apuesta) {
    this.apuestaService.crearApuesta(newApuesta, this.token).subscribe(
      (apuesta) => {
        this.showSuccess(apuesta);
        this.apuestaForm.reset();
        this.routerPath.navigate([`/apuestas/${this.userId}/${this.token}`]);
      },
      (error) => {
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

  cancelCreate() {
    this.apuestaForm.reset();
    this.routerPath.navigate([`/apuestas/${this.userId}/${this.token}`]);
  }

  showError(error: string) {
    this.toastr.error(error, 'Error');
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, 'Error de autenticación');
  }

  showSuccess(apuesta: Apuesta) {
    this.toastr.success(`La apuesta fue creada`, 'Creación exitosa');
  }
}
