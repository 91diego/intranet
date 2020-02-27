import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Prototipo } from '../interfaces/prototipo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrototipoService {

  constructor(private httpClient: HttpClient) { }

  /* GUARDA INFORMACION EN LA TABLA PROTOTIPO DE LA BD */
  guardarPrototipo(prototipo: Prototipo) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    return this.httpClient.post(environment.API_ENDPOINT + '/prototipos', prototipo, {headers});
  }

  /*
    METODO QUE EDITA EL REGISTRO DE LA BASE DE DATOS
  */
  editarPrototipo(prototipo: Prototipo) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/prototipos/' + prototipo.id, prototipo, {headers});
  }
}
