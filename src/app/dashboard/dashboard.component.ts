import { Component, OnInit, OnDestroy } from '@angular/core';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import { Store } from '@ngrx/store';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';

import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AppState } from '../app.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosSubs: Subscription;

  constructor( private store: Store<AppState>,
               private ieServices: IngresoEgresoService ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
        .pipe(
          filter( auth => auth.user != null )
        )
        .subscribe( ({user}) => {
          this.ingresosSubs = this.ieServices.initIngresosEgresosListener(user.uid)
              .subscribe(ingresosEgresosFB => {
                this.store.dispatch(ieActions.setItems({ items : ingresosEgresosFB }));
              });
        });
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
    this.ingresosSubs?.unsubscribe();
  }

}
