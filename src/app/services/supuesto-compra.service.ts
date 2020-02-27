import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SupuestoCompra } from '../interfaces/supuesto-compra';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupuestoCompraService {

  constructor(private httpClient: HttpClient) { }

  /*
    METODO PARA GENERAR UN NUEVO REGISTRO
    RECIBE COMO PARAMETRO OBJETO TIPO SUPUESTOHIPOTECARIO
  */
  guardarSupuestoCompra(supuestoCompra: SupuestoCompra) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    return this.httpClient.post(environment.API_ENDPOINT + '/supuesto-compra', supuestoCompra, {headers});
  }

  /*
  METODO QUE EDITA EL REGISTRO DE LA BASE DE DATOS
  */
  editarSupuestoCompra(supuestoCompra: SupuestoCompra) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/supuesto-compra/' + supuestoCompra.id, supuestoCompra, {headers});
  }
}
