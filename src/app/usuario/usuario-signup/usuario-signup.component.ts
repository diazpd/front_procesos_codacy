import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario.service';



@Component({
  selector: 'app-usuario-signup',
  templateUrl: './usuario-signup.component.html',
  styleUrls: ['./usuario-signup.component.css']
})
export class UsuarioSignupComponent implements OnInit {

  helper = new JwtHelperService();
  usuarioForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    //Se añaden los nuevos campos del formulario de registro con sus validaciones
    this.usuarioForm = this.formBuilder.group({
      nombre: ["", [Validators.required, Validators.maxLength(100)]],
      correo: ["", [Validators.required, Validators.maxLength(100), Validators.email]],
      numero_tarjeta: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(19), Validators.pattern("^[0-9]*$")]],// Se agrega la validacion de numero de tarjeta minimo 16 numeros y maximo 19
      usuario: ["", [Validators.required, Validators.maxLength(50)]],
      password: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: [""]
    })
  }

  validarNumeros(event: KeyboardEvent): void { // Valida que los valores ingresados sean numeros, si no lo son no los permite en el campo
    const tecla = event.key;
    if (!/^\d$/.test(tecla) && tecla !== 'Backspace' && tecla !== 'Tab') {
      event.preventDefault();
    }
  }

  registrarUsuario() {
    const nombre = this.usuarioForm.get('nombre')?.value;
    const correo = this.usuarioForm.get('correo')?.value;
    const numero_tarjeta = this.usuarioForm.get('numero_tarjeta')?.value;
    const usuario = this.usuarioForm.get('usuario')?.value;
    const password = this.usuarioForm.get('password')?.value;

    this.usuarioService.userSignUp(nombre, correo, numero_tarjeta, usuario, password)
      .subscribe(res => {
        const decodedToken = this.helper.decodeToken(res.token);
        this.router.navigate([`/apuestas/${decodedToken.sub}/${res.token}`])
        this.showSuccess()
      },
        error => {
          this.showError(error.error ? error.error : `Ha ocurrido un error: ${error.message}`)
        })
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showSuccess() {
    this.toastr.success(`Se ha registrado exitosamente`, "Registro exitoso");
  }

}
