import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Desarrollo } from '../interfaces/desarrollo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DesarrolloService {

  constructor(private httpClient: HttpClient) { }
  guardar(desarrollo: Desarrollo) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    return this.httpClient.post(environment.API_ENDPOINT + '/desarrollos', desarrollo, {headers});
  }
  editarCosto(datos: Desarrollo) {
    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/desarrollos/' + datos.id, datos, {headers});
  }
  editarFechaInicio(datos: Desarrollo) {
    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/desarrollos/' + datos.id, datos, {headers});
  }
}