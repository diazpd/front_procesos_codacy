import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/usuario/usuario';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //variable encargada de mostrar el nombre del usuario en sesión
  public usuario: Usuario;
  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    const userId = parseInt(this.router.snapshot.params.userId)

    this.usuarioService.userById(userId).subscribe(u => {
      this.usuario = u;  
      //console.log("--------usuario: "+JSON.stringify(this.usuario));

    }, (error) => {
      console.error('Error al obtener el usuario:', error);
    });

    
  }

  goTo(menu: string) {
    const userId = parseInt(this.router.snapshot.params.userId)
    const token = this.router.snapshot.params.userToken
    if (menu === "logIn") {
      this.routerPath.navigate([`/`])
    }
    else if (menu === "carrera") {
      this.routerPath.navigate([`/carreras/${userId}/${token}`])
    }
    else if (menu === "transacciones") {
      this.routerPath.navigate([`/transacciones/${userId}/${token}`])
    }
    else if (menu === "recargas") {
      this.routerPath.navigate([`/recargas/${userId}/${token}`])
    }
    else if (menu === "retirar_dinero") {
      this.routerPath.navigate([`/retirar_dinero/${userId}/${token}`])
    } 
    else {
      this.routerPath.navigate([`/apuestas/${userId}/${token}`])
    }
  }

}
