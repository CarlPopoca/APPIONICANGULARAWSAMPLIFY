import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { AuthGuardService } from '../services/auth-guard.service';
import { AmplifyService }  from 'aws-amplify-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [],  
})
export class HomePage implements AfterContentInit {

  authState: any;
  // including AuthGuardService here so that it's available to listen to auth events
  authService: AuthGuardService

  amplifyService: AmplifyService

  constructor(public events: Events, public guard: AuthGuardService, public amplify: AmplifyService) {
    this.authState = {loggedIn: false};
    this.authService = guard;
    this.amplifyService = amplify;
    //Se crea la suscripción a la escucha del estado de autenticación de AWS Amplify
    this.amplifyService.authStateChange$
    .subscribe(authState => {
      this.authState.loggedIn = authState.state === 'signedIn';
      //Se notifica cuando el usuario inicia o cierra sesión
      this.events.publish('data:AuthState', this.authState)
      console.log(this.amplifyService);
    });
  }

  ngAfterContentInit(){
    this.events.publish('data:AuthState', this.authState)
  }

  login() {
    this.authState.loggedIn = true;
    this.events.publish('data:AuthState', this.authState)
  }

  logout() {
    this.authState.loggedIn = false;
    this.events.publish('data:AuthState', this.authState)
  }
}
