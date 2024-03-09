import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CargarUsuarios } from '../../../interfaces/cargar-usuarios.interface';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit,OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public limit: number = 5;
  public cargando: boolean = false;
  public imgSubs! :Subscription

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService:ModalImagenService
  ) {}


  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(200)
    )
    .subscribe(
      res => this.cargarUsuarios()
    )
  }

  ngOnDestroy(): void {

    this.imgSubs.unsubscribe()
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarios = [];
    this.usuariosTemp = [];
    this.usuarioService
      .cargarUsuarios(this.desde, this.limit)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    this.usuarios = [];
    this.cargando = true;
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      this.cargando = false;
      return;
    }

    this.busquedasService.buscar('usuarios', termino).subscribe((res) => {
      this.usuarios = res;
      this.cargando = false;
    });
  }

  eliminarUsuario(usuario: Usuario) {

    if(usuario._id === this.usuarioService.uid){
      Swal.fire('Error','No puede borrarse a si mismo','error')
      return
    }

    Swal.fire({
      title: 'Borrar Usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe((res) => {
          Swal.fire(
            'Borrado',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          );
          this.cargarUsuarios()
        });
      }
    });
  }

  cambiarRole(usuario:Usuario){
    console.log(usuario);
    this.usuarioService.guardarUsuario(usuario)
    .subscribe(
      res=> {
        console.log(res);
      }
    )
  }

  abrirModal(usuario:Usuario){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios',usuario._id,usuario.img)
  }

}
