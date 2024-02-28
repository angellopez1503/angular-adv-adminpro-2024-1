import { UsuarioService } from './../../services/usuario.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  public formSubmitted = false;
  public loginForm: FormGroup;
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.loginForm = this.fb.group({
      email: [
        localStorage.getItem('email') || '',
        [Validators.required, Validators.email],
      ],
      password: ['', [Validators.required]],
      remember: [false],
    });
  }
  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '318547878338-dghcrlqiib1bvrk48jfm4e1iutbln3mj.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large', shape: 'pill' } // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential);
    this.usuarioService.loginGoogle(response.credential).subscribe((res) => {
      console.log({ login: res });
      this.router.navigateByUrl('/')
    });
  }

  ngOnInit(): void {}

  login() {
    // console.log(this.loginForm.value);

    //  this.router.navigateByUrl('/')

    this.usuarioService.login(this.loginForm.value).subscribe(
      (res) => {
        console.log(res);
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/')
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }
}
