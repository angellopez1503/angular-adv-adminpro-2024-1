import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';

import { tap, map, Observable, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuario!: Usuario;

  constructor(private http: HttpClient, private router: Router) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role():'ADMIN_ROLE'|'USER_ROLE'|undefined{
    return this.usuario.role
  }

  get uid(): string {
    return this.usuario._id || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '318547878338-dghcrlqiib1bvrk48jfm4e1iutbln3mj.apps.googleusercontent.com',
    });
  }

  guardarLocalStorage(token:string,menu:any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu))
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu')

    google.accounts.id.revoke('angellopez15luisa@gmail.com', () => {
      this.router.navigateByUrl('/login');
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((res: any) => {
        const { email, google, nombre, role, img = '', _id } = res.usuario;
        this.usuario = new Usuario(nombre, email, '', role, google, img, _id);
        this.guardarLocalStorage(res.token,res.menu)
        return true;
      }),

      catchError((error) => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((res: any) => {
        this.guardarLocalStorage(res.token,res.menu)
      })
    );
  }

  actualizarPerfil(data: { email: string; nombre: string; role?: string }) {
    data = {
      ...data,
      role: this.usuario.role,
    };
    console.log(data);


    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((res: any) => {
        this.guardarLocalStorage(res.token,res.menu)
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((res: any) => {
        this.guardarLocalStorage(res.token,res.menu)
      })
    );
  }

  cargarUsuarios(desde: number = 0,limit:number=5) {
    const url = `${base_url}/usuarios?desde=${desde}&limit=${limit}`;
    return this.http.get<CargarUsuarios>(url, this.headers)
    .pipe(
      map(
        res => {
          console.log(res);
          const usuarios = res.usuarios.map(user=>new Usuario(user.nombre,user.email,'',user.role,user.google,user.img,user._id))
          return {
            usuarios,
            total:res.total
          }
        }
      )
    )
  }

  eliminarUsuario(usuario:Usuario){

    console.log(usuario);

    const url = `${base_url}/usuarios/${usuario._id}`
    return this.http.delete(url,this.headers)
  }

  guardarUsuario(usuario:Usuario){

    return this.http.put(`${base_url}/usuarios/${usuario._id}`,usuario,this.headers)
  }
}
