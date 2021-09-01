import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  formLogin: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState> ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['jcornejo@google.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(5)]],
    });

    this.uiSubscription =  this.store.select('ui').subscribe(resp => {
                                // console.log('cargando subs');
                                this.cargando = resp.isLoading;
                              });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  iniciarSesion() {

    const { email, password } = this.formLogin.value;

    if ( this.formLogin.invalid ) { return; }

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    this.authService.loginUsuario(email, password)
          .then( acceso => {
            // Swal.close();
            this.store.dispatch(ui.stopLoading());
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
