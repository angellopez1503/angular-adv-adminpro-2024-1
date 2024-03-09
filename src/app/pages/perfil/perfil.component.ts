import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  usuario!: Usuario;
  imagenSubir!: File;
  imgTemp: any = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      () => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire(
          'Guardado',
          'Los datos se actualizaron correctamente',
          'success'
        );
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }
  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario._id!)
      .then(
        (res) => {
          console.log(res);
          this.usuario.img = res;
          Swal.fire('Guardado', 'La imagen se guardo correctamente', 'success');
        },
      ).catch(err =>{
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }
}
