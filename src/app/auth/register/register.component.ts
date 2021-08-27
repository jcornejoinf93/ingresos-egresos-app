import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  crearUsuario() {

    if (this.registroForm.invalid) { return; }

    const { nombre, correo, password } = this.registroForm.value;

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.crearUsuario(  nombre, correo, password )
              .then(credenciales => {
                // console.log(credenciales);
                Swal.close();
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
