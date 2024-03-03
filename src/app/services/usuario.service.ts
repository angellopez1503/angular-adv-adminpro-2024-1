import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';

import { tap, map, Observable, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  usuario!:Usuario

  constructor(private http: HttpClient, private router: Router) {
    this.googleInit();
  }

  get token():string{
    return localStorage.getItem('token') || ''
  }

  get uid():string{
    return this.usuario.uid || ''
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '318547878338-dghcrlqiib1bvrk48jfm4e1iutbln3mj.apps.googleusercontent.com',
    });
  }

  logout() {
    localStorage.removeItem('token');

    google.accounts.id.revoke('angellopez15luisa@gmail.com', () => {
      this.router.navigateByUrl('/login');
    });
  }

  validarToken(): Observable<boolean> {

    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token
        },
      })
      .pipe(
        map((res: any) => {
          const { email,google,nombre,role,img='',_id } = res.usuario
          this.usuario = new Usuario(nombre,email,'',role,google,img,_id)
          localStorage.setItem('token', res.token);
          return true
        }),

        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  actualizarPerfil(data:{email:string,nombre:string,role?:string}){

    data={
      ...data,
      role:this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`,data,{
      headers:{
        'x-token':this.token
      }
    })
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((res: any) => {
        // console.log(res);
        localStorage.setItem('token', res.token);
      })
    );
  }
}
