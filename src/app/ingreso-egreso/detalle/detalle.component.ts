import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.models';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ieSubs: Subscription;

  constructor( private store: Store<AppState>,
               private ieService: IngresoEgresoService ) { }

  ngOnInit(): void {
    this.ieSubs = this.store.select('ingresosEgresos')
        .subscribe(ie => this.ingresosEgresos = ie.items );
  }

  ngOnDestroy(): void {
    this.ieSubs.unsubscribe();
  }

  borrarIE(id: string) {
    this.ieService.borrarIE(id)
      .then( () => Swal.fire('Registro eliminado', '', 'success') )
      .catch( err => {
        console.log(err);
        Swal.fire( 'Error', err.message , 'error');
      });
  }

}
