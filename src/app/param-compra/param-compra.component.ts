import { Component, OnInit } from '@angular/core';
import { SupuestoCompra } from '../interfaces/supuesto-compra';
import { SupuestoCompraService } from '../services/supuesto-compra.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-param-compra',
  templateUrl: './param-compra.component.html',
  styleUrls: ['./param-compra.component.css']
})
export class ParamCompraComponent implements OnInit {

  id: any;

  // GUARDA INFORMACION QUE SE ENVIARA A LA API POR POST
  datos: SupuestoCompra = {

    nombre: null,
    inicio_plazo: null,
    fin_plazo: null,
    tipo_compra: null,
    desarrollo_id: null
  };

  // GUARDA LOS DATOS DE LA PETICION AL METODO GET
  supuestoCompra: SupuestoCompra[];

  constructor(private activatedRoute: ActivatedRoute,
              private supuestoCompraService: SupuestoCompraService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService) {

    this.id = this.activatedRoute.snapshot.params.id;
    this.datos.desarrollo_id = this.id;
    this.obtenerSupuestoCompra(this.id);

  }

  ngOnInit() {

    $( () => {

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR SUPUESTO DE VENTA */
      $('#check_supuesto_compra').on('change',  () => {

        console.log($('#check_supuesto_compra').val());
        if ($('#check_supuesto_compra').is(':checked') ) {
          $('#div_agregar_supuesto_compra').show();
        } else {

          $('#div_agregar_supuesto_compra').hide();
          $('#nombre_supuesto_compra').val('');
          $('#inicio_plazo_supuesto_compra').val('');
          $('#fin_plazo_supuesto_compra').val('');
          $('#tipo_supuesto_compra').val('');
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO PARA AGREGAR PISOS */

      $('#btn_agregar_supuesto_compra').on('click',  () => {

        $('#nombre_supuesto_compra').val('');
        $('#inicio_plazo_supuesto_compra').val('');
        $('#fin_plazo_supuesto_compra').val('');
        $('#tipo_supuesto_compra').val('');
      });

    });
  }

  /* CREA LOS CONCEPTOS DE LOS CODIGOS DE COMPRA */
  crearSupuestoCompra() {

    console.log('INFORMACION CODIGOS DE COMPRA');
    console.log(this.datos);
    this.supuestoCompraService.guardarSupuestoCompra(this.datos).subscribe(
      data => this.handleResponse(data, 'agregar_supuesto_compra'),
      error => this.handleError(error, 'agregar_supuesto_compra')
    );
  }
  /* FIN CREAR CODIGOS DE COMPRA */

  /* OBTIENE CODIGOS DE COMPRA */
  obtenerSupuestoCompra(id: number) {
    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-compra/' + id).subscribe(
      (data: SupuestoCompra[]) => {
        this.supuestoCompra = data;
        console.log('INFORMACION DE CODIGOS DE COMPRA');
        console.log(data);
      }
    );
  }
  /* FIN OBTENER CODIGOS DE COMPRA */

  /* EDITA SUPUESTO DE VENTA */
  editarSupuestoCompra(id: number) {

    let nombre: any;
    let inicioPlazo: any;
    let finPlazo: any;
    let tipoCompra: any;
    nombre = $('#nombre_codigo_' + id).val();
    inicioPlazo = $('#inicio_plazo_' + id).val();
    finPlazo = $('#fin_plazo_' + id).val();
    tipoCompra = $('#tipo_compra_' + id).val();
    console.log(nombre);
    console.log(inicioPlazo);
    console.log(finPlazo);
    console.log(tipoCompra);
    console.log(id);
    $('#botones_supuesto_compra_' + id).show();
    $('#btn_editar_supuesto_compra_' + id).hide();
    $('#nombre_codigo_' + id).prop('readonly', false);
    $('#x_' + id).prop('readonly', false);
    $('#inicio_plazo_' + id).prop('readonly', false);
    $('#fin_plazo_' + id).prop('readonly', false);
    // $('#div_tipo_compra_' + id).show();
    // $('#input_tipo_compra_' + id).hide();
    $('#tipo_compra_' + id).prop('readonly', false);
  }
  /* FIN EDITA SUPUESTO DE VENTA */

  /* GUARDA CAMBIOS DE LA EDICION */
  guardarCambios(id: number) {

    let nombre: any;
    let inicioPlazo: any;
    let finPlazo: any;
    let tipoCompra: any;
    nombre = $('#nombre_codigo_' + id).val();
    inicioPlazo = $('#inicio_plazo_' + id).val();
    finPlazo = $('#fin_plazo_' + id).val();
    tipoCompra = $('#tipo_compra_' + id).val();
    this.datos.nombre = nombre;
    this.datos.inicio_plazo = inicioPlazo;
    this.datos.fin_plazo = finPlazo;
    this.datos.tipo_compra = tipoCompra;
    this.datos.id = id;
    console.log(this.datos);

    this.supuestoCompraService.editarSupuestoCompra(this.datos).subscribe(
      data => this.handleResponse(data, 'modificar_supuesto_compra'),
      error => this.handleError(error, 'modificar_supuesto_compra')
    );
  }
  /* FIN GUARDA CAMBIOS EDICION */

  /* CANCELA CAMBIOS EDICION */
  cancelarCambios(id: number) {
    let nombre: any;
    let inicioPlazo: any;
    let finPlazo: any;
    let tipoCompra: any;
    nombre = $('#nombre_codigo_' + id).val();
    inicioPlazo = $('#inicio_plazo_' + id).val();
    finPlazo = $('#fin_plazo_' + id).val();
    tipoCompra = $('#tipo_compra_' + id).val();
    console.log(nombre);
    console.log(inicioPlazo);
    console.log(finPlazo);
    console.log(tipoCompra);
    $('#botones_supuesto_compra_' + id).hide();
    $('#btn_editar_supuesto_compra_' + id).show();
    $('#nombre_codigo_' + id).prop('readonly', true);
    $('#inicio_plazo_' + id).prop('readonly', true);
    $('#fin_plazo_' + id).prop('readonly', true);
    // $('#div_tipo_compra_' + id).hide();
    // $('#input_tipo_compra_' + id).show();
    $('#tipo_compra_' + id).prop('readonly', true);
    console.log('Cancelando');
  }
  /*FIN CANCELA CAMBIOS EDICION*/

  // Respuesta
  handleResponse(data: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_compra':
        this.notificacion.success('El supuesto de compra ha sido agregado', 'Registro exitoso.', {
          showProgressBar: false,
          timeout: 0,
          titleMaxLength: 200
        });
        this.obtenerSupuestoCompra(this.datos.desarrollo_id);
        this.datos.nombre = null;
        this.datos.inicio_plazo = null;
        this.datos.fin_plazo = null;
        this.datos.tipo_compra = null;
        break;
      case 'modificar_supuesto_compra':
        this.notificacion.success('La informacion del supuesto de compra ha sido modificada', 'Modificacion exitosa.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        $('#nombre_codigo_' + this.id).prop('readonly', true);
        $('#inicio_plazo_' + this.id).prop('readonly', true);
        $('#fin_plazo_' + this.id).prop('readonly', true);
        $('#tipo_compra_' + this.id).prop('readonly', true);
        $('#botones_supuesto_compra_' + this.id).hide();
        $('#btn_editar_supuesto_compra_' + this.id).show();
        // $('#div_tipo_compra_' + id).hide();
        // $('#input_tipo_compra_' + id).show();
        console.log(data);
        break;
    }
    console.log(data);
  }
  // Manejo de errores
  handleError(error: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_compra':
        this.notificacion.error('Error al agregar el supuesto de compra', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
      case 'modificar_supuesto_compra':
        this.notificacion.error('Error al modificar el supuesto de compra', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
    }
  }

}
