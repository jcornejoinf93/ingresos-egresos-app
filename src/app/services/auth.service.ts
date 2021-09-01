import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore,
               private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      // console.log(fuser);
      // console.log(fuser?.uid);
      // console.log(fuser?.email);
      if (fuser) {
      this.userSubscription =  this.firestore.doc(`${ fuser?.uid }/usuario`).valueChanges()
              .subscribe( (firestoreUser: any) => {
                const user = Usuario.fromFirebase(firestoreUser);
                this.store.dispatch( authActions.setUser({ user }) );
              });


      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
      }
    });
  }

  crearUsuario( nombre: string, email: string, password: string ) {
    return this.auth.createUserWithEmailAndPassword(email, password)
        .then(fbUser => {
          const newUSer = new Usuario(fbUser.user.uid, nombre, email);
          return this.firestore.doc(`${fbUser.user.uid}/usuario`).set({...newUSer});
        });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbuser => fbuser != null )
    );
  }

}
