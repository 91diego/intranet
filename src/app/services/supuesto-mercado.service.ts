import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SupuestoMercado } from '../interfaces/supuesto-mercado';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupuestoMercadoService {

  constructor(private httpClient: HttpClient) { }

  /*
    METODO PARA GENERAR UN NUEVO REGISTRO
    RECIBE COMO PARAMETRO OBJETO TIPO SUPUESTOVENTA
  */
  guardarSupuestoMercado(supuestoMercado: SupuestoMercado) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    return this.httpClient.post(environment.API_ENDPOINT + '/supuesto-mercado', supuestoMercado, {headers});
  }

  /*
    METODO QUE EDITA EL REGISTRO DE LA BASE DE DATOS
  */
  editarSupuestoMercado(supuestoMercado: SupuestoMercado) {
    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/supuesto-mercado/' + supuestoMercado.id, supuestoMercado, {headers});
  }

}
