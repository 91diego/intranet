import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  API_ENDPOINT = 'https://administracion.idex.cc/api';
  private iss = {
    login: environment.API_ENDPOINT + '/login',
    signup: environment.API_ENDPOINT + '/signup'
  };

  constructor() { }

  handle(token: any) {
    this.set(token);
  }

  set(token: any) {
    localStorage.setItem('token', token);
  }

  get() {

    return localStorage.getItem('token');
  }

  remove() {

    localStorage.removeItem('token');
  }

  isValid() {

    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }
    }

    return false;
  }
  payload(token: any) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload: any) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.isValid();
  }
}
