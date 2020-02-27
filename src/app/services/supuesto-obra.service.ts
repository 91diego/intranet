import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SupuestoObra } from '../interfaces/supuesto-obra';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupuestoObraService {

  constructor(private httpClient: HttpClient) { }

  /* GUARDA INFORMACION EN LA BD */
  guardarSupuestoObra(supuestoObra: SupuestoObra) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    return this.httpClient.post(environment.API_ENDPOINT + '/supuesto-obra', supuestoObra, {headers});
  }

  /*
    METODO QUE EDITA EL REGISTRO DE LA BASE DE DATOS
  */
  editarSupuestoObra(supuestoObra: SupuestoObra) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/supuesto-obra/' + supuestoObra.id, supuestoObra, {headers});
  }
}
