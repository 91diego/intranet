import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plusvalia } from '../interfaces/plusvalia';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlusvaliaService {

  constructor(private httpClient: HttpClient) { }

  /*
    METODO PARA GENERAR UN NUEVO REGISTRO
    RECIBE COMO PARAMETRO OBJETO TIPO PLUSVALIA
  */
  guardarPlusvalia(plusvalia: Plusvalia) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    return this.httpClient.post(environment.API_ENDPOINT + '/plusvalia', plusvalia, {headers});
  }

  /*
    METODO QUE EDITA EL REGISTRO DE LA BASE DE DATOS
  */
  editarPlusvalia(plusvalia: Plusvalia) {
    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/plusvalia/' + plusvalia.id, plusvalia, {headers});
  }

}
