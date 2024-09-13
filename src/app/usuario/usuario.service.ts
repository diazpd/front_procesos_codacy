import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaccion } from './usuario';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private backUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  userLogIn(usuario: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.backUrl}/login`, {
      usuario: usuario,
      contrasena: contrasena,
    });
  }

  userSignUp(
    nombre: string,
    correo: string,
    numero_tarjeta: string,
    usuario: string,
    contrasena: string
  ): Observable<any> {
    return this.http.post<any>(`${this.backUrl}/signin`, {
      nombre: nombre,
      correo: correo,
      numero_tarjeta: numero_tarjeta,
      usuario: usuario,
      contrasena: contrasena,
    });
  }

  getTransacciones(id_Usuario: number, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Transaccion[]>(
      `${this.backUrl}/usuario/${id_Usuario}/transacciones`,
      { headers: headers }
    );
  }

  // Servicio para traer el listado de usuarios

  getUsuarios(token: string): Observable<Usuario[]> {
    // Incluye el token de autenticación
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // retorna la consulta a /usuarios enviando el token
    return this.http.get<Usuario[]>(`${this.backUrl}/usuarios`, {
      headers: headers,
    });
  }

  // Servicio para recargar saldo

  recargarSaldo(
    id_usuario: number,
    monto: number,
    token: string
  ): Observable<any> {
    // Incluye el token de autenticación
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // se incluye el monto
    const body = { monto: monto };

    // realiza la petición POST al endpoint para recargar de saldo
    return this.http.post<any>(
      `${this.backUrl}/usuarios/${id_usuario}/recargar_saldo`,
      body,
      { headers: headers }
    );
  }
  userById(id_usuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.backUrl}/usuario/` + id_usuario);
  }

  actualizarSaldo(id_usuario: number, nuevo_saldo: number): Observable<any> {
    return this.http.post<any>(
      `${this.backUrl}/actualizarSaldo/` + id_usuario + `/` + nuevo_saldo,
      {}
    );
  }
}
