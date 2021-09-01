import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState> ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.uiSubscription = this.store.select('ui').subscribe(resp => {
      this.cargando = resp.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {

    if (this.registroForm.invalid) { return; }

    const { nombre, correo, password } = this.registroForm.value;

    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    this.authService.crearUsuario(  nombre, correo, password )
              .then(credenciales => {
                this.store.dispatch(ui.stopLoading());
                // Swal.close();
                this.router.navigateByUrl('/');
              })
              .catch( error => {
                // console.error(error);
                Swal.fire({
                  icon: 'error',
                  title: 'Usuario no fue registrado',
                  text: error.message,
                });
              });

  }

}
