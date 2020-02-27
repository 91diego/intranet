import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  crearUsuario(data) {
    // return data;
    return this.http.post(environment.API_ENDPOINT + '/signup', data);
  }

  login(data) {
    return this.http.post(environment.API_ENDPOINT + '/login', data);
  }
}
