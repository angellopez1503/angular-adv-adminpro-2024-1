import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

//  public imgUrl :string = ''
 public usuario!:Usuario

  constructor(
    private usuarioService:UsuarioService,
    private router:Router
  ) {

    // this.imgUrl = usuarioService.usuario.imagenUrl
    this.usuario = usuarioService.usuario
  }

  ngOnInit(): void {
  }

  logout(){
    this.usuarioService.logout()
  }

  buscar(termino:string){
    console.log(termino);
    if(termino.length === 0){
      return
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`)
  }

}
