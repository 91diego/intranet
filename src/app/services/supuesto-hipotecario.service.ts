import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SupuestoHipotecario } from '../interfaces/supuesto-hipotecario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupuestoHipotecarioService {

  constructor(private httpClient: HttpClient) { }

  /*
    METODO PARA GENERAR UN NUEVO REGISTRO
    RECIBE COMO PARAMETRO OBJETO TIPO SUPUESTOHIPOTECARIO
  */
  guardarSupuestoHipotecario(supuestoHipotecario: SupuestoHipotecario) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    return this.httpClient.post(environment.API_ENDPOINT + '/supuesto-hipotecario', supuestoHipotecario, {headers});
  }

/*
  METODO QUE EDITA EL REGISTRO DE LA BASE DE DATOS
*/
  editarSupuestoHipotecario(supuestoHipotecario: SupuestoHipotecario) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/supuesto-hipotecario/' + supuestoHipotecario.id, supuestoHipotecario, {headers});
  }

}
