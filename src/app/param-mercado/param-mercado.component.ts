import { Component, OnInit } from '@angular/core';
import { SupuestoMercado } from '../interfaces/supuesto-mercado';
import { SupuestoMercadoService } from '../services/supuesto-mercado.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-param-mercado',
  templateUrl: './param-mercado.component.html',
  styleUrls: ['./param-mercado.component.css']
})
export class ParamMercadoComponent implements OnInit {

  id: any;

  // GUARDA INFORMACION QUE SE ENVIARA A LA API POR POST
  datos: SupuestoMercado = {

    valor_renta: null,
    costo_mantenimiento: null,
    costo_cierre: null,
    inflacion: null,
    desarrollo_id: null,
  };

  // GUARDA LOS DATOS DE LA PETICION AL METODO GET
  supuestoMercado: SupuestoMercado[];

  constructor(private activatedRoute: ActivatedRoute,
              private supuestoMercadoService: SupuestoMercadoService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService) {

    this.id = this.activatedRoute.snapshot.params.id;
    this.datos.desarrollo_id = this.id;
    this.obtenerSupuestoMercado(this.id);
  }

  ngOnInit() {

    $(document).ready( () => {

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR SUPUESTO DE VENTA */
      $('#check_supuesto_mercado').on('change', () => {

        console.log($('#check_supuesto_mercado').val());
        if( $('#check_supuesto_mercado').is(':checked') ) {
          $('#div_agregar_supuesto_mercado').show();
        } else {

          $('#div_agregar_supuesto_mercado').hide();
          $('#valor_renta').val('');
          $('#costo_mantenimiento').val('');
          $('#costo_cierre').val('');
          $('#inflacion').val('');
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO PARA AGREGAR PISOS */

      $('#btn_agregar_supuesto_mercado').on('click', () => {

        $('#valor_renta').val('');
        $('#costo_mantenimiento').val('');
        $('#costo_cierre').val('');
        $('#inflacion').val('');
        $('#check_supuesto_mercado').prop('checked', false);
        $('#div_agregar_supuesto_mercado').hide();
      });

    });

  }

  /* CREA LOS CONCEPTOS DEL SUPUESTO DE MERCADO */
  crearSupuestoMercado() {

    console.log('INFORMACION SUPUESTO DE VENTA');
    console.log(this.datos);
    this.supuestoMercadoService.guardarSupuestoMercado(this.datos).subscribe(
      data => this.handleResponse(data, 'agregar_supuesto_mercado'),
      error => this.handleError(error, 'agregar_supuesto_mercado')
    );
  }
  /* FIN CREAR CONCEPTOS */

  /* OBTIENE LOS SUPUESTO DE VENTA */
  obtenerSupuestoMercado(id: number) {
    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-mercado/' + id).subscribe(
      (data: SupuestoMercado[]) => {
        this.supuestoMercado = data;
        console.log('INFORMACION SUPUESTOS DE MERCADO');
        console.log(data);
      }
    );
  }
  /* FIN OBTENER SUPUESTO DE VENTA */

  /* EDITA SUPUESTO DE VENTA */
  editarSupuestoMercado(id: number) {

    console.log(id);
    $('#botones_supuesto_mercado_' + id).show();
    $('#btn_editar_supuesto_mercado_' + id).hide();
    $('#valor_renta_' + id).prop('readonly', false);
    $('#costo_mantenimiento_' + id).prop('readonly', false);
    $('#costo_cierre_' + id).prop('readonly', false);
    $('#inflacion_' + id).prop('readonly', false);
  }
  /* FIN EDITA SUPUESTO DE VENTA */

  /* GUARDA CAMBIOS DE LA EDICION */
  guardarCambios(id: number) {

    let valor_renta: any;
    let costo_mantenimiento: any;
    let costo_cierre: any;
    let inflacion: any;
    valor_renta = $('#valor_renta_' + id).val();
    costo_mantenimiento = $('#costo_mantenimiento_' + id).val();
    costo_cierre = $('#costo_cierre_' + id).val();
    inflacion = $('#inflacion_' + id).val();
    this.datos.valor_renta = valor_renta;
    this.datos.costo_mantenimiento = costo_mantenimiento;
    this.datos.costo_cierre = costo_cierre;
    this.datos.inflacion = inflacion;
    this.datos.id = id;
    console.log(this.datos);
    this.supuestoMercadoService.editarSupuestoMercado(this.datos).subscribe(
      data => this.handleResponse(data, 'modificar_supuesto_mercado'),
      error=> this.handleError(error, 'modificar_supuesto_mercado')
    );
  }
  /* FIN GUARDA CAMBIOS EDICION */

  /* CANCELA CAMBIOS EDICION */
  cancelarCambios(id: number) {

    $('#botones_supuesto_mercado_' + id).hide();
    $('#btn_editar_supuesto_mercado_' + id).show();
    $('#valor_renta_' + id).prop('readonly', true);
    $('#costo_mantenimiento_' + id).prop('readonly', true);
    $('#costo_cierre_' + id).prop('readonly', true);
    $('#inflacion_' + id).prop('readonly', true);
    console.log('Cancelando');
  }
  /*FIN CANCELA CAMBIOS EDICION*/

  // Respuesta
  handleResponse(data: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_mercado':
        this.notificacion.success('El supuesto de mercado ha sido agregado.');
        this.obtenerSupuestoMercado(this.datos.desarrollo_id);
        this.datos.valor_renta = null;
        this.datos.costo_mantenimiento = null;
        this.datos.costo_cierre = null;
        this.datos.inflacion = null;
        break;
      case 'modificar_supuesto_mercado':
        this.notificacion.success('La informacion del supuesto de mercado ha sido modificada.');
        $('#valor_renta_' + this.id).prop('readonly', true);
        $('#costo_mantenimiento_' + this.id).prop('readonly', true);
        $('#costo_cierre_' + this.id).prop('readonly', true);
        $('#inflacion_' + this.id).prop('readonly', true);
        $('#btn_editar_supuesto_mercado_' + this.id).show();
        $('#botones_supuesto_mercado_' + this.id).hide();
        console.log(data);
        break;
    }

  }
  // Manejo de errores
  handleError(error: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_mercado':
        this.notificacion.error('Ha ocurrido un error al agregar el supuesto de mercado.');
        console.log(error);
        break;
      case 'modificar_supuesto_mercado':
        this.notificacion.error('Ha ocurrido un error al modificar la informacion del supuesto de mercado.');
        console.log(error);
        break;
    }
  }

}
