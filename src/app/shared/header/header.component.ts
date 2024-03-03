import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

//  public imgUrl :string = ''
 public usuario!:Usuario

  constructor(
    private usuarioService:UsuarioService
  ) {

    // this.imgUrl = usuarioService.usuario.imagenUrl
    this.usuario = usuarioService.usuario
  }

  ngOnInit(): void {
  }

  logout(){
    this.usuarioService.logout()
  }

}
