import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Piso } from '../interfaces/piso';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PisoService {

  constructor(private httpClient: HttpClient) { }

  /*
    METODO PARA GENERAR UN NUEVO REGISTRO
    RECIBE COMO PARAMETRO OBJETO TIPO PISO
  */
 crearPiso(piso: Piso) {

    const headers = new HttpHeaders( {'Content-Type': 'aplication/json'} );
    return this.httpClient.post(environment.API_ENDPOINT + '/pisos', piso, {headers});
  }

  /*
    METODO QUE EDITA EL REGISTRO DE LA BASE DE DATOS
  */
 editarPiso(piso: Piso) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/pisos/' + piso.id, piso, {headers});
 }

}
