import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SupuestoVenta } from '../interfaces/supuesto-venta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupuestoVentaService {

  constructor(private httpClient: HttpClient) { }

  /*
    METODO PARA GENERAR UN NUEVO REGISTRO
    RECIBE COMO PARAMETRO OBJETO TIPO SUPUESTOVENTA
  */
  guardarSupuestoVenta(supuestoVenta: SupuestoVenta) {

    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    return this.httpClient.post(environment.API_ENDPOINT + '/supuesto-venta', supuestoVenta, {headers});
  }

  /*
    METODO QUE EDITA EL REGISTRO DE LA BASE DE DATOS
  */
  editarSupuestoVenta(supuestoVenta: SupuestoVenta) {
    const headers = new HttpHeaders( {'Content-Type': 'application/json'});
    // return desarrollo.costo_mantenimiento;
    return this.httpClient.put(environment.API_ENDPOINT + '/supuesto-venta/' + supuestoVenta.id, supuestoVenta, {headers});
  }
}
