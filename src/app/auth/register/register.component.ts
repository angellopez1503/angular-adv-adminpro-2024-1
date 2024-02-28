import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  formSubmitted: boolean = false;
  registerForm: FormGroup;

  // public registerForm = this.fb.group(
  //   {
  //     nombre: ['Angel', [Validators.required]],
  //     email: ['angel@gmail.com', [Validators.required, Validators.email]],
  //     password: ['123456', [Validators.required]],
  //     password2: ['123456', [Validators.required]],
  //     terminos: [true, [Validators.required]],
  //   },
  //   {
  //     validators: this.passwordsIguales('password', 'password2'),
  //   }
  // );

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router:Router
    ) {
    this.registerForm = this.fb.group(
      {
        nombre: ['Angel', [Validators.required]],
        email: ['angel@gmail.com', [Validators.required, Validators.email]],
        password: ['123456', [Validators.required]],
        password2: ['123456', [Validators.required]],
        terminos: [true, [Validators.required]],
      },
      {
        validators: this.passwordsIguales('password', 'password2'),
      }
    );
  }

  ngOnInit(): void {}

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      (res) => {
        console.log('Usuario creado');
        console.log(res);
        this.router.navigateByUrl('/')
      },
      (err) => {
        // console.warn(err.error.msg)
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    };
  }
}
