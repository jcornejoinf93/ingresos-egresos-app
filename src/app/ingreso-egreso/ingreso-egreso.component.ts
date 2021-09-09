import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.models';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor( private fb: FormBuilder,
               private ieService: IngresoEgresoService,
               private store: Store<AppState> ) { }

  ngOnInit(): void {
    this.ingresForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });

    this.loadingSubs = this.store.select('ui').subscribe(resp => this.cargando = resp.isLoading );
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  guardar() {

    if (this.ingresForm.invalid) { return; }

    this.store.dispatch(ui.isLoading());

    const { descripcion, monto } = this.ingresForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ieService.crearIngresoEgreso(ingresoEgreso)
      .then( () => {
        this.ingresForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire(descripcion, 'Correctamente agregado', 'success');
      })
      .catch( err => {
        console.warn(err);
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error', err.message, 'error');
      });

  }

}
