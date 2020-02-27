import { Component, OnInit } from '@angular/core';
import { SupuestoVentaService } from '../services/supuesto-venta.service';
import { SupuestoVenta } from '../interfaces/supuesto-venta';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-param-venta',
  templateUrl: './param-venta.component.html',
  styleUrls: ['./param-venta.component.css']
})
export class ParamVentaComponent implements OnInit {

  id: any;
  // GUARDA INFORMACION QUE SE ENVIARA A LA API POR POST
  datos: SupuestoVenta = {

    nombre: null,
    porcentaje_firma: null,
    porcentaje_plazo: null,
    meses_plazo: null,
    porcentaje_escritura: null,
    porcentaje_descuento: null,
    porcentaje_rendimiento: null,
    desarrollo_id: null
  };

  // GUARDA LOS DATOS DE LA PETICION AL METODO GET
  supuestoVenta: SupuestoVenta[];

  constructor(private activatedRoute: ActivatedRoute,
              private supuestoVentaService: SupuestoVentaService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.datos.desarrollo_id = this.id;
    this.obtenerSupuestoVenta(this.id);
  }

  ngOnInit() {

    $( () => {

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR SUPUESTO DE VENTA */
      $('#check_supuesto_venta').on('change', () => {

        console.log($('#check_supuesto_venta').val());
        if ( $('#check_supuesto_venta').is(':checked') ) {
          $('#div_agregar_supuesto_venta').show();
        } else {
          $('#div_agregar_supuesto_venta').hide();
          $('#nombre').val('');
          $('#porcentaje_firma').val('');
          $('#porcentaje_plazo').val('');
          $('#meses_plazo').val('');
          $('#porcentaje_escritura').val('');
          $('#porcentaje_descuento').val('');
          $('#porcentaje_rendimiento').val('');
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO PARA AGREGAR PISOS */

      $('#btn_agregar_supuesto_venta').on('click', () => {

        $('#nombre').val('');
        $('#porcentaje_firma').val('');
        $('#porcentaje_plazo').val('');
        $('#meses_plazo').val('');
        $('#porcentaje_escritura').val('');
        $('#porcentaje_descuento').val('');
        $('#porcentaje_rendimiento').val('');
      });

    });

  }

  /* CREA LOS CONCEPTOS DEL SUPUESTO DE VENTA */
  crearSupuestoVenta() {

    console.log('INFORMACION SUPUESTO DE VENTA');
    console.log(this.datos);
    this.supuestoVentaService.guardarSupuestoVenta(this.datos).subscribe(
      data => this.handleResponse(data, 'agregar_supuesto_venta'),
      error => this.handleError(error, 'agregar_supuesto_venta')
    );
  }
  /* FIN CREAR CONCEPTOS */

  /* OBTIENE LOS SUPUESTO DE VENTA */
  obtenerSupuestoVenta(id: number) {
    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-venta/' + id).subscribe(
      (data: SupuestoVenta[]) => {
        this.supuestoVenta = data;
        console.log('INFORMACION SUPUESTOS DE VENTA');
        console.log(data);
      }
    );
  }
  /* FIN OBTENER SUPUESTO DE VENTA */

  /* EDITA SUPUESTO DE VENTA */
  editarSupuestoVenta(id: number) {

    console.log(id);
    $('#botones_supuesto_venta_' + id).show();
    $('#btn_editar_supuesto_venta_' + id).hide();
    $('#nombre_' + id).prop('readonly', false);
    $('#porcentaje_firma_' + id).prop('readonly', false);
    $('#porcentaje_plazo_' + id).prop('readonly', false);
    $('#meses_plazo_' + id).prop('readonly', false);
    $('#porcentaje_escritura_' + id).prop('readonly', false);
    $('#porcentaje_descuento_' + id).prop('readonly', false);
    $('#porcentaje_rendimiento_' + id).prop('readonly', false);
  }
  /* FIN EDITA SUPUESTO DE VENTA */

  /* GUARDA CAMBIOS DE LA EDICION */
  guardarCambios(id: number) {

    let nombre: any;
    let porcentajeFirma: any;
    let porcentajePlazo: any;
    let mesesPlazo: any;
    let porcentajeEscritura: any;
    let porcentajeDescuento: any;
    let porcentajeRendimiento: any;
    nombre = $('#nombre_' + id).val();
    porcentajeFirma = $('#porcentaje_firma_' + id).val();
    porcentajePlazo = $('#porcentaje_plazo_' + id).val();
    mesesPlazo = $('#meses_plazo_' + id).val();
    porcentajeEscritura = $('#porcentaje_escritura_' + id).val();
    porcentajeDescuento = $('#porcentaje_descuento_' + id).val();
    porcentajeRendimiento = $('#porcentaje_rendimiento_' + id).val();
    this.datos.nombre = nombre;
    this.datos.porcentaje_firma = porcentajeFirma;
    this.datos.porcentaje_plazo = porcentajePlazo;
    this.datos.meses_plazo = mesesPlazo;
    this.datos.porcentaje_escritura = porcentajeEscritura;
    this.datos.porcentaje_descuento = porcentajeDescuento;
    this.datos.porcentaje_rendimiento = porcentajeRendimiento;
    this.datos.id = id;
    console.log(this.datos);
    this.supuestoVentaService.editarSupuestoVenta(this.datos).subscribe(
      data => this.handleResponse(data, 'modificar_supuesto_venta'),
      error => this.handleError(error, 'modificar_supuesto_venta')
    );
  }
  /* FIN GUARDA CAMBIOS EDICION */

  /* CANCELA CAMBIOS EDICION */
  cancelarCambios(id: number) {

    $('#botones_supuesto_venta_' + id).hide();
    $('#btn_editar_supuesto_venta_' + id).show();
    $('#nombre_' + id).prop('readonly', true);
    $('#porcentaje_firma_' + id).prop('readonly', true);
    $('#porcentaje_plazo_' + id).prop('readonly', true);
    $('#meses_plazo_' + id).prop('readonly', true);
    $('#porcentaje_escritura_' + id).prop('readonly', true);
    $('#porcentaje_descuento_' + id).prop('readonly', true);
    $('#porcentaje_rendimiento_' + id).prop('readonly', true);
    console.log('Cancelando');
  }
  /*FIN CANCELA CAMBIOS EDICION*/

  // Respuesta
  handleResponse(data: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_venta':
        this.notificacion.success('El supuesto de venta ha sido agregado.');
        this.datos.nombre = null;
        this.datos.porcentaje_firma = null;
        this.datos.porcentaje_plazo = null;
        this.datos.meses_plazo = null;
        this.datos.porcentaje_escritura = null;
        this.datos.porcentaje_descuento = null;
        this.datos.porcentaje_rendimiento = null;
        this.obtenerSupuestoVenta(this.datos.desarrollo_id);
        break;
      case 'modificar_supuesto_venta':
        this.notificacion.success('La informacion del supuesto de venta ha sido modificada.');
        $('#nombre_' + this.id).prop('readonly', true);
        $('#porcentaje_firma_' + this.id).prop('readonly', true);
        $('#porcentaje_plazo_' + this.id).prop('readonly', true);
        $('#meses_plazo_' + this.id).prop('readonly', true);
        $('#porcentaje_escritura_' + this.id).prop('readonly', true);
        $('#porcentaje_descuento_' + this.id).prop('readonly', true);
        $('#porcentaje_rendimiento_' + this.id).prop('readonly', true);
        $('#btn_editar_supuesto_venta_' + this.id).show();
        $('#botones_supuesto_venta_' + this.id).hide();
        console.log(data);
        break;
    }
    console.log(data);
  }
  // Manejo de errores
  handleError(error: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_venta':
        this.notificacion.error('Ha ocurrido un error al agregar el supuesto venta.');
        console.log(error);
        break;
      case 'modificar_supuesto_venta':
        this.notificacion.error('Ha ocurrido un error al modificar la informacion del supuesto de venta.');
        console.log(error);
        break;
    }
  }

}
