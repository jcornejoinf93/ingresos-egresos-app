import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  iniciarSesion() {

    const { email, password } = this.formLogin.value;

    if ( this.formLogin.invalid ) { return; }

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.loginUsuario(email, password)
          .then( acceso => {
            // console.log(acceso);
            Swal.close();
            this.router.navigateByUrl('/');
          })
          .catch( error => {
            // console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'No se ha podido iniciar sesión',
              text: error.message,
            });
          } );

  }

}
